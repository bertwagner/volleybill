import boto3
import json
import datetime

def calculate_stats(gameData):
    playerStats = {}
    for player in gameData['Teams'][0]:
        if int(gameData['Scores'][0]) > int(gameData['Scores'][1]):
            gamesWon = 1
            gamesLost = 0
        else:
            gamesWon = 0
            gamesLost = 1

        stats = {
            'GamesWon': gamesWon,
            'GamesLost': gamesLost,
        }

        playerStats[player] = stats

    for player in gameData['Teams'][1]:
        if int(gameData['Scores'][1]) > int(gameData['Scores'][0]):
            gamesWon = 1
            gamesLost = 0
        else:
            gamesWon = 0
            gamesLost = 1

        stats = {
            'GamesWon': gamesWon,
            'GamesLost': gamesLost,
        }

        playerStats[player] = stats

    return playerStats

def lambda_handler(event, context):
    gameData = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('VolleyBill')

    insertDate = datetime.datetime.utcnow().isoformat()

    playerStats = calculate_stats(gameData)
    print('calculated stats:', playerStats)
    teamId=-1

    for team in gameData['Teams']:
        teamId=teamId+1
        otherTeamId=1 if teamId==0 else 0

        for player in team:
            # table.put_item(
            #     Item={
            #         'PK': f"player#{player}",
            #         'SK': f"league#{gameData['League']}_season#{gameData['Season']}",
            #         'InsertDate': insertDate
            #     }
            # )
            table.put_item(
                Item={
                    'PK': f"league#{gameData['League']}_season#{gameData['Season']}_game#{insertDate}",
                    'SK': f"player#{player}",
                    'League': gameData['League'],
                    'Season': gameData['Season'],
                    'Player': player,
                    'Team': teamId,
                    'Points': gameData['Scores'][teamId],
                    'IsWin': True if int(gameData['Scores'][teamId]) > int(gameData['Scores'][otherTeamId]) else False,
                    'PointDifferential': int(gameData['Scores'][teamId]) - int(gameData['Scores'][otherTeamId]),
                    'InsertDate': insertDate
                }
            )
            table.update_item(
                Key={
                    'PK': f"league#{gameData['League']}_season#{gameData['Season']}",
                    'SK': f"stats_player#{player}"
                },
                UpdateExpression='SET Player = :p, GamesWon = if_not_exists(GamesWon,:z) + :gw, GamesLost = if_not_exists(GamesLost,:z) + :gl, TotalGamesPlayed = if_not_exists(TotalGamesPlayed,:z) + :tgp, UpdateDate = :ud',
                ExpressionAttributeValues={
                    ':p': player,
                    ':z': 0,
                    ':gw': int(playerStats[player]['GamesWon']),
                    ':gl': int(playerStats[player]['GamesLost']),
                    ':tgp': 1,
                    ':ud': insertDate
                }
            )

    # table.put_item(
    #     Item={
    #         'PK': f"league#{gameData['League']}_season#{gameData['Season']}",
    #         'SK': f"game#{insertDate}"
    #     }
    # )

    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": ""
    }
