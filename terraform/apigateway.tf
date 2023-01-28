resource "aws_apigatewayv2_api" "app_api" {
  name          = "${var.domain}-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["https://${var.domain}","https://api.${var.domain}"]
    allow_methods = ["GET","POST","OPTIONS"]
    allow_headers = ["Authorization","X-Amz-Target","Content-Type","Access-Control-Allow-Origin","Access-Control-Allow-Headers"]
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
  route_key = "POST /insert-game"
  target = "integrations/${aws_apigatewayv2_integration.insert_game_integration.id}"
  authorization_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
}


resource "aws_apigatewayv2_integration" "get_player_stats_integration" {
  api_id           = aws_apigatewayv2_api.app_api.id
  integration_type = "AWS_PROXY"

  integration_uri           = aws_lambda_function.get_player_stats.invoke_arn
}

resource "aws_apigatewayv2_route" "get_player_stats_api" {
  api_id    = aws_apigatewayv2_api.app_api.id
  route_key = "GET /get-player-stats"
  target = "integrations/${aws_apigatewayv2_integration.get_player_stats_integration.id}"
}

resource "aws_apigatewayv2_integration" "insert_payment_integration" {
  api_id           = aws_apigatewayv2_api.app_api.id
  integration_type = "AWS_PROXY"

  connection_type           = "INTERNET"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.insert_payment.invoke_arn
}

resource "aws_apigatewayv2_route" "insert_payment_api" {
  api_id    = aws_apigatewayv2_api.app_api.id
  route_key = "POST /insert-payment"
  target = "integrations/${aws_apigatewayv2_integration.insert_payment_integration.id}"
  authorization_type = "JWT"
  authorizer_id = aws_apigatewayv2_authorizer.auth.id
}


resource "aws_apigatewayv2_integration" "get_payment_stats_integration" {
  api_id           = aws_apigatewayv2_api.app_api.id
  integration_type = "AWS_PROXY"

  integration_uri           = aws_lambda_function.get_payment_stats.invoke_arn
}

resource "aws_apigatewayv2_route" "get_payment_stats_api" {
  api_id    = aws_apigatewayv2_api.app_api.id
  route_key = "GET /get-payment-stats"
  target = "integrations/${aws_apigatewayv2_integration.get_payment_stats_integration.id}"
}








resource "aws_apigatewayv2_authorizer" "auth" {
  api_id           = aws_apigatewayv2_api.app_api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.pool_client.id]
    issuer   = "https://${aws_cognito_user_pool.pool.endpoint}"
  }
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
     format = "{ \"requestId\":\"$context.requestId\",\"extendedRequestId\":\"$context.extendedRequestId\",\"ip\": \"$context.identity.sourceIp\",\"caller\":\"$context.identity.caller\",\"user\":\"$context.identity.user\",\"requestTime\":\"$context.requestTime\",\"httpMethod\":\"$context.httpMethod\",\"resourcePath\":\"$context.resourcePath\",\"status\":\"$context.status\",\"protocol\":\"$context.protocol\", \"responseLength\":\"$context.responseLength\",\"integrationErrorMessage\":\"$context.integrationErrorMessage\" }"
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


