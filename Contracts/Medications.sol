// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./AccessControl.sol";

contract Medications is AccessControl{
    struct Medication{
        string medicationName;
        string dosage;
        string startDate;
        string endDate;
    }

    mapping(address => Medication[]) private medications;
    

    event MedicationAdded(address indexed providerAddress,address indexed patientAddress, string medication);

   
    function addMedication(address _patient,string memory _medicationName, string memory _dosage, string memory _startDate, string memory _endDate) external write( _patient){
        medications[_patient].push(Medication(_medicationName, _dosage, _startDate, _endDate));
        emit MedicationAdded(msg.sender, _patient, _medicationName);
    }

    function getMedication(address _patientAddress) public view readOnly(_patientAddress) returns (Medication[] memory){
        return medications[_patientAddress];
    }
}