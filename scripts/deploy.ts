// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat';
import confData from './deploy_conf.json';

async function main() {
  console.log('in deploy');
  const OwnableCurve = await hre.ethers.getContractFactory('OwnableCurve');
  const ParentRewarder = await hre.ethers.getContractFactory('ParentRewarder');
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
  if (confData.rewarders.length > 0) {
    for (let index = 0; index < confData.rewarders.length; index++) {
      if (confData.rewarders[index].parentIndex < 0) {
        const parentRewarderInstance = await ParentRewarder.deploy(
          confData.rewarders[index].rewardMultiplier,
          confData.rewarders[index].rewarderToken,
          reliqeuryAddress
        );
        // await parentRewarderInstance.deployTransaction.wait(3);
        console.log(
          'ParentRewarder Instance address ',
          parentRewarderInstance.address
        );
        // await hre.run('verify:verify', {
        //   contract: 'contracts/rewarders/ParentRewarder.sol:ParentRewarder',
        //   address: parentRewarderInstance.address,
        //   constructorArguments: [
        //     confData.rewarders[index].rewardMultiplier,
        //     confData.rewarders[index].rewarderToken,
        //     reliqeuryAddress,
        //   ],
        // });
      }
    }
  }
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
