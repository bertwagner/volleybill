variable "app_name" {
    type = string
    description = "The name to use for the app. Most buckets and other configurations will use this as part of their names."
}

variable "domain" {
    type = string
    description = "The url to use for hosting your website. Most buckets and other configurations will use this as part of their names."
}