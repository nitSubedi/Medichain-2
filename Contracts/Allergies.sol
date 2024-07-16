// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "./AccessControl.sol";

contract Allergies is AccessControl{
    struct Allergy{
        string allergy;
    }

    mapping(address => Allergy[]) private allergies;

    event AllergyAdded(address indexed providerAddress, address indexed patientAddress, string allergy);

    function addAllergy(address _patient,string memory _allergy) public canAdd(_patient)  {
        Allergy memory newAllergy = Allergy(_allergy);
        allergies[_patient].push(newAllergy);
        emit AllergyAdded(msg.sender, _patient, _allergy);
    }

    function getAllergies(address _patientAddress) public view readOnly(_patientAddress) returns (Allergy[] memory){
        return allergies[_patientAddress];
    }
}