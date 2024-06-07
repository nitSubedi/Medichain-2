// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./AccessControl.sol";

contract Surgeries is AccessControl{
    struct Surgery{
        string surgeryType;
        string surgeryDate;
    }

    mapping(address => Surgery[]) private surgeries;
    event SurgeryAdded(address indexed providerAddress, address indexed patientAddress, string surgery);

    function addSurgery(address _patient, string memory _surgeryType, string memory _surgeryDate) public onlyProvider(msg.sender, _patient){
        surgeries[_patient].push(Surgery(_surgeryType, _surgeryDate));
        emit SurgeryAdded(msg.sender, _patient,  _surgeryType);
    }

    function getSurgery(address _patientAddress) public view onlyProviderOrPatient(_patientAddress) returns (Surgery[] memory){
        return surgeries[_patientAddress];
    }

}