# iam for lambdas
resource "aws_iam_role" "iam_lambda_insert_game" {
  name = "iam_lambda_insert_game"

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

resource "aws_iam_policy" "iam_lambda_insert_game" {
  name = "${var.app_name}-lambda-insert-game"
  policy = file("policies/iam-lambda-insert-game.json")
}

resource "aws_iam_role_policy_attachment" "iam_lambda_insert_game" {
  role = aws_iam_role.iam_lambda_insert_game.name
  policy_arn = aws_iam_policy.iam_lambda_insert_game.arn
}