// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat';
import confData from './deploy_conf.json';

async function main() {
  // const OwnableCurve = await hre.ethers.getContractFactory('OwnableCurve');
  const ParentRewarder = await hre.ethers.getContractFactory('ParentRewarder');
  // const ownableCurveInstance = await OwnableCurve.deploy(confData.emissionRate);
  // console.log('OwnableCurve Instance address ', ownableCurveInstance.address);
  // await ownableCurveInstance.deployTransaction.wait(3);
  // const ownableCurveInstanceAddress =
  //   '0xAE3c1524DfC3834EdAf80171b25f703804Ab0dF2';
  // const Reliquary = await hre.ethers.getContractFactory('Reliquary');
  // const reliquaryInstance = await Reliquary.deploy(confData.rewardToken, ownableCurveInstanceAddress, confData.name, confData.symbol);

  // console.log('Reliquary Instance address ', reliquaryInstance.address);

  // await reliquaryInstance.deployTransaction.wait(3);
  // await sleep(20000);
  const reliqeuryAddress = '0xE399517cC799FD3076d03B803114100C54767653';
  if (confData.rewarders.length > 0) {
    for (let index = 0; index < confData.rewarders.length; index++) {
      if (confData.rewarders[index].parentIndex < 0) {
        const parentRewarderInstance = await ParentRewarder.deploy(
          confData.rewarders[index].rewardMultiplier,
          confData.rewarders[index].rewarderToken,
          reliqeuryAddress
        );
        await parentRewarderInstance.deployTransaction.wait(3);
        console.log(
          'ParentRewarder Instance address ',
          parentRewarderInstance.address
        );
        await hre.run('verify:verify', {
          contract: 'contracts/rewarders/ParentRewarder.sol:ParentRewarder',
          address: parentRewarderInstance.address,
          constructorArguments: [
            confData.rewarders[index].rewardMultiplier,
            confData.rewarders[index].rewarderToken,
            reliqeuryAddress,
          ],
        });
      }
    }
  }
  // await hre.run('verify:verify', {
  //   contract: 'contracts/Reliquary.sol:Reliquary',
  //   address: reliquaryInstance.address,
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
