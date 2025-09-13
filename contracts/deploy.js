const { ethers } = require("hardhat");

async function main() {
  const Utonoma = await ethers.getContractFactory("Utonoma");
  const utonoma = await Utonoma.deploy('Utonoma', 'UTN', 5000000);
  
  console.log("Utonoma deployed at:", await utonoma.getAddress());
}

main().catch(console.error);