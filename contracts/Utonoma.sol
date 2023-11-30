// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ContentStorage} from "contracts/ContentStorage.sol";

contract Utonoma is ERC20, ContentStorage {
    constructor(uint256 initialSupply) ERC20("Omas", "OMA") {
        _mint(msg.sender, initialSupply);
    }

    function harvestLikes(uint256 indexOfContent, ContentTypes contentType) public {
        Content memory file = _contentLibraries[uint256(contentType)][indexOfContent];
        //Check that positive votes are more than negatives
        require(file.likes > file.dislikes, "Likes should be greater than dislikes");
        //Check that the file should not be deleted
        require(shouldContentBeEliminated(file.likes, file.dislikes) == false, "Content should be eliminated");
        require(file.likes > (file.dislikes + file.harvestedLikes), "There are no more likes to harvest");
        
        uint64 likesToHarvest = file.likes - file.dislikes - file.harvestedLikes;
        //update the number of harvested likes
        _contentLibraries[uint256(contentType)][indexOfContent].harvestedLikes += likesToHarvest;
        uint256 reward = likesToHarvest * calculateReward(getMAU());
        _mint(file.contentOwner, reward);
    }
}