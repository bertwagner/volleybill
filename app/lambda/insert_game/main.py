import boto3
from botocore.exceptions import ClientError
import json
import datetime

def lambda_handler(event, context):
    tableData=json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Game')

    insertDate = datetime.datetime.utcnow().isoformat()
    
    for rowData in tableData:
        try:
            table.put_item(
            Item={
                    'GameId': f"{rowData['Date']}_{rowData['Game']}",
                    'Player': rowData['Player'],
                    'Date': rowData['Date'],
                    'Season': rowData['Season'],
                    'Team': rowData['Team'],
                    'Game': rowData['Game'],
                    'Points': rowData['Points'],
                    'InsertDate': insertDate
                },
            ConditionExpression='attribute_not_exists(GameId) AND attribute_not_exists(Player)'   
            )
        except ClientError  as e:
            print(e.response['Error']['Message'])
            return {
                "statusCode": 500,
                'headers': { 'Content-Type': 'application/json' },
                "body": json.dumps(e.response['Error'])
            }
    return {
        "statusCode": 200,
        'headers': { 'Content-Type': 'application/json' },
        "body": ""
    }