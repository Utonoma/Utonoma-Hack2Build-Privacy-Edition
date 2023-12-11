// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ContentStorage} from "contracts/ContentStorage.sol";
import {Users} from "contracts/Users.sol";
import {Time} from "contracts/Time.sol";
import {Utils} from "contracts/Utils.sol";

contract Utonoma is ERC20, ContentStorage, Utils, Users, Time {
    constructor(uint256 initialSupply) ERC20("Omas", "OMA") {
        _mint(msg.sender, initialSupply);
    }

    function upload(bytes32 contentHash, bytes32 metadataHash, ContentTypes contentType) public {
        calculateMAU(block.timestamp, _startTimeOfTheNetwork);
        Content memory content = Content(
            _msgSender(),
            contentHash,
            metadataHash,
            0,
            0,
            0
        );
        createContent(content, contentType);
    }

    function like(Identifier calldata id) public {
        collectFee(calculateFee(getMAU()));
        Content memory content = getContentById(id);
        content.likes++;
        updateContent(content, id);
        calculateMAU(block.timestamp, _startTimeOfTheNetwork);
        emit liked(id.index, uint256(id.contentType));
    }

    function dislike(Identifier calldata id) public {
        collectFee(calculateFee(getMAU()));
        Content memory content = getContentById(id);
        content.dislikes++;
        updateContent(content, id);
        calculateMAU(block.timestamp, _startTimeOfTheNetwork);
        emit disliked(id.index, uint256(id.contentType));
    }

    function harvestLikes(Identifier calldata id) public {
        Content memory content = getContentById(id);
        require(content.likes > content.dislikes, "Likes should be greater than dislikes");
        require(shouldContentBeEliminated(content.likes, content.dislikes) == false, "Content should be eliminated");
        require(content.likes > (content.dislikes + content.harvestedLikes), "There are no more likes to harvest");
        
        uint64 likesToHarvest = content.likes - content.dislikes - content.harvestedLikes;
        content.harvestedLikes += likesToHarvest;
        updateContent(content, id);
        uint256 reward = likesToHarvest * calculateReward(getMAU());
        _mint(content.contentOwner, reward);
        emit harvested(id.index, uint256(id.contentType), reward);
    }

    function deletion(Identifier calldata id) public {
        Content memory content = getContentById(id);
        require(shouldContentBeEliminated(content.likes, content.dislikes));
        deleteContent(id);
        emit deleted(content.contentOwner, content.contentHash, content.metadataHash, id.index, uint8(id.contentType));
    }

    event liked(uint256 indexed index, uint256 indexed contentType);

    event disliked(uint256 indexed index, uint256 indexed contentType);

    event harvested(uint256 indexed index, uint256 indexed contentType, uint256 amount);

    event deleted(address indexed owner, bytes32 content, bytes32 metadata, uint256 index, uint8 contentType);

    event replied(uint256 replyIndex, uint256 replyContentType, uint256 indexed replyingToIndex, uint256 indexed replyingToContentType);

}