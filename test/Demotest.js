const Demographics = artifacts.require("Demographics");

contract("Demographics", accounts => {
  it("should set demographics and retrieve them", async () => {
    const demographicsInstance = await Demographics.deployed();
    const patient = accounts[1];
    const provider = accounts[2];

    // Grant read and update access to provider
    await demographicsInstance.grantReadAccess(patient, provider, {from: patient});
    await demographicsInstance.grantUpdateAccess(patient, provider, {from: patient});

    // Set demographics by provider
    const name = "John Doe";
    const dateOfBirth = "1990-01-01";
    const gender = "Male";
    const homeAddress = "123 Main St";

    await demographicsInstance.setDemographics(patient, name, dateOfBirth, gender, homeAddress, { from: provider });

    // Retrieve demographics by patient
    const results = await demographicsInstance.getDemographics(patient, { from: provider });

    // Check if demographics were set and retrieved correctly
    assert.equal(results[0], name, "Name should match");
    assert.equal(results[1], dateOfBirth, "Date of birth should match");
    assert.equal(results[2], gender, "Gender should match");
    assert.equal(results[3], homeAddress, "Home address should match");
  });

  it("should block unauthorized access", async () => {
    const demographicsInstance = await Demographics.deployed();
    const patient = accounts[1];
    const unauthorizedProvider = accounts[3];

    // Try to set demographics by unauthorized provider
    try {
      await demographicsInstance.setDemographics(patient, "Jane Doe", "1995-01-01", "Female", "456 Elm St", { from: unauthorizedProvider });
      assert.fail("Setting demographics by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "Only authorized healthcare providers can perform this action", "Error message should indicate unauthorized access");
    }

    // Try to retrieve demographics by unauthorized provider
    try {
      await demographicsInstance.getDemographics(patient, { from: unauthorizedProvider });
      assert.fail("Retrieving demographics by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "No read permission", "Error message should indicate unauthorized access");
    }
  });
});
