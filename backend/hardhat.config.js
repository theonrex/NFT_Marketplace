/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-etherscan")
 require("hardhat-deploy")
 require("hardhat-gas-reporter")
 require("@nomiclabs/hardhat-ethers");
 require("dotenv").config();
 const fs = require("fs");

 
 const {QUICKNODE_API_URL_KEY, PRIVATE_KEY } = process.env;
 
 module.exports = {
   networks: {
     hardhat: {
       chainId: 5,
     },
     goerli: {
       url: QUICKNODE_API_URL_KEY,
       accounts: [PRIVATE_KEY],
     },
   },
   solidity: "0.8.4",

 };
 
 