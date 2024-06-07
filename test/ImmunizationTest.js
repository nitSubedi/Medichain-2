const Immunizations = artifacts.require("Immunizations");

contract("Immunizations", accounts => {
  it("should add immunization and retrieve them", async () => {
    const immunizationsInstance = await Immunizations.deployed();
    const patient = accounts[1];
    const provider = accounts[2];

    // Grant read and update access to provider
    await immunizationsInstance.grantReadAccess(patient, provider,{from:patient});
    await immunizationsInstance.grantUpdateAccess(patient, provider,{from:patient});

    // Add immunization by provider
    const vaccine = "COVID-19";
    const administeredDate = "2021-05-01";

    await immunizationsInstance.addImmunization(patient, vaccine, administeredDate, { from: provider });

    // Retrieve immunizations by patient
    const immunizations = await immunizationsInstance.getImmunization(patient, { from: provider });

    // Check if immunization was added
    assert.equal(immunizations.length, 1, "Immunization should be added");

    // Check if the added immunization matches
    assert.equal(immunizations[0].vaccine, vaccine, "Vaccine should match");
    assert.equal(immunizations[0].administeredDate, administeredDate, "Administered date should match");
  });

  it("should block unauthorized access", async () => {
    const immunizationsInstance = await Immunizations.deployed();
    const patient = accounts[1];
    const unauthorizedProvider = accounts[3];

    // Try to add immunization by unauthorized provider
    try {
      await immunizationsInstance.addImmunization(patient, "Flu Shot", "2021-10-01", { from: unauthorizedProvider });
      assert.fail("Adding immunization by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "Only authorized healthcare providers can perform this action", "Error message should indicate unauthorized access");
    }

    // Try to retrieve immunizations by unauthorized provider
    try {
      await immunizationsInstance.getImmunization(patient, { from: unauthorizedProvider });
      assert.fail("Retrieving immunizations by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "No read permission", "Error message should indicate unauthorized access");
    }
  });
});
