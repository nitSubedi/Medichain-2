const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cors = require('cors');
const crypto = require('crypto')
const {contractAddresses,contractABIs} = require('../utils/contracts')
const {getContract}= require('../utils/blockchain');
const createWallet = require('../utils/wallet');
const ethers = require('ethers');


const decrypt = (text, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
  
    if (!token) {
      return res.sendStatus(401);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403); 
        }
        req.user = user; 
        next(); 
      });
};

router.post('/login', async (req, res) => {
    const { userID, password, role, phoneNumber } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(400).json({ message: "Invalid username or password or phoneNumber" });
        }
        const iv = Buffer.from(user.iv, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
        let decryptedUserID = '';
        if (user.userID) {
            decryptedUserID = decipher.update(user.userID, 'hex', 'utf-8');
            decryptedUserID += decipher.final('utf-8');
        } else {
            console.error("Encrypted wallet address is missing");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch || decryptedUserID !== userID || user.role !== role) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        
        const token = jwt.sign(
            { userID: user.userID, role: user.role, walletAddress:user.walletAddress, phone: user.phoneNumber, private: user.privateKey  },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ userID: req.user.userID });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const iv = Buffer.from(user.iv, 'hex');
        const decryptedWalletAddress = decrypt(user.walletAddress,iv)

        const decryptedUserID = decrypt(user.userID,iv);

        const decryptedPrivateKey = decrypt(user.privateKey, iv);
        res.json({
            userID: decryptedUserID,
            role: user.role,
            walletAddress: decryptedWalletAddress,
            phoneNumber: user.phoneNumber,
            privateKey: decryptedPrivateKey
        });
    } catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/patientData', authenticateToken, async(req,res)=>{
    const{patientAddress} = req.query;
    try {
        const user = await User.findOne({ userID: req.user.userID });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const iv = Buffer.from(user.iv, 'hex');
        const decryptedPrivateKey = decrypt(user.privateKey, iv);
        const wallet = createWallet(decryptedPrivateKey);
        const allergiesContract = getContract(contractAddresses.allergies, contractABIs.allergies, wallet);
        const demographicsContract = getContract(contractAddresses.demographics, contractABIs.demographics, wallet);
        const immunizationsContract = getContract(contractAddresses.immunization, contractABIs.immunization, wallet);
        const insuranceContract = getContract(contractAddresses.insurance, contractABIs.insurance, wallet);
        const medicalConditionsContract = getContract(contractAddresses.medicalConditions, contractABIs.medicalConditions, wallet);
        const medicationsContract = getContract(contractAddresses.medications, contractABIs.medications, wallet);
        const mentalHistoryContract = getContract(contractAddresses.mentalHealth, contractABIs.mentalHealth, wallet);
        const surgeriesContract = getContract(contractAddresses.surgeries, contractABIs.surgeries, wallet);

        const allergies = await allergiesContract.getAllergies(patientAddress);
        const demographics = await demographicsContract.getDemographics(patientAddress);
        const immunizations = await immunizationsContract.getImmunization(patientAddress);
        const insurance = await insuranceContract.getInsurance(patientAddress);
        const medicalConditions = await medicalConditionsContract.getMedicalCondition(patientAddress);
        const medications = await medicationsContract.getMedication(patientAddress);
        const mentalHistory = await mentalHistoryContract.getDiagnosis(patientAddress);
        const surgeries = await surgeriesContract.getSurgery(patientAddress);

        const patientData = {
            allergies,
            demographics,
            immunizations,
            insurance,
            medicalConditions,
            medications,
            mentalHistory,
            surgeries
        };

        res.json(patientData);
    } catch (error) {
        console.error("Error retrieving patient data:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/updatePatientData', authenticateToken, async (req, res) => {
    const { patientAddress, contractName, newData } = req.body;

    try {
        const user = await User.findOne({ userID: req.user.userID });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const iv = Buffer.from(user.iv, 'hex');
        const decryptedPrivateKey = decrypt(user.privateKey, iv);
        const wallet = createWallet(decryptedPrivateKey);

        const contract = getContract(contractAddresses[contractName], contractABIs[contractName], wallet);

        switch (contractName) {
            case 'allergies':
                await contract.addAllergy(patientAddress, newData);
                break;
            case 'demographics':
                const [name, dateOfBirth, gender, homeAddress] = newData.split(',');
                await contract.setDemographics(patientAddress, name, dateOfBirth, gender, homeAddress);
                break;
            case 'immunization':
                const [vaccine, administeredDate] = newData.split(',');
                await contract.addImmunization(patientAddress, vaccine, administeredDate);
                break;
            case 'insurance':
                const [provider, policyNumber, coverageDetails, coverageLimit, effectiveDateStart, effectiveDateEnd, contactInfo] = newData.split(',');
                await contract.setInsurance(patientAddress, provider, policyNumber, coverageDetails, coverageLimit, effectiveDateStart, effectiveDateEnd, contactInfo);
                break;
            case 'medicalConditions':
                const [condition, diagnosisDate] = newData.split(',');
                await contract.addMedicalCondition(patientAddress, condition, diagnosisDate);
                break;
            case 'medication':
                const [medicationName, dosage, startDate, endDate] = newData.split(',');
                await contract.addMedication(patientAddress, medicationName, dosage, startDate, endDate);
                break;
            case 'mentalHealth':
                const [mentalHealthDiagnosis, dateDiagnosed] = newData.split(',');
                await contract.addDiagnosis(patientAddress, mentalHealthDiagnosis, dateDiagnosed);
                break;
            case 'surgeries':
                const [surgeryType, surgeryDate] = newData.split(',');
                await contract.addSurgery(patientAddress, surgeryType, surgeryDate);
                break;
            default:
                return res.status(400).json({ message: "Unknown contract name" });
        }

        res.status(200).json({ message: 'Update successful' });
    } catch (error) {
        console.error('Error interacting with contract:', error);
        res.status(500).json({ error: 'Failed to interact with contract' });
    }
});

