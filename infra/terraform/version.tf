terraform {
  backend "s3" {
    bucket  = "trexx-terraform-tfstate"
    key     = "env/ec2-app-backend.tfstate"
    region  = "us-west-1"
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.40.0, <= 5.55.0"
    }
  }

  required_version = ">= 1.6.0"
}