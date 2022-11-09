const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace.address);

  const TheonNft = await ethers.getContractFactory("TheonNft");
  const theonnft = await TheonNft.deploy(nftMarketplace.address);
  await theonnft.deployed();
  console.log("nft deployed to:", theonnft.address);
  
  fs.writeFileSync(
    "./config.js",
    `
  export const nftMarketplaceAddress = "${nftMarketplace.address}"
  export const nftAddress = "${theonnft.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

