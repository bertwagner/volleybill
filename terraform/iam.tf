# iam for lambdas
resource "aws_iam_role" "lambda_assume_role_dynamodb" {
  name = "lambda_assume_role_dynamodb"

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
        "Action": "sts:AssumeRole",
        "Principal": {
            "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
        }
    ]
  })
}

resource "aws_iam_policy" "lambda_assume_role_dynamodb" {
  name = "${var.app_name}-lambda-assume-role-dynamodb"
  policy = templatefile("policies/iam-lambda-assume-role-dynamodb.json", { BASE_ARN = "arn:aws:dynamodb:us-east-1:756669507085:table"})
}

resource "aws_iam_role_policy_attachment" "lambda_assume_role_dynamodb" {
  role = aws_iam_role.lambda_assume_role_dynamodb.name
  policy_arn = aws_iam_policy.lambda_assume_role_dynamodb.arn
}