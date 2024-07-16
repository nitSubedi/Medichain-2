const contractAddresses = {
    accessControl: "0xc5dD556Aff3bFB13D716f44d7fA90E1ac028400E",
    allergies: "0xdD72169a42b6Bb18e2121409D4ee70158B918616",
    demographics: "0x03F8014AEe3fa1D785475d3b59b5272fD5F1c1D3",
    immunization: "0xF7A5320156d35c786dAF73664fcd872A08ca4060",
    insurance: "0x1d38746299a80A47Ee7Ee013055920418B4c94Fa",
    medicalConditions: "0x796D886AF7EB12f432aBb97E7D4E542760c57017",
    medications: "0x3a1fa948b64c914D899457d3532B3Cd676948482",
    medichain: "0x69CC83F569869C46D9b30059f33f4e9b097DdA14",
    mentalHealth: "0xa7d949cd464Ef8B62CB796B197C00fC057A516fD",
    surgeries: "0xED06B8691871B07c1a5f0A0f4e8255B1FD2Ff486"
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