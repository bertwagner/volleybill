import boto3
import json 
from decimal import Decimal
from collections import defaultdict

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal): return float(obj)
        if isinstance(obj, set): return list(obj)

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



    # Combine the data responses
    temp = defaultdict(list) 
    
    
    for elem in dates_response['Items']:
        temp[elem['Player']] = elem
    for elem in payments_response['Items']:
        temp[elem['Payer']].update(elem)
    

    response = temp

    results = json.dumps(response, cls=DecimalEncoder)

    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": results
    }
