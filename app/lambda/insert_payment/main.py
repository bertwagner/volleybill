import boto3
import json
import datetime

def lambda_handler(event, context):
    gameData = json.loads(event['body'])

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('VolleyBill')

    insertDate = datetime.datetime.utcnow().isoformat()

    table.update_item(
        Key={
            'PK': f"league#{gameData['League']}_season#{gameData['Season']}_payer#{gameData['Payer']}",
            'SK': f"payee#{gameData['Payee']}_date#{gameData['PaymentDate']}"
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

    return {
        "statusCode": 200,
        'headers': {'Content-Type': 'application/json'},
        "body": ""
    }
