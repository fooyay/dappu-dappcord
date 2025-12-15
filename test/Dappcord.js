const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
  let dappcord

  this.beforeEach(async () => {
    // [owner, user1, user2] = await ethers.getSigners()
    const Dappcord = await ethers.getContractFactory("Dappcord")
    dappcord = await Dappcord.deploy("Dappcord", "DCORD")
    await dappcord.deployed()
  })

  describe("Deployment", function () {
    it("sets the name correctly", async function () {
      const result = await dappcord.name()
      expect(result).to.equal("Dappcord")
    })

    it("sets the symbol correctly", async function () {
      const result = await dappcord.symbol()
      expect(result).to.equal("DCORD")
    })
  })
})
