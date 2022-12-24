# resource "aws_cloudwatch_log_group" "apigateway_image_uploader_signature" {
#   name = "/aws/apigateway/image-uploader-signature"
#   retention_in_days = 14
# }

resource "aws_cloudwatch_log_group" "lambda-insert-game" {
  name              = "/aws/lambda/${var.app_name}-insert-game"
  retention_in_days = 14
}