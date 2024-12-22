
resource "aws_instance" "ec2-backend" {
  ami        = "ami-02d5166272c83e99d"
  monitoring = true

  instance_type = "m4.large"

  user_data = file("./script.sh")

  user_data_replace_on_change = true

  vpc_security_group_ids = [
    module.ec2-sg.security_group_id,
    module.dev-ssh-sg.security_group_id
  ]

  iam_instance_profile = aws_iam_instance_profile.ec2-backend.name

  key_name = var.key_pair_name

  root_block_device {
    encrypted   = true
    volume_type = "gp3"
    tags = {
      Service     = "ec2-backend-block"
      Environment = var.environment
    }
  }

  metadata_options {
    http_tokens = "required"
  }

  tags = {
    Service     = "ec2-backend"
    Environment = var.environment
  }
}