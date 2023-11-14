// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {Context} from "@openzeppelin/contracts/utils/Context.sol";

contract Users is Context {
    struct UserProfile{
        uint256 latestInteraction;
    }
    
    mapping(address account => UserProfile) internal _users;

    function updateLatestInteraction() internal{
        address account = _msgSender();
        _users[account].latestInteraction = block.timestamp;
    }
    
}