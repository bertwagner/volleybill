import boto3
import json 
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal): return float(obj)

def lambda_handler(event, context):
    gameData = event['queryStringParameters']

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('VolleyBill')

    payments_response = table.query(
        KeyConditionExpression='PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues={
            ":pk": f"league#{gameData['league']}_season#{gameData['season']}",
            ":sk": "stats_payer#"
        }
    )
    dates_response = table.query(
        KeyConditionExpression='PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues={
            ":pk": f"league#{gameData['league']}_season#{gameData['season']}",
            ":sk": "dates_player#"
        }
    )

    response = {
        'payments': payments_response['Items'],
        'dates': dates_response['Items']
    }

    results = json.dumps(response, cls=DecimalEncoder)

    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": results
    }
