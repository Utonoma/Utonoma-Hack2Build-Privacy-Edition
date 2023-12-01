// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {Users} from "contracts/Users.sol";
import {Time} from "contracts/Time.sol";
import {Utils} from "contracts/Utils.sol";

contract ContentStorage is Context, Users, Time, Utils {

    enum ContentTypes {
        audios,
        music,
        podcasts,
        audioLivestreams,
        videos,
        shortVideos,
        movies,
        videoLivestreams,
        comments,
        blogs,
        books,
        images,
        animations,
        videoGames,
        apps
    }

    struct Identifier {
        uint256 index;
        ContentTypes contentLibrary;
    }

    struct Content {
        address contentOwner;
        bytes32 contentHash;
        bytes32 metadataHash;
        uint64 likes;
        uint64 dislikes;
        uint64 harvestedLikes;
    }

    Content[][15] internal _contentLibraries;

    function getMinContentTypes() public pure returns(uint256) {
        return uint256(type(ContentTypes).min);
    }

    function getMaxContentTypes() public pure returns(uint256) {
        return uint256(type(ContentTypes).max);
    }

    function getContentLibraryLength(ContentTypes contentType) public view returns(uint256){
        return _contentLibraries[uint256(contentType)].length;
    }

    function getContentById(Identifier calldata id) contentShouldExists(id) public view returns(Content memory){
        return _contentLibraries[uint256(id.contentLibrary)][id.index];
    }
    
    modifier contentShouldExists(Identifier calldata id) {
        require(id.index < _contentLibraries[uint256(id.contentLibrary)].length, "Out of index");
        _;
    }

    //When listening for this event, remember that you will get the length of the library, to 
    //access the file substract 1 to this number in the frontend. We are saving gas in here 
    //so we are delegating it to the front
    event fileUploaded(Identifier indexed id);

    /**
    * @dev Emits an event when like or dislike were successful.
    * {likeOrDislike} should be set to true for liking and false for disliking
    */
    event contentLikedOrDisliked(Identifier indexed id, bool likeOrDislike);

}