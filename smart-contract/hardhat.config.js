require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    trexx: {
      url: "https://fraa-dancebox-3106-rpc.a.dancebox.tanssi.network/",
      accounts: [process.env.PRIVATE_KEY],
    },
    xrpl_evm: {
      url: "https://rpc-evm-sidechain.xrpl.org",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
