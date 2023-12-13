// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

contract ContentStorage {

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
        ContentTypes contentType;
    }

    struct Content {
        address contentOwner;
        bytes32 contentHash;
        bytes32 metadataHash;
        uint64 likes;
        uint64 dislikes;
        uint64 harvestedLikes;
        uint256[] replyingTo;
        uint8[] replyingToContentType;
        uint256[] repliedBy;
        uint8[] repliedByContentType;
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

    function getContentById(Identifier memory id) contentShouldExists(id) public view returns(Content memory){
        return _contentLibraries[uint256(id.contentType)][id.index];
    }

    function getContentsRepliedByThis(Identifier memory id) contentShouldExists(id) public view returns(Identifier[] memory) {
        uint256 replyingToLength = _contentLibraries[uint256(id.contentType)][id.index].replyingTo.length;
        Identifier[] memory contentsRepliedByThis = new Identifier[](replyingToLength);
        for(uint256 i = 0; i < replyingToLength; i++) {
            contentsRepliedByThis[i] = Identifier(
                _contentLibraries[uint256(id.contentType)][id.index].replyingTo[i],
                ContentTypes(_contentLibraries[uint256(id.contentType)][id.index].replyingToContentType[i])
            );
        }
        return contentsRepliedByThis;
    }

    function getRepliesToThisContent(Identifier memory id) contentShouldExists(id) public view returns(Identifier[] memory) {
        uint256 repliedByLength = _contentLibraries[uint256(id.contentType)][id.index].repliedBy.length;
        Identifier[] memory repliesToThisContent = new Identifier[](repliedByLength);
        for(uint256 i = 0; i < repliedByLength; i++) {
            repliesToThisContent[i] = Identifier(
                _contentLibraries[uint256(id.contentType)][id.index].repliedBy[i],
                ContentTypes(_contentLibraries[uint256(id.contentType)][id.index].repliedByContentType[i])
            );
        }
        return repliesToThisContent;
    }
    
    /// @dev Creates a new content in the specified content library. Returns the id of this new content
    function createContent(Content memory content, ContentTypes contentType) internal returns(Identifier memory) {
        _contentLibraries[uint256(contentType)].push(content);
        return Identifier(getContentLibraryLength(contentType) - 1, contentType);
    }

    function createReply(
        Identifier memory replyId, 
        Identifier memory replyingToId
    ) contentShouldExists(replyId) contentShouldExists(replyingToId) internal {
        _contentLibraries[uint256(replyId.contentType)][replyId.index].replyingTo.push(replyingToId.index);
        _contentLibraries[uint256(replyId.contentType)][replyId.index].replyingToContentType.push(uint8(replyingToId.contentType));

        _contentLibraries[uint256(replyingToId.contentType)][replyingToId.index].repliedBy.push(replyId.index);
        _contentLibraries[uint256(replyingToId.contentType)][replyingToId.index].repliedByContentType.push(uint8(replyId.contentType));
    }

    function updateContent(Content memory content, Identifier memory id) contentShouldExists(id) internal {
        _contentLibraries[uint256(id.contentType)][id.index] = content;
    }

    function deleteContent(Identifier memory id) contentShouldExists(id) internal {
        delete(_contentLibraries[uint256(id.contentType)][id.index]);
    }

    modifier contentShouldExists(Identifier memory id) {
        require(id.index < _contentLibraries[uint256(id.contentType)].length, "Out of index");
        _;
    }

}