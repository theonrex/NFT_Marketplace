/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-etherscan")
 require("hardhat-deploy")
 require("hardhat-gas-reporter")
 require("@nomiclabs/hardhat-ethers");
 require("dotenv").config();
 const fs = require("fs");
 
 
 
 const { API_URL_KEY, PRIVATE_KEY } = process.env;
 
 module.exports = {
   networks: {
     hardhat: {
       chainId: 80001,
     },
     mumbai: {
       url: API_URL_KEY,
       accounts: [PRIVATE_KEY],
     },
  
     // mainnet: {
     //   url: "https://polygon-mainnet.g.alchemy.com/v2/_WH8c3Rc9mrWUJ2GFWWjKR16TiPi7Ign",
     //   accounts:[PRIVATE_KEY],
     // },
   },
   solidity: "0.8.4",
   namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 40000
  }
 };
 
 