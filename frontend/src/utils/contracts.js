

const contractAddresses = {
    accessControl: "0x818A18e621EE63b5ED8A77d7fBA377F4dE6BBd8B",
    allergies:"0x15DA351604795564435CfAD3845C19e0a84DC4A0",
    demographics:"0xb958700A0Eabc09426BB9C5A68Cb736c8c27F15D",
    immunization:"0xca4aeAF0764d8f9B10827147B5163aff0E517Bf1",
    insurance:"0x5Fa31469a13428c3fC98f743fA03FED07411e335",
    medicalConditions:"0x9998A0795Ba31a4040A613e8aD59D2CF11b2D1FC",
    medications:"0xF06BBcc286D48FEA1e778501f39DFc519e1910F7",
    medichian: "0x0ED8d1c7817824aA65346b738FC695487880b007",
    mentalHealth:"0xACc69C16E3d00387129085B3143B2915ae5C731a",
    surgeries:"0xdFF07179a450732380308B6282515BAAceBce0D4"
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