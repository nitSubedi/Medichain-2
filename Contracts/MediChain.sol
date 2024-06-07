// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "./AccessControl.sol";
import "./Demographics.sol";
import "./MedicalConditions.sol";
import "./Medications.sol";
import "./Allergies.sol";
import "./Surgeries.sol";
import "./Immunizations.sol";
import "./MentalHealth.sol";
import "./Insurance.sol";

contract MediChain is AccessControl, Demographics,MedicalConditions,Medications,Allergies,Surgeries,Immunizations,MentalHistory,Insurance{
    
}