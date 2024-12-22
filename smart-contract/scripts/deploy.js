async function main() {
  const { ethers } = require("hardhat");

  // Obter a fábrica do contrato
  const CreditScore = await ethers.getContractFactory("CreditScore");

  // Fazer o deploy do contrato
  const creditScore = await CreditScore.deploy();

  // Aguardar o deploy ser finalizado
  await creditScore.deployed();

  console.log("CreditScore deployed to:", creditScore.address);
}

// Executar o script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
