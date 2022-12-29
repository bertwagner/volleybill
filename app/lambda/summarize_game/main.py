import boto3
from botocore.exceptions import ClientError
import json
import datetime

def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Game')

    for record in event['Records']:
        print(record['eventID'])
        print(record['eventName'])
        print(record['dynamodb'])
    return event
