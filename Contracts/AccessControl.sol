// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControl {
    mapping(address => mapping(address => bool)) public readPermissions;
    mapping(address => mapping(address => bool)) public  writePermissions;

    modifier onlyPatient(address _patient) {
        require(msg.sender == _patient, "Only the patient can perform this action");
        _;
    }

    modifier readOnly(address _patient) {
        require(msg.sender == _patient || readPermissions[_patient][msg.sender], "No read permission");
        _;
    }

    modifier write( address _patient) {
        require(writePermissions[_patient] [msg.sender], "Only authorized healthcare providers can perform this action");
        _;
    }

    modifier canRead(address _patient) {
        require(msg.sender == _patient || readPermissions[_patient][msg.sender], "No read permission");
        _;
    }

    modifier canAdd(address _patient) {
        require(writePermissions[_patient][msg.sender], "No add permission");
        _;
    }

    

    function grantReadAccess(address _patient, address _provider) public  onlyPatient(_patient) {
        readPermissions[_patient] [ _provider]=true;
    }

    function revokeReadAccess(address _patient, address _provider) public onlyPatient(_patient) {
        delete readPermissions[_patient] [_provider];
    }

    function grantUpdateAccess(address _patient, address _provider) public onlyPatient(_patient) {
        writePermissions[_patient] [_provider]=true;
    }

    function revokeUpdateAccess(address _patient, address _provider) public onlyPatient(_patient){
        delete writePermissions[_patient] [_provider];
    }

    function hasReadPermission(address _patient, address _provider) internal view returns (bool) {
        return readPermissions[_patient][_provider];
    }

    function hasAddPermission(address _patient, address _provider) internal view returns (bool) {
        return writePermissions[_patient][_provider];
    }





}
