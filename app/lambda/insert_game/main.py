import boto3

def lambda_handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Game')

    table.put_item(
        Item={
                'GameId': f"{event['Date']}_{event['Game']}",
                'Player': event['Player'],
                'Date': event['Date'],
                'Season': event['Season'],
                'Team': event['Team'],
                'Game': event['Game'],
                'Points': event['Points']
            }
        )

    return {
        "statusCode": 200,
        'headers': { 'Content-Type': 'application/json' },
        "body": {}
    }


test_data = {
    "Date": "2022-12-07",
    "Player": "Jeremy",
    "Season": 1,
    "Team": 1,
    "Game": 1,
    "Points": 21
}
lambda_handler(test_data,None)