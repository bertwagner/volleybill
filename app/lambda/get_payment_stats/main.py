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
    results = defaultdict(list) 
    players_on_date = defaultdict(list)
    
    for elem in dates_response['Items']:
        results[elem['Player']] = elem
        for date in elem['PlayDates']:
            players_on_date[date].append(elem['Player'])
    for elem in payments_response['Items']:
        results[elem['Payer']].update(elem)
    
    dates_played = len(players_on_date.keys())
    cost_per_game = 30.0
    total_cost = dates_played*cost_per_game
    total_players_played = sum([len(date) for date in players_on_date.values()])
    avg_cost_per_game = total_cost / (total_players_played * 1.0)

    response = {
        'players': results,
        'avg_cost_per_game': avg_cost_per_game
    }

    results = json.dumps(response, cls=DecimalEncoder)

    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": results
    }
