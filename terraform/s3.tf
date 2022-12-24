## Keeps track of Terraform State
resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.domain}-state"

}

resource "aws_s3_bucket_acl" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  acl = "private"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}


## Bucket for hosting the static web app
resource "aws_s3_bucket" "static_app_bucket" {
  bucket = "${var.domain}"

}

resource "aws_s3_bucket_policy" "static_app_bucket" {
  bucket = aws_s3_bucket.static_app_bucket.id
  policy = templatefile("policies/s3-public-website.json", {BUCKET = var.domain})
}

resource "aws_s3_bucket_public_access_block" "static_app_bucket" {
  bucket = aws_s3_bucket.static_app_bucket.id

  block_public_policy = false
}

resource "aws_s3_bucket_acl" "static_app_bucket" {
  bucket = aws_s3_bucket.static_app_bucket.id
  acl = "public-read"
}

resource "aws_s3_bucket_website_configuration" "static_app_bucket" {
  bucket = aws_s3_bucket.static_app_bucket.bucket
  
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}


# # Unprocessed user-uploaded crossword images
# resource "aws_s3_bucket" "crosschecker_app_data" {
#   bucket = "crosschecker.app-data"
#   acl = "private"

#   cors_rule {
#     allowed_headers = ["*"]
#     allowed_methods = ["GET", "POST"]
#     allowed_origins = ["https://crosschecker.app"]
#     expose_headers  = [""]
#     max_age_seconds = 3000
#   }
# }


# Lambda source code
resource "aws_s3_bucket" "lambda_functions" {
  bucket = "${var.domain}-lambda-functions"
}

resource "aws_s3_bucket_acl" "lambda_bfunctions_acl" {
  bucket = aws_s3_bucket.lambda_functions.id
  acl = "private"

}