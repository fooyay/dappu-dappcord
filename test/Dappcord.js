const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
  let dappcord, deployer, user

  const NAME = "Dappcord"
  const SYMBOL = "DCORD"

  this.beforeEach(async () => {
    [deployer, user] = await ethers.getSigners()
    const Dappcord = await ethers.getContractFactory("Dappcord")
    dappcord = await Dappcord.deploy(NAME, SYMBOL)
    await dappcord.deployed()
  })

  describe("Deployment", function () {
    it("sets the name correctly", async function () {
      const result = await dappcord.name()
      expect(result).to.equal(NAME)
    })

    it("sets the symbol correctly", async function () {
      const result = await dappcord.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it("sets the owner correctly", async function () {
      const result = await dappcord.owner()
      expect(result).to.equal(deployer.address)
    })
  })
})
