const Lender = artifacts.require("Lender");

module.exports = function(deployer) {
  deployer.deploy(Lender, 10);
};
