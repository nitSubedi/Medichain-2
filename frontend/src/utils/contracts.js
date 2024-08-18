const contractAddresses = {
    accessControl: "0xF5E0309da905B0828f2ad696bCe6F058c73fc0eE",
    allergies: "0x5BB2D184b0CD3d681c500712800B8b5222d678D1",
    demographics: "0x02cE2e59c2ec4D3F46EFe2FC56da7B5b442FAF15",
    immunization: "0x6D0a727976606F8cC383055B3D4b6F2678BCebbb",
    insurance: "0x8c90365342aAF8239D6Eb8DF9F53f1c3e6f66c19",
    medicalConditions: "0x64e922CFEb567c352ADDA5736B007c77C01217d6",
    medications: "0x1D9C09C451D2cce8E42283DFfcFC4157B3234Fc7",
    medichain: "0x1331f480cCFfc06e9A82b7d4a48F304DF8e0116c",
    mentalHealth: "0x26Cefd84194529cE533eFbB757B254481E248209",
    surgeries: "0xaD3fbAc3505dF32179a4c5265529e487eEb49e58"
};

// If you need to include any additional functions or changes from other branches, add them below
const contractABIs ={
    accessControl: require('../components/build/contracts/AccessControl.json').abi,
    allergies: require('../components/build/contracts/Allergies.json').abi,
    demographics: require('../components/build/contracts/Demographics.json').abi,
    immunization: require('../components/build/contracts/Immunizations.json').abi,
    insurance: require('../components/build/contracts/Insurance.json').abi,
    medicalConditions: require('../components/build/contracts/MedicalConditions.json').abi,
    medications: require('../components/build/contracts/Medications.json').abi,
    medichain: require('../components/build/contracts/Medichain.json').abi,
    mentalHealth: require('../components/build/contracts/MentalHistory.json').abi,
    surgeries: require('../components/build/contracts/Surgeries.json').abi
};

module.exports = {contractAddresses, contractABIs};