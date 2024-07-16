// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./AccessControl.sol";

contract MedicalConditions is AccessControl{
    struct MedicalCondition{
        string condition;
        string diagnosisDate;
    }
    mapping(address => MedicalCondition[]) private medicalCondition;
    event MedicalConditionAdded(address indexed providerAddress,address indexed patientAddress, string condition);

    function addMedicalCondition(address _patient,string memory _condition, string memory _diagnosisDate) public write( _patient){
        medicalCondition[_patient].push(MedicalCondition(_condition, _diagnosisDate));
        emit MedicalConditionAdded(msg.sender, _patient, _condition);
    }

    function getMedicalCondition(address _patientAddress) public view readOnly(_patientAddress) returns (MedicalCondition[] memory){
        return medicalCondition[_patientAddress];
    }
}