require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      ),
      network_id: 11155111,  // Sepolia's network id
      gas: 5500000,          // Gas limit
      confirmations: 2,      // # of confirmations to wait between deployments
      timeoutBlocks: 200,    // # of blocks before a deployment times out
      skipDryRun: true       // Skip dry run before migrations
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      ),
      network_id: 1,         // Mainnet's network id
      gas: 5500000,          // Gas limit
      gasPrice: 20000000000, // 20 gwei
      confirmations: 2,      // # of confirmations to wait between deployments
      timeoutBlocks: 200,    // # of blocks before a deployment times out
      skipDryRun: false      // Do not skip dry run before migrations
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",      // Solidity compiler version
      settings: {
        optimizer: {
          enabled: true,    // Enable optimizer
          runs: 200         // Optimization runs
        }
      }
    }
  }
};
