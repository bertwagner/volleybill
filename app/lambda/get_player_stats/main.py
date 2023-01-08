import boto3
from dynamodb_json import json_util as json

def lambda_handler(event, context):
    gameData = event['queryStringParameters']
    print(gameData['league'])
    print(gameData['season'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('VolleyBill')

    response = table.query(
        KeyConditionExpression='PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues={
            ":pk": f"league#{gameData['league']}_season#{gameData['season']}",
            ":sk": "stats_player#"
        }
    )

    print(response['Items'])
    print(json.dumps(response['Items']))


    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": json.dumps(response['Items'])
    }
