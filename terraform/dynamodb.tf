resource "aws_dynamodb_table" "game_table" {
  name           = "Game"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "League_Season_Date"
  range_key      = "Game"
  stream_enabled = true
  stream_view_type = "NEW_IMAGE"

  attribute {
    name = "League_Season_Date"
    type = "S"
  }

  attribute {
    name = "Game"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

}

resource "aws_dynamodb_table" "playersummary_table" {
  name           = "PlayerSummary"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "League_Season"
  range_key      = "Player"

  attribute {
    name = "League_Season"
    type = "S"
  }

  attribute {
    name = "Player"
    type = "S"
  }

}