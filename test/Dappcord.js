const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {
  let dappcord, deployer, user, user2

  const NAME = "Dappcord"
  const SYMBOL = "DCORD"

  this.beforeEach(async () => {
    [deployer, user, user2] = await ethers.getSigners()

    // Deploy the Dappcord contract
    const Dappcord = await ethers.getContractFactory("Dappcord")
    dappcord = await Dappcord.deploy(NAME, SYMBOL)
    await dappcord.deployed()

    // Create a channel
    const transaction = await dappcord.connect(deployer).createChannel("General", tokens(1))
    await transaction.wait()
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

  describe("Creating Channels", function () {
    it('Returns total channels', async () => {
      const result = await dappcord.totalChannels()
      expect(result).to.equal(1)
    })

    it('Returns channel attributes', async () => {
      const channel = await dappcord.getChannel(1)
      expect(channel.id).to.equal(1)
      expect(channel.name).to.equal("General")
      expect(channel.cost).to.equal(tokens(1))
    })
  })

  describe("Joining Channels", function () {
    const ID = 1
    const AMOUNT = tokens(1)

    beforeEach(async () => {
      const transaction = await dappcord.connect(user).mint(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it('Joins the user', async () => {
      const result = await dappcord.hasJoined(ID, user.address)
      expect(result).to.equal(true)
    })

    it('Increases total supply', async () => {
      const result = await dappcord.totalSupply()
      expect(result).to.equal(1)
    })

    it('Updates contract balance', async () => {
      const result = await ethers.provider.getBalance(dappcord.address)
      expect(result).to.equal(AMOUNT)
    })

    it('Reverts if the channel does not exist', async () => {
      await expect(dappcord.connect(user).mint(2, { value: AMOUNT })).to.be.revertedWith("Channel does not exist")
    })

    it('Reverts if the payment is insufficient', async () => {
      await expect(dappcord.connect(user2).mint(ID, { value: tokens(0.5) })).to.be.revertedWith("Insufficient funds to join channel")
    })  

    it('Reverts if user has already joined', async () => {
      await expect(dappcord.connect(user).mint(ID, { value: AMOUNT })).to.be.revertedWith("User has already joined this channel")
    })

    it('Reverts if the channel ID is invalid', async () => {
      await expect(dappcord.connect(user).mint(0, { value: AMOUNT })).to.be.revertedWith("Channel ID cannot be zero")
    })
  })

  describe("Withdrawing Funds", function () {
    const ID = 1
    const AMOUNT = tokens(10)
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await dappcord.connect(user).mint(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await dappcord.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(dappcord.address)
      expect(result).to.equal(0)
    })
  })
})