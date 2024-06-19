// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./AccessControl.sol";

contract Demographics is AccessControl{
    struct Demographic{
        string name;
        string dateOfBirth;
        string gender;
        string homeAddress;
    }

    mapping(address => Demographic) private demographics;
    

    event DemographicsUpdated(address indexed providerAddress, address indexed patientAddress);

    function setDemographics(address _patient, string memory _name, string memory _dateOfBirth, string memory _gender, string memory _homeAddress) public onlyProvider(msg.sender, _patient){
        demographics[_patient] = Demographic(_name, _dateOfBirth, _gender, _homeAddress);
        emit DemographicsUpdated(msg.sender,_patient);
    }

    function getDemographics(address _patientAddress) public view onlyProviderOrPatient(_patientAddress) returns (string memory, string memory, string memory, string memory){
        Demographic memory demo = demographics[_patientAddress];
        return (demo.name, demo.dateOfBirth, demo.gender, demo.homeAddress);
    }
    }


