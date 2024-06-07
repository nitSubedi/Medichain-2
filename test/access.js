const AccessControl = artifacts.require("AccessControl");

contract("AccessControl", accounts => {
  it("should grant and revoke access", async () => {
    const accessControlInstance = await AccessControl.deployed();
    const patient = accounts[1];
    const provider = accounts[2];

    // Grant read access by patient
    await accessControlInstance.grantReadAccess(patient, provider, { from: patient });

    // Check if read access is granted
    let hasReadAccess = await accessControlInstance.hasReadPermission(patient, provider);
    assert.isTrue(hasReadAccess, "Read access should be granted");

    // Revoke read access by patient
    await accessControlInstance.revokeReadAccess(patient, provider, { from: patient });

    // Check if read access is revoked
    hasReadAccess = await accessControlInstance.hasReadPermission(patient, provider);
    assert.isFalse(hasReadAccess, "Read access should be revoked");

    // Grant update access by patient
    await accessControlInstance.grantUpdateAccess(patient, provider, { from: patient });

    // Check if update access is granted
    let hasUpdateAccess = await accessControlInstance.hasAddPermission(patient,{from:provider});
    assert.isTrue(hasUpdateAccess, "Update access should be granted");

    // Revoke update access by patient
    await accessControlInstance.revokeUpdateAccess(patient, provider, { from: patient });

    // Check if update access is revoked
    hasUpdateAccess = await accessControlInstance.hasAddPermission(patient);
    assert.isFalse(hasUpdateAccess, "Update access should be revoked");
  });
});
