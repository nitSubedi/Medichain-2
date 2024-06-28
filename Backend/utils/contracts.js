

const contractAddresses = {
    accessControl: "0xa47C4B05FBcf350b53eF8393C16497739F3A769D",
    allergies:"0x364Bd079a14A7a769D64E7Cb3C94344A9C1AA4c2",
    demographics:"0x22b92368DE6CC428840C072500C102e0fc1Aa3a1",
    immunization:"0xEeE92eE24e32d24fE3F7fec92541b74FE3FB5CB3",
    insurance:"0x5557EEea9b9f5543C9CBE18F31C7C049c78A279F",
    medicalConditions:"0xa11f657E911C37ab72816E75Ac81CD578583c099",
    medications:"0x96C30eC05B01887Ca412E4871F625048529d6f59",
    medichian: "0x3b733c2881e05775c909879954DEb5cD5df27EA8",
    mentalHealth:"0x18be6F4D5ceAd6a6DdE29697c3afFf74CA208926",
    surgeries:"0x91D1E3A72336709237C218F0Dc377A4EC80A2Ce7"
};

const contractABIs ={
    accessControl: require('../../build/contracts/AccessControl.json').abi,
    allergies: require('../../build/contracts/Allergies.json').abi,
    demographics: require('../../build/contracts/Demographics.json').abi,
    immunization: require('../../build/contracts/Immunizations.json').abi,
    insurance: require('../../build/contracts/Insurance.json').abi,
    medicalConditions: require('../../build/contracts/MedicalConditions.json').abi,
    medications: require('../../build/contracts/Medications.json').abi,
    medichain: require('../../build/contracts/Medichain.json').abi,
    mentalHealth: require('../../build/contracts/MentalHistory.json').abi,
    surgeries: require('../../build/contracts/Surgeries.json').abi
};

module.exports = {contractAddresses, contractABIs};