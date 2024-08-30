// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat';
import confData from './deploy_conf.json';

async function main() {
  console.log('in deploy');
  const accountAddress = '0xD19f62b5A721747A04b969C90062CBb85D4aAaA8';
  const operatorRole =
    '0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c';
  const OwnableCurve = await hre.ethers.getContractFactory('OwnableCurve');
  const MultiplierRewarderOwnable = await hre.ethers.getContractFactory(
    'MultiplierRewarderOwnable'
  );
  const NFTDescriptor = await hre.ethers.getContractFactory('NFTDescriptor');
  const ownableCurveInstance = await OwnableCurve.deploy(confData.emissionRate);
  await ownableCurveInstance.deployed();
  console.log('OwnableCurve Instance address ', ownableCurveInstance.address);
  // await ownableCurveInstance.deployTransaction.wait(3);
  const ownableCurveInstanceAddress = ownableCurveInstance.address;
  const Reliquary = await hre.ethers.getContractFactory('Reliquary');
  const reliquaryInstance = await Reliquary.deploy(
    confData.rewardToken,
    ownableCurveInstanceAddress,
    confData.name,
    confData.symbol
  );
  await reliquaryInstance.deployed();
  console.log('Reliquary Instance address ', reliquaryInstance.address);

  // await reliquaryInstance.deployTransaction.wait(3);
  // // await sleep(20000);
  const reliqeuryAddress = reliquaryInstance.address;
  const nFTDescriptorInstance = await NFTDescriptor.deploy(reliqeuryAddress);
  console.log('nFTDescriptorInstance address', nFTDescriptorInstance.address);
  const multiplierRewarderOwnable = await MultiplierRewarderOwnable.deploy(
    confData.rewarders[0].rewardMultiplier,
    confData.rewarders[0].rewarderToken,
    reliqeuryAddress
  );
  console.log(
    'multiplierRewarderOwnable address',
    multiplierRewarderOwnable.address
  );
  console.log('granting operatorRole to account address');
  await reliquaryInstance.grantRole(
    operatorRole,
    accountAddress
  );
  console.log('Creating Pool');
   const createPool = await reliquaryInstance.addPool(
     confData.pools[0].allocPoint,
     confData.pools[0].poolToken,
     multiplierRewarderOwnable.address,
     confData.pools[0].requiredMaturities,
     confData.pools[0].levelMultipliers,
     confData.pools[0].name,
     nFTDescriptorInstance.address,
     confData.pools[0].allowPartialWithdrawals
   );
   await createPool.wait();
   console.log('createPool', createPool);
   const poolInfo = await reliquaryInstance.getPoolInfo(0);
   console.log('poolInfo', poolInfo);
  // if (confData.rewarders.length > 0) {
  //   for (let index = 0; index < confData.rewarders.length; index++) {
  //     if (confData.rewarders[index].parentIndex < 0) {
  //       const parentRewarderInstance = await ParentRewarder.deploy(
  //         confData.rewarders[index].rewardMultiplier,
  //         confData.rewarders[index].rewarderToken,
  //         reliqeuryAddress
  //       );
  //       // await parentRewarderInstance.deployTransaction.wait(3);
  //       console.log(
  //         'ParentRewarder Instance address ',
  //         parentRewarderInstance.address
  //       );
  //       // await hre.run('verify:verify', {
  //       //   contract: 'contracts/rewarders/ParentRewarder.sol:ParentRewarder',
  //       //   address: parentRewarderInstance.address,
  //       //   constructorArguments: [
  //       //     confData.rewarders[index].rewardMultiplier,
  //       //     confData.rewarders[index].rewarderToken,
  //       //     reliqeuryAddress,
  //       //   ],
  //       // });
  //     }
  //   }
  // }
  // await hre.run('verify:verify', {
  //   contract: 'contracts/emission_curves/OwnableCurve.sol:OwnableCurve',
  //   address: '0x01B86D2b09b161681d107f26730a7b09a66f0D58',
  //   constructorArguments: [confData.emissionRate],
  // });
  // await hre.run('verify:verify', {
  //   contract: 'contracts/Reliquary.sol:Reliquary',
  //   address: "reliquaryInstance.address",
  //   constructorArguments: [
  //     confData.rewardToken,
  //     ownableCurveInstanceAddress,
  //     confData.name,
  //     confData.symbol,
  //   ],
  // });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
