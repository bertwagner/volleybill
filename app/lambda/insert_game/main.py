import boto3
from botocore.exceptions import ClientError
import json
import datetime

def lambda_handler(event, context):
    gameData=json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('VolleyBill')

    insertDate = datetime.datetime.utcnow().isoformat()
    
    # calculate game and match wins/losses stats
    playerStats = {}

    for player in gameData['Teams'][0]:
        if gameData['Scores'][0] > gameData['Scores'][1]:
            gamesWon=1
            gamesLost=0
        else:
            gamesWon=0
            gamesLost=1

        stats = {
            'GamesWon': gamesWon,
            'GamesLost': gamesLost,
        }
        
        playerStats[player] = stats

    for player in gameData['Teams'][1]:
        if gameData['Scores'][1] > gameData['Scores'][0]:
            gamesWon=1
            gamesLost=0
        else:
            gamesWon=0
            gamesLost=1

        stats = {
            'GamesWon': gamesWon,
            'GamesLost': gamesLost,
        }

        playerStats[player] = stats


    with table.batch_writer() as batch:
        for team in gameData['Teams']:
            for player in team:
                batch.put_item(
                    Item={
                        'PK': f"player#{player}",
                        'SK': f"league#{gameData['League']}_season#{gameData['Season']}",
                        'InsertDate': insertDate
                    }
                )
                batch.put_item(
                    Item={
                        'PK': f"league#{gameData['League']}_season#{gameData['Season']}_player#{player}",
                        'SK': f"game#{insertDate}",
                        'InsertDate': insertDate
                    }
                )
                batch.update_item(
                    Key={
                        'PK': {"S":f"league#{gameData['League']}_season#{gameData['Season']}_player#{player}"},
                        'SK': {"S":f"stats"}
                    },
                    UpdateExpression='SET GamesWon = GamesWon + :gw, GamesLost = GamesLost + :gl, TotalGamesPlayed = TotalGamesPlayed + 1, UpdateDate = :ud',
                    ExpressionAttributeValues={
                        ":gw":{ "N":int(player['GamesWon']) },
                        ":gl":{ "N":int(player['GamesLost']) },
                        ":ud":{ "S":insertDate }
                    }
                )

        batch.put_item(
            Item={
                'PK': f"league#{gameData['League']}_season#{gameData['Season']}",
                'SK': f"game#{insertDate}"
            }
        )

    return {
        "statusCode": 200,
        'headers': { 'Content-Type': 'application/json' },
        "body": ""
    }