import hre from 'hardhat';
import confData from './deploy_conf.json';
import erc20Abi from '../abi/erc20.json';

async function main() {
  const accountAddress = '0xd19f62b5a721747a04b969c90062cbb85d4aaaa8';
  const operatorRole =
    '0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c';
  const Reliquary = await hre.ethers.getContractFactory('Reliquary');
  const reliqeuryAddress = '0xd55bdF212FAed7599F06011321471f8604207930';
  const reliquaryInstance = await Reliquary.attach(reliqeuryAddress);
  // const MultiplierRewarderOwnable = await hre.ethers.getContractFactory(
  //   'MultiplierRewarderOwnable'
  // );
  // const NFTDescriptor = await hre.ethers.getContractFactory('NFTDescriptor');
  // const nFTDescriptorInstance = await NFTDescriptor.deploy(reliqeuryAddress);
  // console.log('nFTDescriptorInstance address', nFTDescriptorInstance.address);
  // const multiplierRewarderOwnable = await MultiplierRewarderOwnable.deploy(
  //   confData.rewarders[0].rewardMultiplier,
  //   confData.rewarders[0].rewarderToken,
  //   reliqeuryAddress
  // );
  // console.log(
  //   'multiplierRewarderOwnable address',
  //   multiplierRewarderOwnable.address
  // );
  // const roleTx = await reliquaryInstance.grantRole(
  //   operatorRole,
  //   accountAddress
  // );
  // const createPool = await reliquaryInstance.addPool(
  //   confData.pools[0].allocPoint,
  //   confData.pools[0].poolToken,
  //   '0x777a569bE2E9B85b7CeaBaCD48D29F5e904904D5',
  //   confData.pools[0].requiredMaturities,
  //   confData.pools[0].levelMultipliers,
  //   confData.pools[0].name,
  //   '0x3D658D4eE44739b6Ddc80e1D3BdF0085913e2148',
  //   confData.pools[0].allowPartialWithdrawals
  // );
  // await createPool.wait();
  // console.log('createPool', createPool);
	const poolInfo = await reliquaryInstance.getPoolInfo(0)
	console.log('poolInfo', poolInfo);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });