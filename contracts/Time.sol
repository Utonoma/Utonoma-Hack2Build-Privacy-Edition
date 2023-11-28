// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

abstract contract Time {
    uint256 _startTimeOfTheNetwork;

    constructor() {
        _startTimeOfTheNetwork = block.timestamp;
    }

    function startTimeOfTheNetwork() public view returns (uint256) {
        return _startTimeOfTheNetwork;
    }
}