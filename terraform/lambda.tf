resource "aws_lambda_function" "insert_game" {
  function_name = "${var.app_name}-insert-game"
  role          = aws_iam_role.lambda_assume_role_dynamodb.arn

  runtime = "python3.9"
  s3_bucket = aws_s3_bucket.lambda_functions.bucket
  s3_key = "insert_game.zip"
  handler       = "main.lambda_handler"
  
}

resource "aws_lambda_permission" "insert_game" {
	action        = "lambda:InvokeFunction"
	function_name = aws_lambda_function.insert_game.arn
	principal     = "apigateway.amazonaws.com"

	source_arn = "${aws_apigatewayv2_api.app_api.execution_arn}/*/*/*"
}



resource "aws_lambda_function" "summarize_game" {
  function_name = "${var.app_name}-summarize-game"
  role          = aws_iam_role.lambda_assume_role_dynamodb.arn

  runtime = "python3.9"
  s3_bucket = aws_s3_bucket.lambda_functions.bucket
  s3_key = "summarize_game.zip"
  handler       = "main.lambda_handler"
}

resource "aws_lambda_event_source_mapping" "summarize_game" {
  event_source_arn  = aws_dynamodb_table.game_table.stream_arn
  function_name     = aws_lambda_function.summarize_game.arn
  starting_position = "LATEST"
}