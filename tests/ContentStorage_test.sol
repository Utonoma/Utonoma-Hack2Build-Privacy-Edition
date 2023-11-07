// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import "remix_tests.sol";
import "../contracts/ContentStorage.sol";

contract ContentStorage_test {

    ContentStorage contentStorage;

    function beforeAll() public {
        contentStorage = new ContentStorage();
        Assert.equal(contentStorage.getContentLibraryLength(), 0, "Library length should be 0 when the contract just has been deployed");
    }

    function uploadFileSuccess() public {
        uint256 originalLibraryLength = contentStorage.getContentLibraryLength();
        bytes32 content = 0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231;
        bytes32 metadata = 0x7465737400000000000000000000000000000000000000000000000000000000;
        contentStorage.uploadFile(
            content, 
            metadata
        );

        uint256 modifiedLibraryLength = contentStorage.getContentLibraryLength();
        bytes32 insertedContent = contentStorage.getContentByIndex(modifiedLibraryLength - 1).contentHash; 
        bytes32 insertedMetadata = contentStorage.getContentByIndex(modifiedLibraryLength - 1).metadataHash;

        Assert.equal(
            modifiedLibraryLength, 
            originalLibraryLength + 1, 
            "When using the uploadFile method, the size of the contentLibrary should be increased by one"
        );

        Assert.equal(
            insertedContent, 
            content, 
            "When using the uploadFile method, the hash stored in 'contentHash' should be the same that was provided in the parameter 'content' to the method"
        );

        Assert.equal(
            insertedMetadata, 
            metadata, 
            "When using the uploadFile method, the hash stored in 'metadataHash' should be the same that was provided in the parameter 'metadata' to the method"
        );
    }

    function likeDislikeContentSuccess() public {
        //upload a file to the content library
        contentStorage.uploadFile(
            0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231, 
            0x7465737400000000000000000000000000000000000000000000000000000000
        );
        uint256 length = contentStorage.getContentLibraryLength();
        //like the uploaded file
        contentStorage.likeContent(length - 1);
        //dislike the uploaded file
        contentStorage.dislikeContent(length - 1);

        Assert.equal(
            contentStorage.getContentByIndex(length - 1).likes, 
            1, 
            "When using the likeContent method, the number of likes on the target content should increase by one."
        );

        Assert.equal(
            contentStorage.getContentByIndex(length - 1).dislikes, 
            1, 
            "When using the dislikeContent method, the number of dislikes on the target content should increase by one."
        );
    }

    function likeDislikeContentShouldRevert() public {
        //upload a file to the content library
        contentStorage.uploadFile(
            0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231, 
            0x7465737400000000000000000000000000000000000000000000000000000000
        );
        uint256 length = contentStorage.getContentLibraryLength();
        
        //like an unexisting content
        try contentStorage.likeContent(length + 1) {
            Assert.ok(false, 'method execution should fail');
        } catch Error(string memory reason) {
            // Compare failure reason, check if it is as expected
            Assert.equal(
                reason, 
                "Out of index", 
                "When using the likeContent method and providing an out of range value for the index the execution should be reverted");
        } catch (bytes memory /*lowLevelData*/) {
            Assert.ok(false, 'failed unexpected');
        }

        //dislike an unexisting content
        try contentStorage.dislikeContent(length) {
            Assert.ok(false, 'method execution should fail');
        } catch Error(string memory reason) {
            // Compare failure reason, check if it is as expected
            Assert.equal(reason, 
            "Out of index", 
            "When using the dislikeContent method and providing an out of range value for the index the execution should be reverted");
        } catch (bytes memory /*lowLevelData*/) {
            Assert.ok(false, 'failed unexpected');
        }
    }
}