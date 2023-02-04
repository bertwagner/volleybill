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

    # Combine the data responses
    from collections import defaultdict

    # Using defaultdict
    temp = defaultdict(list) 
    
    # Using extend
    for elem in payments_response['Items']:
        temp[elem['Payer']] = elem
    
    for elem in dates_response['Items']:
        temp[elem['Player']] = elem.update(temp[elem['Player']])
    
    #Output = [{"roll_no":y, "school_id":x} for x, y in temp.items()]
    response = temp
    # response = {
    #     'payments': payments_response['Items'],
    #     'dates': dates_response['Items']
    # }

    results = json.dumps(response, cls=DecimalEncoder)

    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": results
    }
