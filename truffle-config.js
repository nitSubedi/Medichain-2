module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ganache port (default: 7545)
      network_id: "*",       // Any network (default: none)
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",    // Specify compiler version
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};