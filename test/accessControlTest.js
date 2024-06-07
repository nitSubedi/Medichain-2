const Allergies = artifacts.require("Allergies");

contract("Allergies", accounts => {
  it("should grant permission, add allergy, retrieve allergies, and block unauthorized access", async () => {
    const allergiesInstance = await Allergies.deployed();
    const patient = accounts[1];
    const provider = accounts[2];
    const unauthorizedProvider = accounts[3];
    const allergy = "Peanuts";

    // Grant read and update access to provider
    await allergiesInstance.grantReadAccess(patient, provider,{from:patient});
    await allergiesInstance.grantUpdateAccess(patient, provider,{from:patient});

    // Add allergy by provider
    await allergiesInstance.addAllergy(patient, allergy, { from: provider });

    // Retrieve allergies by patient
    const allergies = await allergiesInstance.getAllergies(patient,{from: provider});

    // Check if allergy was added
    assert.equal(allergies.length, 1, "Allergy should be added");

    // Check if the added allergy matches
    assert.equal(allergies[0].allergy, allergy, "Allergy should match");

    // Try to add allergy by unauthorized provider
    try {
      await allergiesInstance.addAllergy(patient, "Shellfish", { from: unauthorizedProvider });
      assert.fail("Adding allergy by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "Only authorized healthcare providers can perform this action", "Error message should indicate unauthorized access");
    }
  });
});
