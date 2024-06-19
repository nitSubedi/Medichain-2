// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./AccessControl.sol";

contract Allergies is AccessControl{
    struct Allergy{
        string allergy;
    }

    mapping(address => Allergy[]) private allergies;

    event AllergyAdded(address indexed providerAddress, address indexed patientAddress, string allergy);

    function addAllergy(address _patient,string memory _allergy) public onlyProvider(msg.sender, _patient){
        allergies[_patient].push(Allergy(_allergy));
        emit AllergyAdded(msg.sender, _patient, _allergy);
    }

    function getAllergies(address _patientAddress) public view onlyProviderOrPatient(_patientAddress) returns (Allergy[] memory){
        return allergies[_patientAddress];
    }
}