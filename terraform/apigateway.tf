resource "aws_apigatewayv2_api" "app_api" {
  name          = "${var.domain}-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["https://${var.domain}"]
  }
}

resource "aws_apigatewayv2_integration" "insert_game_integration" {
  api_id           = aws_apigatewayv2_api.app_api.id
  integration_type = "AWS_PROXY"

  connection_type           = "INTERNET"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.insert_game.invoke_arn
}

resource "aws_apigatewayv2_route" "insert_game_api" {
  api_id    = aws_apigatewayv2_api.app_api.id
  route_key = "GET /insert-game"
  target = "integrations/${aws_apigatewayv2_integration.insert_game_integration.id}"
}

resource "aws_apigatewayv2_stage" "app_api_stage" {
  api_id = aws_apigatewayv2_api.app_api.id
  name   = "v1"
  auto_deploy = "true"

  default_route_settings {
    throttling_burst_limit = 20
    throttling_rate_limit  = 50
  }

  access_log_settings {
     destination_arn = aws_cloudwatch_log_group.apigateway.arn
     format = "{ \"requestId\":\"$context.requestId\",\"extendedRequestId\":\"$context.extendedRequestId\",\"ip\": \"$context.identity.sourceIp\",\"caller\":\"$context.identity.caller\",\"user\":\"$context.identity.user\",\"requestTime\":\"$context.requestTime\",\"httpMethod\":\"$context.httpMethod\",\"resourcePath\":\"$context.resourcePath\",\"status\":\"$context.status\",\"protocol\":\"$context.protocol\", \"responseLength\":\"$context.responseLength\" }"
  }
}

resource "aws_apigatewayv2_domain_name" "app_api_domain" {
  domain_name = "api.${var.domain}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.cert.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "app_api" {
  api_id      = aws_apigatewayv2_api.app_api.id
  domain_name = aws_apigatewayv2_domain_name.app_api_domain.id
  stage       = aws_apigatewayv2_stage.app_api_stage.id
}

