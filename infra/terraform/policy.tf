resource "aws_iam_role" "ec2-backend-role" {
  name = "ec2-role-backend"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

  tags = {
    Service     = "role-ec2-backend"
    Environment = var.environment
  }
}

resource "aws_iam_instance_profile" "ec2-backend" {
  name = "ec2-profile-backend"
  role = aws_iam_role.ec2-backend-role.name

  tags = {
    Service     = "iam-ec2-backend"
    Environment = var.environment
  }

}

resource "aws_iam_role_policy" "ec2_policy" {
  name = "ec2-policy"
  role = aws_iam_role.ec2-backend-role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer",
        "logs:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}
