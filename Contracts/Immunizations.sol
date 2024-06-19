// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./AccessControl.sol";

contract Immunizations is AccessControl{
    struct Immunization{
        string vaccine;
        string administeredDate;
    }

    mapping(address => Immunization[]) private immunization;
    event ImmunizationAdded(address indexed providerAddress, address indexed patientAddress, string vaccine);

    function addImmunization(address _patientAddress ,string memory _vaccine, string memory _administeredDate) public onlyProvider(msg.sender, _patientAddress){
        immunization[_patientAddress].push(Immunization(_vaccine, _administeredDate));
        emit ImmunizationAdded(msg.sender, _patientAddress, _vaccine);
    }

    function getImmunization(address _patientAddress) public view onlyProviderOrPatient(_patientAddress) returns (Immunization[] memory){
        return immunization[_patientAddress];
    }
}