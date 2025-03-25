require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    arbitrum: {
      url: process.env.ARB_RPC_URL,  // Arbitrum RPC URL from Alchemy/Infura
      accounts: [process.env.PRIVATE_KEY],  // Your wallet's private key
    },
  },
  etherscan: {
    apiKey: process.env.ARBISCAN_API_KEY,  // For contract verification
  },
};
