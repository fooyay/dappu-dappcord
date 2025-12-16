const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // setup accounts & variables
  const [deployer] = await hre.ethers.getSigners()
  const NAME = "Dappcord"
  const SYMBOL = "DCORD"

  // deploy the contract
  const Dappcord = await hre.ethers.getContractFactory("Dappcord")
  const dappcord = await Dappcord.deploy(NAME, SYMBOL)
  await dappcord.deployed()
  console.log(`Deployed Dappcord at: ${dappcord.address}\n`)

  // create 3 channels
  const CHANNEL_NAMES = ["General", "Tech Talk", "Crypto"]
  const CHANNEL_COSTS = [tokens(1), tokens(0), tokens(0.25)]

  for (let i = 0; i < 3; i++) {
    const transaction = await dappcord.connect(deployer).createChannel(CHANNEL_NAMES[i], CHANNEL_COSTS[i])
    await transaction.wait()
    console.log(`Created channel ${CHANNEL_NAMES[i]}`)
  }

  console.log("\nDeployment & channel creation complete!")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});