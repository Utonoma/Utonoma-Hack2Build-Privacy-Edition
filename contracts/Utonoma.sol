// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ContentStorage} from "contracts/ContentStorage.sol";

contract Utonoma is ERC20, ContentStorage {
    constructor(uint256 initialSupply) ERC20("Omas", "OMA") {
        _mint(msg.sender, initialSupply);
    }
}