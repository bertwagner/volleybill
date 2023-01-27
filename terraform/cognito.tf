resource "aws_cognito_user_pool" "pool" {
  name = "${var.app_name}-pool"
}

resource "aws_cognito_user_pool_client" "pool_client" {
  name                         = "${var.app_name}-pool-client"
  explicit_auth_flows          = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]

  user_pool_id = aws_cognito_user_pool.pool.id
}
