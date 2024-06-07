const Medications = artifacts.require("Medications");

contract("Medications", accounts => {
  it("should add medication and retrieve them", async () => {
    const medicationsInstance = await Medications.deployed();
    const patient = accounts[1];
    const provider = accounts[2];

    // Grant read and update access to provider
    await medicationsInstance.grantReadAccess(patient, provider,{from:patient});
    await medicationsInstance.grantUpdateAccess(patient, provider,{from:patient});

    // Add medication by provider
    const medicationName = "Aspirin";
    const dosage = "500mg";
    const startDate = "2023-06-01";
    const endDate = "2023-06-15";

    await medicationsInstance.addMedication(patient, medicationName, dosage, startDate, endDate, { from: provider });

    // Retrieve medications by patient
    const medications = await medicationsInstance.getMedication(patient, { from: provider });

    // Check if medication was added
    assert.equal(medications.length, 1, "Medication should be added");

    // Check if the added medication matches
    assert.equal(medications[0].medicationName, medicationName, "Medication name should match");
    assert.equal(medications[0].dosage, dosage, "Dosage should match");
    assert.equal(medications[0].startDate, startDate, "Start date should match");
    assert.equal(medications[0].endDate, endDate, "End date should match");
  });

  it("should block unauthorized access", async () => {
    const medicationsInstance = await Medications.deployed();
    const patient = accounts[1];
    const unauthorizedProvider = accounts[3];

    // Try to add medication by unauthorized provider
    try {
      await medicationsInstance.addMedication(patient, "Paracetamol", "250mg", "2023-01-15", "2023-01-30", { from: unauthorizedProvider });
      assert.fail("Adding medication by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "Only authorized healthcare providers can perform this action", "Error message should indicate unauthorized access");
    }

    // Try to retrieve medications by unauthorized provider
    try {
      await medicationsInstance.getMedication(patient, { from: unauthorizedProvider });
      assert.fail("Retrieving medications by unauthorized provider should fail");
    } catch (error) {
      assert.include(error.message, "No read permission", "Error message should indicate unauthorized access");
    }
  });
});
