resource "aws_lambda_function" "insert_game" {
  function_name = "${var.app_name}-insert-game"
  role          = aws_iam_role.iam_lambda_insert_game.arn

  runtime = "python3.9"
  s3_bucket = aws_s3_bucket.lambda_functions.bucket
  s3_key = "insert_game.zip"
  handler       = "main.lambda_handler"
  
}

# resource "aws_lambda_permission" "insert_game" {
# 	action        = "lambda:InvokeFunction"
# 	function_name = aws_lambda_function.insert_game.arn
# 	principal     = "apigateway.amazonaws.com"

# 	source_arn = "${aws_apigatewayv2_api.image_uploader_signature_api.execution_arn}/*/*/*"
# }