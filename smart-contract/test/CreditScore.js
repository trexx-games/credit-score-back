const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ZeroAddress } = require("ethers");

describe("CreditScore", function () {
  async function deployCreditScoreFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const CreditScore = await ethers.getContractFactory("CreditScore");
    const creditScore = await CreditScore.deploy();
    return { creditScore, owner, otherAccount };
  }

  describe("Register Score", function () {
    it("Should register a new score correctly", async function () {
      const { creditScore, owner } = await loadFixture(deployCreditScoreFixture);
      const userSlug = "test-user";
      const walletAddresses = [owner.address];
      const score = 100;
      const timestamp = await time.latest();

      await expect(creditScore.registerScore(userSlug, walletAddresses, score, timestamp))
        .to.emit(creditScore, "ScoreUpdated")
        .withArgs(userSlug, walletAddresses, score, timestamp);

      const scoreRecord = await creditScore.getActiveScore(userSlug);
      expect(scoreRecord.score).to.equal(score);
      expect(scoreRecord.timestamp).to.equal(timestamp);
      expect(scoreRecord.walletAddresses).to.deep.equal(walletAddresses);
    });

    it("Should revert if no wallet addresses are provided", async function () {
      const { creditScore } = await loadFixture(deployCreditScoreFixture);
      const userSlug = "test-user";
      const walletAddresses = [];
      const score = 100;
      const timestamp = await time.latest();

      await expect(
        creditScore.registerScore(userSlug, walletAddresses, score, timestamp)
      ).to.be.revertedWith("No wallets provided");
    });

    it("Should update the active score correctly", async function () {
      const { creditScore, owner } = await loadFixture(deployCreditScoreFixture);
      const userSlug = "test-user";
      const walletAddresses = [owner.address];
      const score1 = 100;
      const timestamp1 = await time.latest();
      const score2 = 150;
      const timestamp2 = await time.latest();

      await creditScore.registerScore(userSlug, walletAddresses, score1, timestamp1);
      await creditScore.registerScore(userSlug, walletAddresses, score2, timestamp2);

      const scoreRecord = await creditScore.getActiveScore(userSlug);
      expect(scoreRecord.score).to.equal(score2);
      expect(scoreRecord.timestamp).to.equal(timestamp2);
    });
  });

  describe("Get Score History", function () {
    it("Should return an empty array for a new user", async function () {
      const { creditScore, otherAccount } = await loadFixture(
        deployCreditScoreFixture
      );
      const userSlug = "new-user";
      const scoreRecord = await creditScore.getActiveScore(userSlug);

      expect(scoreRecord.score).to.equal(0);
      expect(scoreRecord.timestamp).to.equal(0);
      expect(scoreRecord.walletAddresses.length).to.equal(0);
    });

    it("Should return the correct history for a user with multiple scores", async function () {
      const { creditScore, owner } = await loadFixture(deployCreditScoreFixture);
      const userSlug = "test-user";
      const walletAddresses = [owner.address];
      const score1 = 100;
      const timestamp1 = await time.latest();
      const score2 = 150;
      const timestamp2 = await time.latest();

      await creditScore.registerScore(userSlug, walletAddresses, score1, timestamp1);
      await creditScore.registerScore(userSlug, walletAddresses, score2, timestamp2);

      const scoreRecord = await creditScore.getActiveScore(userSlug);
      expect(scoreRecord.score).to.equal(score2);
      expect(scoreRecord.timestamp).to.equal(timestamp2);
    });

    it("Should return the correct history for a user with multiple scores", async function () {
      const { creditScore, owner } = await loadFixture(deployCreditScoreFixture);
      const userSlug = "test-user";
      const walletAddresses = [owner.address];
      const score1 = 100;
      const timestamp1 = await time.latest();
      const score2 = 150;
      const timestamp2 = await time.latest();
    
      await creditScore.registerScore(userSlug, walletAddresses, score1, timestamp1);
      await creditScore.registerScore(userSlug, walletAddresses, score2, timestamp2);
    
      const history = await creditScore.getScoreHistory(userSlug);
    
      expect(history.length).to.equal(2);
    
      expect(history[0].score).to.equal(score1);
      expect(history[0].timestamp).to.equal(timestamp1);
      expect(history[0].walletAddresses).to.deep.equal(walletAddresses);
    
      expect(history[1].score).to.equal(score2);
      expect(history[1].timestamp).to.equal(timestamp2);
      expect(history[1].walletAddresses).to.deep.equal(walletAddresses);
    });    
  });
});

