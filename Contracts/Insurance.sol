// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "./AccessControl.sol";

contract Insurance is AccessControl{
    struct InsuranceDetails{
        string provider;
        string policyNumber;
        string coverageDetails;
        uint256 coverageLimit;
        string effectiveDateStart;
        string effectiveDateEnd;
        string contactInfo;
    }

    mapping(address => InsuranceDetails) private insurance;

    event InsuranceUpdated(address indexed providerAdderess, address indexed patientAddress, string provider);

    function setInsurance(
        address _patient,
        string memory _provider,
        string memory _policyNumber,
        string memory _coverageDetails,
        uint256 _coverageLimit,
        string memory _effectiveDateStart,
        string memory _effectiveDateEnd,
        string memory _contactInfo
    ) public write( _patient){
        insurance[_patient] = InsuranceDetails(
            _provider,
            _policyNumber,
            _coverageDetails,
            _coverageLimit,
            _effectiveDateStart,
            _effectiveDateEnd,
            _contactInfo
        );
        emit InsuranceUpdated(msg.sender, _patient, _provider);

    }

    function getInsurance(address _patientAddress) public view readOnly(_patientAddress) returns(
        string memory,
        string memory,
        string memory,
        uint256,
        string memory,
        string memory,
        string memory
    ){
        InsuranceDetails memory ins = insurance[_patientAddress];
        return(
            ins.provider,
            ins.policyNumber,
            ins.coverageDetails,
            ins.coverageLimit,
            ins.effectiveDateStart,
            ins.effectiveDateEnd,
            ins.contactInfo
        );
    }



}