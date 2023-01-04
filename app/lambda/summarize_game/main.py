import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr
import json
import datetime
from decimal import Decimal

def process_new_data(data):
    league = data['NewImage']['League']['N']
    season = data['NewImage']['Season']['N']
    date = data['NewImage']['Date']['S']
    insertDate = data['NewImage']['InsertDate']['S']
    game = data['Keys']['Game']['S']

    scoresRaw = data['NewImage']['Scores']['L']
    scores = [d['S'] for d in scoresRaw]

    teamsRaw = data['NewImage']['Teams']['L']
    team1Raw = teamsRaw[0]['L']
    team2Raw = teamsRaw[1]['L']
    teams = [[d['S'] for d in team1Raw],[d['S'] for d in team2Raw]]

    playerSummaries = []

    for player in teams[0]:
        if scores[0] > scores[1]:
            gamesWon=1
            gamesLost=0
        else:
            gamesWon=0
            gamesLost=1

        playerData = {
                'DaysPlayed': 1,
                'GamesWon': gamesWon,
                'GamesLost': gamesLost,
                'GameWinPercentage': gamesWon/(gamesWon+gamesLost)
            }
        
        playerSummaries.append({
            "Player": player,
            "PlayerData": playerData
            })

    for player in teams[1]:
        if scores[1] > scores[0]:
            gamesWon=1
            gamesLost=0
        else:
            gamesWon=0
            gamesLost=1

        playerData = {
                'DaysPlayed': 1,
                'GamesWon': gamesWon,
                'GamesLost': gamesLost,
                'GameWinPercentage': gamesWon/(gamesWon+gamesLost)
            }
        
        playerSummaries.append({
            "Player": player,
            "PlayerData": playerData
            })
            
    return (league,season,insertDate,playerSummaries)

def get_current_record(league,season,player):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('PlayerSummary')

    current_item=None

    response = table.get_item(
        Key={
            'League_Season': f"{league}_{season}",
            'Player': player
        }
    )
    
    if 'Item' in response:
        current_item=response['Item']

    return current_item

def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('PlayerSummary')
    updateDate = datetime.datetime.utcnow().isoformat()

    for record in event['Records']:
        data = record['dynamodb']

        league,season,insertDate,playerSummaries = process_new_data(data)

        current_items = [get_current_record(league,season,p['Player']) for p in playerSummaries]

        for i,current_item in enumerate(current_items):

            if current_item==None:
                # insert new record from process_new_data()
                new_item = {
                            'League_Season': f"{league}_{season}",
                            'Player': playerSummaries[i]['Player'],
                            'InsertDate': insertDate,
                            'UpdateDate': updateDate,
                            'DaysPlayed': playerSummaries[i]['PlayerData']['DaysPlayed'],
                            'GamesWon': playerSummaries[i]['PlayerData']['GamesWon'],
                            'GamesLost': playerSummaries[i]['PlayerData']['GamesLost'],
                            'GameWinPercentage': Decimal(playerSummaries[i]['PlayerData']['GameWinPercentage'])
                        }
                table.put_item(
                    Item=new_item,
                    ConditionExpression='attribute_not_exists(League_Season) AND attribute_not_exists(Player)'
                )
            else:
                # update existing record if this new streamed in record is more up to date than what is already in GameSummary
                if (current_item['InsertDate'] < insertDate):
                    #update game data
                    print('current_item in update:')
                    print(current_item)
                    daysPlayed=0 #current_item['PlayerData']['DaysPlayed']+playerSummaries[current_item['Player']]['DaysPlayed'] # this is wrong, need to + 1 only if current record has a different game date than the last record. Can't use insert/update dates because might be adding a game after the fact.
                    gamesWon=current_item['GamesWon']+playerSummaries[i]['PlayerData']['GamesWon']
                    gamesLost=current_item['GamesLost']+playerSummaries[i]['PlayerData']['GamesLost']
                    gameWinPercentage=Decimal(gamesWon/(gamesWon+gamesLost))

                    table.put_item(
                    Item={
                            'League_Season': f"{league}_{season}",
                            'Player': playerSummaries[i]['Player'],
                            'InsertDate': insertDate,
                            'UpdateDate': updateDate,
                            'DaysPlayed': daysPlayed,
                            'GamesWon': gamesWon,
                            'GamesLost': gamesLost,
                            'GameWinPercentage': gameWinPercentage
                        }
                    )

    return event
