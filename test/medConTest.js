const MedicalConditions = artifacts.require("MedicalConditions");

contract("MedicalConditions", accounts => {
  it("should add medical condition and retrieve them", async () => {
    const medicalConditionsInstance = await MedicalConditions.deployed();
    const patient = accounts[1];
    const provider = accounts[2];

    // Grant read and update access to provider
    await medicalConditionsInstance.grantReadAccess(patient, provider,{from:patient});
    await medicalConditionsInstance.grantUpdateAccess(patient, provider,{from:patient});

    // Add medical condition by provider
    const condition = "Heart Disease";
    const diagnosisDate = "2023-06-01";

    await medicalConditionsInstance.addMedicalCondition(patient, condition, diagnosisDate, { from: provider });

    // Retrieve medical conditions by patient
    const medicalConditions = await medicalConditionsInstance.getMedicalCondition(patient, { from: provider });

    // Check if medical condition was added
    assert.equal(medicalConditions.length, 1, "Medical condition should be added");

    // Check if the added medical condition matches
    assert.equal(medicalConditions[0].condition, condition, "Condition should match");
    assert.equal(medicalConditions[0].diagnosisDate, diagnosisDate, "Diagnosis date should match");
  });

  it("should block unauthorized access", async () => {
    const medicalConditionsInstance = await MedicalConditions.deployed();
    const patient = accounts[1];
    const unauthorizedProvider = accounts[3];

    // Try to add medical condition by unauthorized provider
    try {
      await medicalConditionsInstance.addMedicalCondition(patient, "Diabetes", "2022-01-15", { from: unauthorizedProvider });
      assert.fail("Adding medical condition by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "Only authorized healthcare providers can perform this action", "Error message should indicate unauthorized access");
    }

    // Try to retrieve medical conditions by unauthorized provider
    try {
      await medicalConditionsInstance.getMedicalCondition(patient, { from: unauthorizedProvider });
      assert.fail("Retrieving medical conditions by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "No read permission", "Error message should indicate unauthorized access");
    }
  });
});
