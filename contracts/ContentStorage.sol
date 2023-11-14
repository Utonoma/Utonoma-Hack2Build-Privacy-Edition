// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {Users} from "contracts/Users.sol";

contract ContentStorage is Context, Users {

    Content[] private _contentLibrary;

    struct Content {
        address contentOwner;
        bytes32 contentHash;
        bytes32 metadataHash;
        uint64 likes;
        uint64 dislikes;
        uint64 harvestedLikes;
    }

    function getContentLibraryLength() public view returns(uint256){
        return _contentLibrary.length;
    }

    function getContentByIndex(uint256 index) public view returns(Content memory){
        require(index < _contentLibrary.length, "Out of index");
        return _contentLibrary[index];
    }

    function uploadFile(bytes32 content, bytes32 metadata) public {
        _contentLibrary.push(
            Content(
                _msgSender(),
                content,
                metadata,
                0,
                0,
                0
            )
        );
        updateLatestInteraction();
        emit fileUploaded(_contentLibrary.length);
    }

    function likeContent(uint256 index) public {
        require(index < _contentLibrary.length, "Out of index");
        _contentLibrary[index].likes++;
        updateLatestInteraction();
        emit contentLikedOrDisliked(_contentLibrary[index].contentHash, true);
    }

    function dislikeContent(uint256 index) public {
        require(index < _contentLibrary.length, "Out of index");
        _contentLibrary[index].dislikes++;
        updateLatestInteraction();
        emit contentLikedOrDisliked(_contentLibrary[index].contentHash, false);
    }


    //When listening for this event, remember that you will get the length of the library, to 
    //access the file substract 1 to this number in the frontend. We are saving gas in here 
    //so we are delegating it to the front
    event fileUploaded(uint256 indexInLibrary);

    /**
    * @dev Emits an event when like or dislike were successful.
    * {likeOrDislike} should be set to true for liking and false for disliking
    */
    event contentLikedOrDisliked(bytes32 content, bool likeOrDislike);
}