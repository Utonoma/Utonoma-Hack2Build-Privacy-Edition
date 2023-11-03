// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Utonoma is ERC20 {
    constructor(uint initialSupply) ERC20("Omas", "OMA") {
        _mint(msg.sender, initialSupply);
    }
}