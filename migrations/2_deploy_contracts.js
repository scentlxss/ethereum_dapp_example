var Trust = artifacts.require("./Trust.sol");

var contract_address = "0x779A3cb1646e33ef3265cFc4D9007c58025d8605";

module.exports = function(deployer) {
	  deployer.deploy(Trust);
};