router.post('/grantReadAccess', authenticateToken, async (req, res) => {
    const { patientAddress, providerAddress } = req.body;

    try {
        const user = await User.findOne({ userID: req.user.userID });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const iv = Buffer.from(user.iv, 'hex');
        const decryptedPrivateKey = decrypt(user.privateKey, iv);
        const wallet = new ethers.Wallet(decryptedPrivateKey, new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL));
        console.log(`Decrypted Private Key: ${decryptedPrivateKey}`);
        console.log(`Wallet Address: ${wallet.address}`);
        console.log(`Patient Address: ${patientAddress}`);
        const accessControlContract = getContract(contractAddresses.accessControl, contractABIs.accessControl, wallet);

        await accessControlContract.grantReadAccess(patientAddress, providerAddress);

        res.status(200).json({ message: 'Read access granted successfully' });
    } catch (error) {
        console.error('Error granting read access:', error);
        res.status(500).json({ error: 'Failed to grant read access' });
    }
});

// Revoke Read Access
router.post('/revokeReadAccess', authenticateToken, async (req, res) => {
    const { patientAddress, providerAddress } = req.body;

    try {
        const user = await User.findOne({ userID: req.user.userID });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const iv = Buffer.from(user.iv, 'hex');
        const decryptedPrivateKey = decrypt(user.privateKey, iv);
        const wallet = createWallet(decryptedPrivateKey);

        const accessControlContract = getContract(contractAddresses.accessControl, contractABIs.accessControl, wallet);

        await accessControlContract.revokeReadAccess(patientAddress, providerAddress);

        res.status(200).json({ message: 'Read access revoked successfully' });
    } catch (error) {
        console.error('Error revoking read access:', error);
        res.status(500).json({ error: 'Failed to revoke read access' });
    }
});

// Grant Update Access
router.post('/grantUpdateAccess', authenticateToken, async (req, res) => {
    const { patientAddress, providerAddress } = req.body;

    try {
        const user = await User.findOne({ userID: req.user.userID });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const iv = Buffer.from(user.iv, 'hex');
        const decryptedPrivateKey = decrypt(user.privateKey, iv);
        const wallet = createWallet(decryptedPrivateKey);

        const accessControlContract = getContract(contractAddresses.accessControl, contractABIs.accessControl, wallet);

        await accessControlContract.grantUpdateAccess(patientAddress, providerAddress);

        res.status(200).json({ message: 'Update access granted successfully' });
    } catch (error) {
        console.error('Error granting update access:', error);
        res.status(500).json({ error: 'Failed to grant update access' });
    }
});

// Revoke Update Access
router.post('/revokeUpdateAccess', authenticateToken, async (req, res) => {
    const { patientAddress, providerAddress } = req.body;

    try {
        const user = await User.findOne({ userID: req.user.userID });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const iv = Buffer.from(user.iv, 'hex');
        const decryptedPrivateKey = decrypt(user.privateKey, iv);
        const wallet = createWallet(decryptedPrivateKey);

        const accessControlContract = getContract(contractAddresses.accessControl, contractABIs.accessControl, wallet);

        await accessControlContract.revokeUpdateAccess(patientAddress, providerAddress);

        res.status(200).json({ message: 'Update access revoked successfully' });
    } catch (error) {
        console.error('Error revoking update access:', error);
        res.status(500).json({ error: 'Failed to revoke update access' });
    }
});



module.exports = router;
