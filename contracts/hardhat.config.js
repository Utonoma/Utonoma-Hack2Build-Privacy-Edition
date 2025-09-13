require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,       // Reduce este número para más optimización
        details: {
          yul: true,     // Habilita optimizador YUL
          yulDetails: {
            stackAllocation: true,
          },
        }
      },
      viaIR: true,       // Habilita Intermediate Representation (muy efectivo)
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
