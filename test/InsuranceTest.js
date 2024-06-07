const Insurance = artifacts.require("Insurance");
contract("Insurance", accounts => {
    it("should set insurance details and retrieve them", async () => {
      const insuranceInstance = await Insurance.deployed();
      const patient = accounts[1];
      const provider = accounts[2];
  
      // Grant read and update access to provider
      await insuranceInstance.grantReadAccess(patient, provider,{from:patient});
      await insuranceInstance.grantUpdateAccess(patient, provider,{from:patient});
  
      // Set insurance details by provider
      const providerName = "ABC Insurance";
      const policyNumber = "123456789";
      const coverageDetails = "Healthcare coverage";
      const coverageLimit = 1000;
      const effectiveDateStart = "2023-01-01";
      const effectiveDateEnd = "2024-12-31";
      const contactInfo = "contact@example.com";
  
      await insuranceInstance.setInsurance(
        patient,
        providerName,
        policyNumber,
        coverageDetails,
        coverageLimit,
        effectiveDateStart,
        effectiveDateEnd,
        contactInfo,
        { from: provider }
      );
  
      // Retrieve insurance details by patient
      const results = await insuranceInstance.getInsurance(patient, { from: provider });
  
      // Check if insurance details were set and retrieved correctly
      assert.equal(results[0], providerName, "Provider name should match");
      assert.equal(results[1], policyNumber, "Policy number should match");
      assert.equal(results[2], coverageDetails, "Coverage details should match");
      assert.equal(results[3], coverageLimit, "Coverage limit should match");
      assert.equal(results[4], effectiveDateStart, "Effective date start should match");
      assert.equal(results[5], effectiveDateEnd, "Effective date end should match");
      assert.equal(results[6], contactInfo, "Contact info should match");
    });
  
    it("should block unauthorized access", async () => {
      const insuranceInstance = await Insurance.deployed();
      const patient = accounts[1];
      const unauthorizedProvider = accounts[3];
  
      // Try to set insurance details by unauthorized provider
      try {
        await insuranceInstance.setInsurance(patient, "XYZ Insurance", "987654321", "Medical coverage", 2000, "2023-01-01", "2024-12-31", "othercontact@example.com", { from: unauthorizedProvider });
        assert.fail("Setting insurance details by unauthorized provider should fail");
      } catch (error) {
        assert.include(error.message, "Only authorized healthcare providers can perform this action", "Error message should indicate unauthorized access");
      }
  
      // Try to retrieve insurance details by unauthorized provider
      try {
        await insuranceInstance.getInsurance(patient, { from: unauthorizedProvider });
        assert.fail("Retrieving insurance details by unauthorized provider should fail");
      } catch (error) {
        assert.include(error.message, "No read permission", "Error message should indicate unauthorized access");
      }
    });
  });
  