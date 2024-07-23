import { expect } from 'chai';
import BigNumbers from 'bignumber.js';
import { BigNumber, Contract, Signer } from 'ethers';
import { ethers } from 'hardhat';
import confData from '../scripts/deploy_conf.json';
const helpers = require('@nomicfoundation/hardhat-network-helpers');
import keccak256 from 'keccak256';
// import { Provider } from '@ethersproject/abstract-provider';
import erc20Abi from '../abi/erc20.json';

const setStorageAt = async (address: any, index: string, value: any) => {
  await ethers.provider.send('hardhat_setStorageAt', [address, index, value]);
};
const toBytes32 = (bn: BigNumber) => {
  return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
};
describe('ERC1155Converter', function () {
  let reliquaryContractInstance: Contract;
  let constantCurveContractInstance: Contract;
  let nftDescriptorContractInstance: Contract;
  let impersonatedSigner;
  const accountAddress = '0xD19f62b5A721747A04b969C90062CBb85D4aAaA8';
  const operatorRole =
    '0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c';
  beforeEach(async function () {
    // const accounst = await ethers.getSigners();
    const Reliquary = await ethers.getContractFactory('Reliquary');
    const NFTDescriptor = await ethers.getContractFactory('NFTDescriptor');
    const ConstantCurve = await ethers.getContractFactory('Constant');
    const constantCurveContract = await ConstantCurve.deploy();
    constantCurveContractInstance = await constantCurveContract.deployed();
    const reliquaryContract = await Reliquary.deploy(
      confData.rewardToken,
      constantCurveContractInstance.address,
      confData.name,
      confData.symbol
    );
    reliquaryContractInstance = await reliquaryContract.deployed();
    const nftDescriptorContract = await NFTDescriptor.deploy(
      reliquaryContractInstance.address
    );
    nftDescriptorContractInstance = await nftDescriptorContract.deployed();
  });
  // test to create new pool
  it('Should create new pool', async function () {
    const [owner, user] = await ethers.getSigners();
    const DepositBonusRewarder = await ethers.getContractFactory(
      'DepositBonusRewarder'
    );
    impersonatedSigner = await ethers.getImpersonatedSigner(accountAddress);
    const rewardToken = new Contract(
      confData.rewardToken,
      erc20Abi,
      impersonatedSigner
    );
    const rewarder = await DepositBonusRewarder.deploy(
      '1000000000000000000000000000000',
      '1000000000000000000',
      '86400',
      confData.rewardToken,
      reliquaryContractInstance.address
    );
    const rewarderContractInstance = await rewarder.deployed();
    console.log('rewarderContractInstance', rewarderContractInstance.address);
    const minTx = await rewardToken.mint(
      rewarderContractInstance.address,
      '1000000000000000000000000000000'
    );
    const roleTx = await reliquaryContractInstance.grantRole(
      operatorRole,
      owner.address
    );
    console.log('roleTx', roleTx.hash);
    const createPool = await reliquaryContractInstance.addPool(
      confData.pools[0].allocPoint,
      confData.pools[0].poolToken,
      rewarderContractInstance.address,
      confData.pools[0].requiredMaturities,
      confData.pools[0].levelMultipliers,
      confData.pools[0].name,
      nftDescriptorContractInstance.address,
      confData.pools[0].allowPartialWithdrawals
    );
    const index = ethers.utils.solidityKeccak256(
      ['uint256', 'uint256'],
      [owner.address, 0] // key, slot
    );

    await setStorageAt(
      confData.pools[0].poolToken,
      index,
      toBytes32(ethers.BigNumber.from('100000000000000000000000')).toString()
    );
    const poolToken = new Contract(
      confData.pools[0].poolToken,
      erc20Abi,
      owner
    );
    const checkBalance = await poolToken.balanceOf(owner.address);
    console.log('checkBalance', checkBalance.toString());
    console.log('createPool', createPool.hash);
    const poolLength = await reliquaryContractInstance.poolLength();
    console.log('poolLength', poolLength.toString());
    const approveTx = await poolToken.approve(
      reliquaryContractInstance.address,
      '100000000000000000000000'
    );
    await approveTx.wait();
    const relicId = await reliquaryContractInstance.createRelicAndDeposit(
      owner.address,
      0,
      '10000000000000000000'
    );
    const rc = await relicId.wait();
    console.log('relicId', rc);
    // const event = rc.events.find((event: any) => {
    //   console.log('event', event.event);
    //   console.log('topics', event.topics);
    //   if (event.args) {
    //     console.log('event', event.args);
    //   }
    // });
    // const [from, to, value] = event.args;
    // console.log(from, to, value, event.args);
    // const relicId2 = await reliquaryContractInstance.createRelicAndDeposit(
    //   owner.address,
    //   0,
    //   '10000000000000000000'
    // );
    // console.log('relicId2', relicId2);
    const pendingRewardOfOwner =
      await reliquaryContractInstance.pendingRewardsOfOwner(owner.address);
    console.log(
      'pendingRewardOfOwner on same day',
      new BigNumbers(pendingRewardOfOwner[0].pendingReward.toString())
        .div(10 ** 18)
        .toString()
    );
    await helpers.time.increase(86400);
    const pendingReward1Day =
      await reliquaryContractInstance.pendingRewardsOfOwner(owner.address);
    console.log(
      'pendingRewardOfOwner on 1 day later',
      new BigNumbers(pendingReward1Day[0].pendingReward.toString())
        .div(10 ** 18)
        .toString()
    );
    await helpers.time.increase(604800);
    const pendingReward1Week =
      await reliquaryContractInstance.pendingRewardsOfOwner(owner.address);
    console.log(
      'pendingRewardOfOwner on 1 week later',
      new BigNumbers(pendingReward1Week[0].pendingReward.toString())
        .div(10 ** 18)
        .toString()
    );
    await helpers.time.increase(1209600);
    const pendingReward2Week =
      await reliquaryContractInstance.pendingRewardsOfOwner(owner.address);
    console.log(
      'pendingRewardOfOwner on 2 week later',
      new BigNumbers(pendingReward2Week[0].pendingReward.toString())
        .div(10 ** 18)
        .toString()
    );
    await helpers.time.increase(2592000);
    const pendingReward1Month =
      await reliquaryContractInstance.pendingRewardsOfOwner(owner.address);
    console.log(
      'pendingRewardOfOwner on 1 Month later',
      new BigNumbers(pendingReward1Month[0].pendingReward.toString())
        .div(10 ** 18)
        .toString()
    );
    await helpers.time.increase(7776000);
    const pendingReward3Month =
      await reliquaryContractInstance.pendingRewardsOfOwner(owner.address);
    console.log(
      'pendingRewardOfOwner on 3 Month later',
      new BigNumbers(pendingReward3Month[0].pendingReward.toString())
        .div(10 ** 18)
        .toString()
    );
    await helpers.time.increase(15552000);
    const pendingReward6Month =
      await reliquaryContractInstance.pendingRewardsOfOwner(owner.address);
    console.log(
      'pendingRewardOfOwner on 6 Month later',
      new BigNumbers(pendingReward6Month[0].pendingReward.toString())
        .div(10 ** 18)
        .toString()
    );
    console.log('Depositing one more relic');
    // await reliquaryContractInstance.deposit('20000000000000000000', 1);
    await helpers.time.increase(31536000);
    const pendingReward1Year =
      await reliquaryContractInstance.pendingRewardsOfOwner(owner.address);
    console.log(
      'pendingRewardOfOwner on 1 Year later',
      new BigNumbers(pendingReward1Year[0].pendingReward.toString())
        .div(10 ** 18)
        .toString()
    );
  });
});
