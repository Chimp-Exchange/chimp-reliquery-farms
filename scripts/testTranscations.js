import { ethers, Contract, Signer } from 'ethers';
import BigNumber from 'bignumber.js';
import dotenv from 'dotenv';
import reliqueryAbi from '../abi/reliquery.json';
import erc20Abi from '../abi/erc20.json';
dotenv.config();

async function main() {
  try {
    const ACCOUNT_ADDRESS = '0x2411A879F433460dD52f887CA5538535816aCB1F';
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (PRIVATE_KEY) {
      const RELIQUERY_ADDRESS = '0xcaf4d0b0ea3bf12D3459e5641455f010c430a583';
      const RPC_URL = 'https://rpc.goerli.linea.build';
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY);
      const signer = wallet.connect(provider);
      const reliqeuryContract = new ethers.Contract(
        RELIQUERY_ADDRESS,
        reliqueryAbi,
        signer
      );
      const getPoolToken = await reliqeuryContract.poolToken(0);
      // const getPoolToken = '0x1990BC6dfe2ef605Bfc08f5A23564dB75642Ad73';
      console.log('poolToken', getPoolToken);
      const poolToken = new ethers.Contract(getPoolToken, erc20Abi, signer);
      const deciamls = await poolToken.decimals();
      console.log('deciamls', deciamls);
      const allowence = await poolToken.allowance(
        ACCOUNT_ADDRESS,
        RELIQUERY_ADDRESS
      );
      console.log('allowence', allowence.toString());
      if (new BigNumber(allowence.toString()).isEqualTo(0)) {
        const approveTx = await poolToken.approve(
          RELIQUERY_ADDRESS,
          '100000000000000000000000'
        );
        await approveTx.wait();
        const allowenceAfter = await poolToken.allowance(
          ACCOUNT_ADDRESS,
          RELIQUERY_ADDRESS
        );
        console.log('allowence after', allowenceAfter.toString());
      }
      const relicId = await reliqeuryContract.createRelicAndDeposit(
        ACCOUNT_ADDRESS,
        0,
        '20000000000000000000'
      );
      const rc = await relicId.wait();
      console.log('relicId', rc);
    }
  } catch (error) {
    console.error('error', error);
  }
}
main();
