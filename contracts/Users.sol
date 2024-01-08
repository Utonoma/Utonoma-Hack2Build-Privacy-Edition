// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {Utils} from "contracts/Utils.sol";

contract Users is Utils {
    struct UserProfile{
        uint256 latestInteraction;
        bytes15 userName;
        uint64 strikes; 
    }
    
    mapping(address account => UserProfile) internal _users;
    mapping(bytes15 userName => address account) internal _userNames;

    //Each element from the array corresponds to one month
    uint256[] private _MAU;

    function getUserProfile(address account) public view returns(UserProfile memory) {
        return _users[account];
    }

    function getUserNameOwner(bytes15 userName) public view returns(address) {
        return _userNames[userName];
    }

    function getLatestInteractionTime(address account) public view returns(uint256) {
        return _users[account].latestInteraction;
    }

    /// @dev Gets the current period MAU calculation
    /** @notice In case that there are no users (nobody has uploaded a content) 
    *   it will return 0. For the first month of work of the application, the return will be the current period
    *   calculation. For the rest of time, the return will be the MAU calculation of the previous period.
    */
    function getMAU() public view returns(uint256) {
        if(_MAU.length < 2){
            if(_MAU.length < 1) return 0;
            //for the first month the users number should be the current MAU calculation
            return _MAU[_MAU.length - 1];
        }
        return _MAU[_MAU.length - 2];
    }

    /// @dev Returns all the MAU historic data in an array, each element is one month
    function getMAUReport() public view returns(uint256[] memory) {
        return _MAU;
    }

    function createUserName(bytes15 proposedUserName) public {
        isValidUserName(proposedUserName);
        require(getUserProfile(msg.sender).userName == 0x000000000000000000000000000000, "Account already have a username");
        require(getUserNameOwner(proposedUserName) == address(0), "Username isn't available");

        _userNames[proposedUserName] = msg.sender;
        _users[msg.sender].userName = proposedUserName;
    }

    function addStrike(address contentCreator) internal {
        _users[contentCreator].strikes++;        
    }

    function logUserInteraction(
        uint256 currentTime, 
        uint256 startTimeOfNetwork
    ) internal {
        uint256 startTimeMinusCurrent = currentTime - startTimeOfNetwork;
        uint256 elapsedMonths = startTimeMinusCurrent / 30 days;

        //If there are no users during the whole period then fill with 0 in the report
        if(elapsedMonths > _MAU.length) {
            uint256 monthsWithNoInteraction = elapsedMonths - _MAU.length;
            for(uint i = 0; i < monthsWithNoInteraction; i++) {
                _MAU.push(0);
            }
        }
        
        address account = msg.sender;
        uint256 latestUserInteraction = _users[account].latestInteraction;
        bool shouldCountAsNewInteraction;

        //If the interaction is the first of a new opening period.
        if(elapsedMonths + 1 > _MAU.length) {
            _MAU.push(1);
        }

        //if it is the first interaction of the user with the platform
        else if(latestUserInteraction == 0) {shouldCountAsNewInteraction = true;}

        //If the previous interaction was before the begining of the new period
        else {
            uint startTimeOfNewPeriod = startTimeOfNetwork + (30 days * _MAU.length);
            if(startTimeOfNewPeriod < latestUserInteraction) {
                shouldCountAsNewInteraction = true;
            }
        }

        if(shouldCountAsNewInteraction) {
            _MAU[_MAU.length - 1]++;
        }

        _users[account].latestInteraction = currentTime;
    }
}