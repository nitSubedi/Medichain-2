const AccessControl = artifacts.require("AccessControl");
const Demographics = artifacts.require("Demographics");
const MedicalConditions = artifacts.require("MedicalConditions");
const Medications = artifacts.require("Medications");
const Allergies = artifacts.require("Allergies");
const Surgeries = artifacts.require("Surgeries");
const Immunizations = artifacts.require("Immunizations");
const MentalHistory = artifacts.require("MentalHistory");
const Insurance = artifacts.require("Insurance");
const MediChain = artifacts.require("MediChain");

module.exports = async function(deployer) {
  await deployer.deploy(AccessControl);
  await deployer.deploy(Demographics);
  await deployer.deploy(MedicalConditions);
  await deployer.deploy(Medications);
  await deployer.deploy(Allergies);
  await deployer.deploy(Surgeries);
  await deployer.deploy(Immunizations);
  await deployer.deploy(MentalHistory);
  await deployer.deploy(Insurance);
  await deployer.deploy(MediChain);
};
