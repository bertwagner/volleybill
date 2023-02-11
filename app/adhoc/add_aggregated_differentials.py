import boto3
import json 
from decimal import Decimal
import datetime

# A script that adds data to the table based on a historical data pull

# get all of the existing data into memory
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('VolleyBill')

response = table.scan()
data = response['Items']

while 'LastEvaluatedKey' in response:
    response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
    data.extend(response['Items'])

insertDate = datetime.datetime.utcnow().isoformat()

# add dates_players records
for item in data:
    if item['SK'].startswith('player#'):
        table.update_item(
                Key={
                    'PK': f"league#{item['League']}_season#{item['Season']}",
                    'SK': f"stats_player#{item['Player']}"
                },
                UpdateExpression='SET TotalPointDifferential = if_not_exists(TotalPointDifferential,:z) + :pd, UpdateDate = :ud',
                ExpressionAttributeValues={
                    ':z': 0,
                    ':pd': int(item['PointDifferential']),
                    ':ud': insertDate
                }
            )