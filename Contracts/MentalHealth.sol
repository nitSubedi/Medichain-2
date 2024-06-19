// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./AccessControl.sol";

contract MentalHistory is AccessControl{
    struct MentalHealth{
        string mentalHealthDiagnosis;
        string dateDiagnosed;
    }

    mapping(address => MentalHealth[]) private mentalHealth;

    event DiagnosisAdded(address indexed providerAddress, address indexed patientAddress, string mentalHealth);

    function addDiagnosis(address _patient, string memory _mentalHealthDiagnosis, string memory _dateDiagnosed) public onlyProvider(msg.sender, _patient){
        mentalHealth[_patient].push(MentalHealth(_mentalHealthDiagnosis, _dateDiagnosed));
        emit DiagnosisAdded(msg.sender, _patient,  _mentalHealthDiagnosis);
    }

    function getDiagnosis(address _patientAddress) public view onlyProviderOrPatient(_patientAddress) returns (MentalHealth[] memory){
        return mentalHealth[_patientAddress];
    }
}