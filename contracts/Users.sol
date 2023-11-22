// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {Context} from "@openzeppelin/contracts/utils/Context.sol";

contract Users is Context {
    struct UserProfile{
        uint256 latestInteraction;
    }
    
    mapping(address account => UserProfile) internal _users;

    //Each element from the array corresponds to one month
    uint256[] internal _MAU;

    function getLatestInteractionTime(address account) public view returns(uint256) {
        return _users[account].latestInteraction;
    }

    /** @dev Gets the current MAU calculation. In case that there are no users (nobody has uploaded a content) 
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

    function getMAUReport() public view returns(uint256[] memory) {
        return _MAU;
    }

    function calculateMAU(
        uint256 currentTime, 
        uint256 startTimeOfNetwork
    ) public {
        uint256 startTimeMinusCurrent = currentTime - startTimeOfNetwork;
        uint256 elapsedMonths = startTimeMinusCurrent / 30 days;

        //If there are no users during the whole period then fill with 0 in the report
        if(elapsedMonths > _MAU.length) {
            uint256 monthsWithNoInteraction = elapsedMonths - _MAU.length;
            for(uint i = 0; i < monthsWithNoInteraction; i++) {
                _MAU.push(0);
            }
        }
        
        address account = _msgSender();
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