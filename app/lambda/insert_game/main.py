import boto3
from botocore.exceptions import ClientError
import json
import datetime

def lambda_handler(event, context):
    gameData=json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Game')

    insertDate = datetime.datetime.utcnow().isoformat()
    
    try:
        table.put_item(
        Item={
                'League_Season_Date': f"{gameData['League']}_{gameData['Season']}_{gameData['Date']}",
                'Game': gameData['Game'],
                'League': gameData['League'],
                'Season': gameData['Season'],
                'Date': gameData['Date'],
                'Teams': gameData['Teams'],
                'Scores': gameData['Scores'],
                'InsertDate': insertDate
            },
        ConditionExpression='attribute_not_exists(League_Season_Date) AND attribute_not_exists(Game)'   
        )
    except ClientError  as e:
        print(e.response['Error']['Message'])
        return {
            "statusCode": 500,
            'headers': { 'Content-Type': 'application/json' },
            "body": json.dumps(e.response['Error'])
        }
    
    for team in gameData['Teams']:
        for player in team:
            dynamodb.Table('PlayerGame').put_item(
                Item={
                    'League_Season_Player': f"{gameData['League']}_{gameData['Season']}_{player}",
                    'PlayDate': gameData['Date']
                }
            )

    return {
        "statusCode": 200,
        'headers': { 'Content-Type': 'application/json' },
        "body": ""
    }