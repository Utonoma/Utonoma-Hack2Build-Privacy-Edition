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

    /// #sender: account-1
    function updateContentSuccess() public {
        Identifier memory targetContentIdentifier = Identifier(0, ContentTypes(0));
        bytes32 modifiedContentHash = 0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d888777555555;
        bytes32 modifiedMetadataHash = 0x7465737400000000000000000000000000000000000000000000222222111111;
        
        Content memory originalContent = getContentById(targetContentIdentifier);
        
        Content memory content2 = Content(
            msg.sender,
            modifiedContentHash,
            modifiedMetadataHash,
            originalContent.likes++,
            originalContent.dislikes++,
            originalContent.harvestedLikes++
        );

        updateContent(content2, targetContentIdentifier);

        Content memory modifiedContent = getContentById(targetContentIdentifier);

        Assert.notEqual(
            modifiedContent.contentHash, 
            originalContent.contentHash, 
            "When using the updateContent method to modify the value of the contentHash, it should be different from the original one"
        );
        Assert.equal(
            content2.contentHash,
            modifiedContent.contentHash, 
            "When using the updateContent method to modify the contentHash the new value should be equal to the updated information"
        );

        Assert.notEqual(
            modifiedContent.metadataHash, 
            originalContent.metadataHash, 
            "When using the updateContent method to modify the value of the metadataHash, it should be different from the original one"
        );
        Assert.equal(
            content2.metadataHash,
            modifiedContent.metadataHash, 
            "When using the updateContent method to modify the metadataHash the new value should be equal to the updated information"
        );

        Assert.notEqual(
            modifiedContent.likes, 
            originalContent.likes, 
            "When using the updateContent method to modify the value of the likes, it should be different from the original one"
        );
        Assert.equal(
            content2.likes,
            modifiedContent.likes, 
            "When using the updateContent method to modify the likes the new value should be equal to the updated information"
        );

        Assert.notEqual(
            modifiedContent.dislikes, 
            originalContent.dislikes, 
            "When using the updateContent method to modify the value of the dislikes, it should be different from the original one"
        );
        Assert.equal(
            content2.dislikes,
            modifiedContent.dislikes, 
            "When using the updateContent method to modify the dislikes the new value should be equal to the updated information"
        );

        Assert.notEqual(
            modifiedContent.harvestedLikes, 
            originalContent.harvestedLikes, 
            "When using the updateContent method to modify the value of the harvestedLikes, it should be different from the original one"
        );
        Assert.equal(
            content2.harvestedLikes,
            modifiedContent.harvestedLikes, 
            "When using the updateContent method to modify the harvestedLikes the new value should be equal to the updated information"
        );
    }
}