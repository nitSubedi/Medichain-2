const contractAddresses = {
    accessControl: "0x5a48536128763aE54716a31CE7f28D2E04b802Ec",
    allergies: "0xf2d3DcaE557Ff2093233C6cFDd7e8F64447A619E",
    demographics: "0xd3d2BF906CFDD1EA79bBb9429510462Fb1fCc8db",
    immunization: "0x2e5ab639f7aF458273cB552008F8f865650729ba",
    insurance: "0x20F2ffF68b1e1c458104503A717eDC3f94846f3F",
    medicalConditions: "0x96eE1ae95DEaf9Dae71471eA5eB2bC1b0076ddEe",
    medications: "0x3bd7264e811097e0cB4cd5Ec879991cecdcB9D0d",
    medichain: "0x363062933c7AC10D662aaA2846fbF1c0EeaF761f",
    mentalHealth: "0x44792f29E14F2FB44AC5e1d2107eF347ad370fdD",
    surgeries: "0x14b613dDDcD0c265195Ce40C3816393d5CA2B539"
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