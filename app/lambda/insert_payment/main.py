import boto3
import json
import datetime
from decimal import Decimal

def lambda_handler(event, context):
    gameData = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('VolleyBill')

    insertDate = datetime.datetime.utcnow().isoformat()

    table.update_item(
        Key={
            'PK': f"league#{gameData['League']}_season#{gameData['Season']}",
            'SK': f"payer#{gameData['Payer']}_payee#{gameData['Payee']}_date#{gameData['PaymentDate']}"
        },
        UpdateExpression='SET Payer = :p, Payee = :pe, Amount = :a, PaymentDate = :pd, InsertDate = :id',
        ExpressionAttributeValues={
            ':p': gameData['Payer'],
            ':pe': gameData['Payee'],
            ':a': gameData['Amount'],
            ':pd': gameData['PaymentDate'],
            ':id': insertDate
        }
    )

    table.update_item(
        Key={
            'PK': f"league#{gameData['League']}_season#{gameData['Season']}",
            'SK': f"stats_payer#{gameData['Payer']}"
        },
        UpdateExpression='SET Payer = :p, AmountPaid = if_not_exists(AmountPaid,:z) + :gw, UpdateDate = :ud',
        ExpressionAttributeValues={
            ':p': gameData['Payer'],
            ':z': 0,
            ':gw': Decimal(gameData['Amount']),
            ':ud': insertDate
        }
    )


    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": ""
    }
