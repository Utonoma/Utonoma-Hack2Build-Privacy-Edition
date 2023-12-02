// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import "remix_tests.sol";
import "remix_accounts.sol";
import {ContentStorage} from "../contracts/ContentStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ContentStorage_test is ContentStorage {

    function beforeAll() public {
        for(uint256 i = 0; i < getMaxContentTypes(); i++) {
            Assert.equal(
                getContentLibraryLength(ContentStorage.ContentTypes(i)), 
                0, 
                string.concat("Content Library ", Strings.toString(i)," should have length of 0 when the contract just has been deployed")
            );
        }
    }

    /// #sender: account-0
    function createContentSuccess() public {
        bytes32 contentHash = 0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231;
        bytes32 metadataHash = 0x7465737400000000000000000000000000000000000000000000000000000000;
        for(uint256 i = 0; i < getMaxContentTypes(); i++) { 
            uint256 originalLibraryLength = getContentLibraryLength(ContentTypes(i));
            createContent(Content(msg.sender, contentHash, metadataHash, 0, 0, 0), ContentTypes(i));
            
            uint256 modifiedLibraryLength = getContentLibraryLength(ContentTypes(i));
            Content memory insertedContent = getContentById(Identifier(modifiedLibraryLength - 1, ContentTypes(i)));

            Assert.equal(
                modifiedLibraryLength, 
                originalLibraryLength + 1, 
                string.concat(
                    "When using the createContent method, the size of the contentLibrary ", Strings.toString(i)," should be increased by one"
                )
            );

            Assert.equal(
                insertedContent.contentOwner, 
                TestsAccounts.getAccount(0),
                "When using the createContent method, the address stored in 'contentOwner' should be the same that was used as message sender"
            );

            Assert.equal(
                insertedContent.contentHash, 
                contentHash, 
                "When using the createContent method, the hash stored in 'contentHash' should be the same that was provided in the parameter 'contentHash' to the method"
            );

            Assert.equal(
                insertedContent.metadataHash, 
                metadataHash, 
                "When using the createContent method, the hash stored in 'metadataHash' should be the same that was provided in the parameter 'metadataHash' to the method"
            );
            
        }
    }

    /*
    Note: As the methods for liking and disliking content depends on another contract (Utils and Utonoma) because of the 
    add fee functionality, this methods can't be unitarily tested anymore and needs integration testing to be validated

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
            0x7465737400000000000000000000000000000000000000000000000000000000,
            ContentStorage.ContentTypes(0)
        );
        uint256 length = contentStorage.getContentLibraryLength(ContentStorage.ContentTypes(0));
        
        //like an unexisting content
        try contentStorage.likeContent(length + 1, ContentStorage.ContentTypes(0)) {
            Assert.ok(false, 'method execution should fail');
        } catch Error(string memory reason) {
            // Compare failure reason, check if it is as expected
            Assert.equal(
                reason, 
                "Out of index", 
                "When using the likeContent method and providing an out of range value for the index the execution should be reverted");
        } catch (bytes memory /*lowLevelData*//*) {
            Assert.ok(false, 'failed unexpected');
        }

        //dislike an unexisting content
        try contentStorage.dislikeContent(length, ContentStorage.ContentTypes(0)) {
            Assert.ok(false, 'method execution should fail');
        } catch Error(string memory reason) {
            // Compare failure reason, check if it is as expected
            Assert.equal(reason, 
            "Out of index", 
            "When using the dislikeContent method and providing an out of range value for the index the execution should be reverted");
        } catch (bytes memory /*lowLevelData*//*) {
            Assert.ok(false, 'failed unexpected');
        }
    }
    */
}