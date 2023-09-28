import dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomicfoundation/hardhat-verify';
import 'solidity-coverage';
import 'hardhat-gas-reporter';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  gasReporter: {
    enabled: false,
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: 'https://rpc.testnet.mantle.xyz',
        accounts: [`0x${PRIVATE_KEY}`],
      },
    },
    // localhost: {
    //   url: 'http://localhost:8545', // uses account 0 of the hardhat node to deploy
    // },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 30000000000, //30 gwei
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 170000000000, // 170 gwei
    },
    mantle: {
      url: 'https://rpc.testnet.mantle.xyz',
      accounts: [[`0x${process.env.PRIVATE_KEY}`]],
      // gasPrice: 170000000000, // 170 gwei
    },
  },
  etherscan: {
    apiKey: {
      mantle: '9de66cbc-188a-471f-9237-da29bd0936ff',
    },
    customChains: [
      {
        network: 'mantle',
        chainId: 5001,
        urls: {
          apiURL: 'https://explorer.testnet.mantle.xyz/api',
          browserURL: 'https://explorer.testnet.mantle.xyz',
        },
      },
    ],
  },
  allowUnlimitedContractSize: true,
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
