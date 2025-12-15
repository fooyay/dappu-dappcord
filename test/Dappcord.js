const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
  describe("Deployment", function () {
    it("sets the name correctly", async function () {
      const Dappcord = await ethers.getContractFactory("Dappcord")
      const dappcord = await Dappcord.deploy("Dappcord", "DCORD")
      await dappcord.deployed()
      const result = await dappcord.name()
      expect(result).to.equal("Dappcord")
    })

    it("sets the symbol correctly", async function () {
      const Dappcord = await ethers.getContractFactory("Dappcord")
      const dappcord = await Dappcord.deploy("Dappcord", "DCORD")
      await dappcord.deployed()
      const result = await dappcord.symbol()
      expect(result).to.equal("DCORD")
    })
  })
})
