resource "aws_cloudwatch_log_group" "lambda-insert-game" {
  name              = "/aws/lambda/${var.app_name}-insert-game"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "apigateway" {
  name = "/aws/apigateway/${var.domain}-apigateway"
  retention_in_days = 14
}