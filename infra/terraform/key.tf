resource "tls_private_key" "rsa" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "tf_key" {
  key_name   = var.key_pair_name
  public_key = tls_private_key.rsa.public_key_openssh
}

resource "aws_secretsmanager_secret" "key-secrets" {
  name = "key-secret"
}

resource "aws_secretsmanager_secret_version" "key-secrets" {
  secret_id     = aws_secretsmanager_secret.key-secrets.id
  secret_string = tls_private_key.rsa.private_key_pem
}
