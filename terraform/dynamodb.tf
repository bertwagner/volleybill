resource "aws_dynamodb_table" "game_table" {
  name           = "Game"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "GameId"
  range_key      = "Player"
  stream_enabled = true
  stream_view_type = "NEW_IMAGE"

  attribute {
    name = "GameId"
    type = "S"
  }

  attribute {
    name = "Player"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

#   ttl {
#     attribute_name = "CreateDate"
#     enabled        = false
#   }

}