const MentalHistory = artifacts.require("MentalHistory");

contract("MentalHistory", accounts => {
  it("should add mental health diagnosis and retrieve them", async () => {
    const mentalHistoryInstance = await MentalHistory.deployed();
    const patient = accounts[1];
    const provider = accounts[2];

    // Grant read and update access to provider
    await mentalHistoryInstance.grantReadAccess(patient, provider, {from:patient});
    await mentalHistoryInstance.grantUpdateAccess(patient, provider,{from:patient});

    // Add mental health diagnosis by provider
    const diagnosis = "Depression";
    const dateDiagnosed = "2023-06-01";

    await mentalHistoryInstance.addDiagnosis(patient, diagnosis, dateDiagnosed, { from: provider });

    // Retrieve mental health diagnosis by patient
    const diagnoses = await mentalHistoryInstance.getDiagnosis(patient, { from: provider });

    // Check if mental health diagnosis was added
    assert.equal(diagnoses.length, 1, "Mental health diagnosis should be added");

    // Check if the added mental health diagnosis matches
    assert.equal(diagnoses[0].mentalHealthDiagnosis, diagnosis, "Diagnosis should match");
    assert.equal(diagnoses[0].dateDiagnosed, dateDiagnosed, "Date diagnosed should match");
  });

  it("should block unauthorized access", async () => {
    const mentalHistoryInstance = await MentalHistory.deployed();
    const patient = accounts[1];
    const unauthorizedProvider = accounts[3];

    // Try to add mental health diagnosis by unauthorized provider
    try {
      await mentalHistoryInstance.addDiagnosis(patient, "Anxiety", "2022-01-15", { from: unauthorizedProvider });
      assert.fail("Adding mental health diagnosis by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "Only authorized healthcare providers can perform this action", "Error message should indicate unauthorized access");
    }

    // Try to retrieve mental health diagnosis by unauthorized provider
    try {
      await mentalHistoryInstance.getDiagnosis(patient, { from: unauthorizedProvider });
      assert.fail("Retrieving mental health diagnosis by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "No read permission", "Error message should indicate unauthorized access");
    }
  });
});
