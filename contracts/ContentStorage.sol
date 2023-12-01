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

    function getContentById(Identifier calldata id) public view returns(Content memory){
        require(id.index < _contentLibraries[uint256(id.contentLibrary)].length, "Out of index");
        return _contentLibraries[uint256(id.contentLibrary)][id.index];
    }

    function uploadFile(bytes32 content, bytes32 metadata, ContentTypes contentType) public {
        _contentLibraries[uint256(contentType)].push(
            Content(
                _msgSender(),
                content,
                metadata,
                0,
                0,
                0
            )
        );
        calculateMAU(block.timestamp, _startTimeOfTheNetwork);
        emit fileUploaded(_contentLibraries.length, contentType);
    }

    function likeContent(uint256 index, ContentTypes contentType) public {
        require(index < _contentLibraries[uint256(contentType)].length, "Out of index");
        collectFee(calculateFee(getMAU()));
        _contentLibraries[uint256(contentType)][index].likes++;
        calculateMAU(block.timestamp, _startTimeOfTheNetwork);
        emit contentLikedOrDisliked(_contentLibraries[uint256(contentType)][index].contentHash, contentType, true);
    }

    function dislikeContent(uint256 index, ContentTypes contentType) public {
        require(index < _contentLibraries[uint256(contentType)].length, "Out of index");
        collectFee(calculateFee(getMAU()));
        _contentLibraries[uint256(contentType)][index].dislikes++;
        calculateMAU(block.timestamp, _startTimeOfTheNetwork);
        emit contentLikedOrDisliked(_contentLibraries[uint256(contentType)][index].contentHash, contentType, false);
    }

    
    //When listening for this event, remember that you will get the length of the library, to 
    //access the file substract 1 to this number in the frontend. We are saving gas in here 
    //so we are delegating it to the front
    event fileUploaded(uint256 indexInLibrary, ContentTypes contentType);

    /**
    * @dev Emits an event when like or dislike were successful.
    * {likeOrDislike} should be set to true for liking and false for disliking
    */
    event contentLikedOrDisliked(bytes32 content, ContentTypes contentType, bool likeOrDislike);

}