import boto3
import json
import datetime

def lambda_handler(event, context):
    data=json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Game')

    insertDate = datetime.datetime.utcnow().isoformat()
    
    table.put_item(
        Item={
                'GameId': f"{data['Date']}_{data['Game']}",
                'Player': data['Player'],
                'Date': data['Date'],
                'Season': data['Season'],
                'Team': data['Team'],
                'Game': data['Game'],
                'Points': data['Points'],
                'InsertDate': insertDate
            },
        ConditionExpression='attribute_not_exists(GameId) AND attribute_not_exists(Player)'
            
        )

    return {
        "statusCode": 200,
        'headers': { 'Content-Type': 'application/json' },
        "body": ""
    }