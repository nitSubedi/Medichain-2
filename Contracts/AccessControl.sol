// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControl {
    mapping(address => mapping(address => bool)) private providerPermissions;

    modifier onlyPatient(address _patient) {
        require(msg.sender == _patient, "Only the patient can perform this action");
        _;
    }

    modifier onlyProviderOrPatient(address _patient) {
        require(msg.sender == _patient || providerPermissions[_patient][msg.sender], "No read permission");
        _;
    }

    modifier onlyProvider(address _provider, address _patient) {
        require(providerPermissions[_patient][_provider], "Only authorized healthcare providers can perform this action");
        _;
    }

    modifier canRead(address _patient) {
        require(msg.sender == _patient || providerPermissions[_patient][msg.sender], "No read permission");
        _;
    }

    modifier canAdd(address _patient) {
        require(providerPermissions[_patient][msg.sender], "No add permission");
        _;
    }

    function grantPermission(address _patient, address _provider) internal {
        providerPermissions[_patient][_provider] = true;
    }

    function revokePermission(address _patient, address _provider) internal {
        delete providerPermissions[_patient][_provider];
    }

    function grantReadAccess(address _patient, address _provider) public onlyPatient(_patient) {
        grantPermission(_patient, _provider);
    }

    function revokeReadAccess(address _patient, address _provider) public onlyPatient(_patient) {
        revokePermission(_patient, _provider);
    }

    function grantUpdateAccess(address _patient, address _provider) public onlyPatient(_patient) {
    grantPermission(_patient, _provider);
    }

    function revokeUpdateAccess(address _patient, address _provider) public onlyPatient(_patient){
        revokePermission(_patient, _provider);
    }

    function hasReadPermission(address _patient, address _provider) public view returns (bool) {
    return providerPermissions[_patient][_provider];
    }

    function hasAddPermission(address _patient) public view returns (bool) {
    return providerPermissions[_patient][msg.sender];
    }





}
