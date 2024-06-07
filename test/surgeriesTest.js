const Surgeries = artifacts.require("Surgeries");

contract("Surgeries", accounts => {
  it("should add surgery and retrieve them", async () => {
    const surgeriesInstance = await Surgeries.deployed();
    const patient = accounts[1];
    const provider = accounts[2];

    // Grant read and update access to provider
    await surgeriesInstance.grantReadAccess(patient, provider, { from: patient });
await surgeriesInstance.grantUpdateAccess(patient, provider, { from: patient });


    // Add surgery by provider
    const surgeryType = "Appendectomy";
    const surgeryDate = "2023-06-01";

    await surgeriesInstance.addSurgery(patient, surgeryType, surgeryDate, { from: provider });

    // Retrieve surgeries by patient
    const surgeries = await surgeriesInstance.getSurgery(patient, { from: provider });

    // Check if surgery was added
    assert.equal(surgeries.length, 1, "Surgery should be added");

    // Check if the added surgery matches
    assert.equal(surgeries[0].surgeryType, surgeryType, "Surgery type should match");
    assert.equal(surgeries[0].surgeryDate, surgeryDate, "Surgery date should match");
  });

  it("should block unauthorized access", async () => {
    const surgeriesInstance = await Surgeries.deployed();
    const patient = accounts[1];
    const unauthorizedProvider = accounts[3];

    // Try to add surgery by unauthorized provider
    try {
      await surgeriesInstance.addSurgery(patient, "Knee Replacement", "2022-01-15", { from: unauthorizedProvider });
      assert.fail("Adding surgery by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "Only authorized healthcare providers can perform this action", "Error message should indicate unauthorized access");
    }

    // Try to retrieve surgeries by unauthorized provider
    try {
      await surgeriesInstance.getSurgery(patient, { from: unauthorizedProvider });
      assert.fail("Retrieving surgeries by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "No read permission", "Error message should indicate unauthorized access");
    }
  });
});
