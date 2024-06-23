

const contractAddresses = {
    accessControl: "0x33d2dAbfB43E3eB6Ca1c0740479054565019a034",
    allergies:"0x3b14C4a66b0855F991af18d87307fc5c60F5Ec16",
    demographics:"0x29645EcBFb333f7Ae353a4765c4441B06F1326F4",
    immunization:"0x045dDA73495844219335142F8EE80d6ea1DAd10b",
    insurance:" 0xe36dCef01f10FE8a4201f203d8Aa5FC91481912E",
    medicalConditions:"0x3Ab43fD543b0ea806e53Af1ddc1D957ac19e4B1a",
    medications:"0xa31bD92137274a0663349B1c1c03dF8443dB4b89",
    medichain: "0x23A533295C37ebb0992CEee9F27aF7f0Bb277a25",
    mentalHealth:"0xD3B9E1aFfBc09DE0B30451beCa66818cCA18A2d3",
    surgeries:"0x03fEED8B8934439411e3cebA42856F6F9Cda1Bdc"
};

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