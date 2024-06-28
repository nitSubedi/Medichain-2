// scripts/grant_permission.js
const AccessControl = artifacts.require("AccessControl");

module.exports = async function (callback) {
  try {
    // Get the deployed contract instance
    const accessControl = await AccessControl.deployed();

    // Define the patient and provider addresses
    const patientAddress = "0x13Cb5870e5dc8A45D614b7dCe0814B774DC58C47"; // Replace with the actual patient address
    const providerAddress = "0x8dF7DB0cB3f1E3E25979902ce4C513ED75fB780A"; // Replace with the actual provider address

    // Grant read and update access
    await accessControl.grantReadAccess(patientAddress, providerAddress, { from: patientAddress });
    await accessControl.grantUpdateAccess(patientAddress, providerAddress, { from: patientAddress });

    console.log(`Permissions granted from ${patientAddress} to ${providerAddress}`);

    callback();
  } catch (error) {
    console.error("Error granting permissions:", error);
    callback(error);
  }
};