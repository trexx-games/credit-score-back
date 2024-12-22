
module "dev-ssh-sg" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "ec2-sg"
  description = "Security group for ec2-sg"
  vpc_id      = data.aws_vpc.default.id

  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules       = ["ssh-tcp"]

  tags = {
    Service     = "sg-ec2-ssh"
    Environment = var.environment
  }
}

module "ec2-sg" {
  source = "terraform-aws-modules/security-group/aws"

  name        = "ec2-sg"
  description = "Security group for ec2-sg"
  vpc_id      = data.aws_vpc.default.id

  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules       = ["http-80-tcp", "https-443-tcp", "all-icmp"]
  egress_rules        = ["all-all"]

  tags = {
    Service     = "sg-ec2-backend"
    Environment = var.environment
  }
}
