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
    
    function createContent(Content memory content, ContentTypes contentType) internal {
        _contentLibraries[uint256(contentType)].push(content);
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