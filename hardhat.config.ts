import dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomicfoundation/hardhat-verify';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
// import 'ten-hardhat-plugin'

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
        url: 'https://rpc.goerli.linea.build',
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
      accounts: [`0x${PRIVATE_KEY}`],
      // gasPrice: 170000000000, // 170 gwei
    },
    linea_testnet: {
      url: 'https://rpc.goerli.linea.build',
      accounts: [`0x${PRIVATE_KEY}`],
      // gasPrice: 170000000000, // 170 gwei
    },
    tentest: {
      chainId: 443,
      url: 'https://testnet.ten.xyz/v1/?token=57F2AD8B43D3732979AA08FE04F31C57BCBA620E',
      accounts: [`0x${PRIVATE_KEY}`],
      // allowUnlimitedContractSize: true,
    },
  },
  etherscan: {
    apiKey: {
      mantle: '9de66cbc-188a-471f-9237-da29bd0936ff',
      linea_testnet: '1Z71UV31BRUVD9ZXPI66CEIWTR64G7GUCH',
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
      {
        network: 'linea_testnet',
        chainId: 59140,
        urls: {
          apiURL: 'https://api-testnet.lineascan.build/api',
          browserURL: 'https://goerli.lineascan.build',
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
        runs: 100,
      },
    },
  },
};

export default config;
