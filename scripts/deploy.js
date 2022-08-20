
const hre = require("hardhat");
const filesys = require("fs");

async function main() {
 
  // We get the contract to deploy
  const Token = await hre.ethers.getContractFactory("OleanjiToken");
  const token = await Token.deploy("10000");

  await token.deployed();

  console.log("OleanjiToken deployed to:", token.address);
  filesys.writeFileSync('./constant.js' , `
  export const OleanjiToken ="${token.address}"
  
  `)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
