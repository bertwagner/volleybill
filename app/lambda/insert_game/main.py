import boto3
import json
import datetime


def lambda_handler(event, context):
    gameData = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('VolleyBill')

    insertDate = datetime.datetime.utcnow().isoformat()

    # calculate game and match wins/losses stats
    playerStats = {}

    for player in gameData['Teams'][0]:
        if gameData['Scores'][0] > gameData['Scores'][1]:
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
        if gameData['Scores'][1] > gameData['Scores'][0]:
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

    for team in gameData['Teams']:
        for player in team:
            table.put_item(
                Item={
                    'PK': f"player#{player}",
                    'SK': f"league#{gameData['League']}_season#{gameData['Season']}",
                    'InsertDate': insertDate
                }
            )
            table.put_item(
                Item={
                    'PK': f"league#{gameData['League']}_season#{gameData['Season']}_player#{player}",
                    'SK': f"game#{insertDate}",
                    'InsertDate': insertDate
                }
            )
            table.update_item(
                Key={
                    'PK': f"league#{gameData['League']}_season#{gameData['Season']}_player#{player}",
                    'SK': f"stats"
                },
                UpdateExpression='SET GamesWon = if_not_exists(GamesWon,:z) + :gw, GamesLost = if_not_exists(GamesLost,:z) + :gl, TotalGamesPlayed = if_not_exists(TotalGamesPlayed,:z) + :tgp, UpdateDate = :ud',
                ExpressionAttributeValues={
                    ':z': 0,
                    ':gw': playerStats[player]['GamesWon'],
                    ':gl': playerStats[player]['GamesLost'],
                    ':tgp': 1,
                    ':ud': insertDate
                }
            )

    table.put_item(
        Item={
            'PK': f"league#{gameData['League']}_season#{gameData['Season']}",
            'SK': f"game#{insertDate}"
        }
    )

    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": ""
    }
