// SPDX-License-Identifier: MIT
        
pragma solidity 0.8.22;

import "remix_tests.sol";
import "../contracts/Utils.sol";

contract testSuite {

    Utils utils;

    function beforeAll() public {
        utils = new Utils();
    }

    function shouldContentBeEliminated() public {
        uint256 minimumQuorum = 5;

        //True cases
        Assert.equal(
            utils.shouldContentBeEliminated(24, 76, minimumQuorum),
            true, 
            "shouldContentBeEliminated method, when receiving 24 likes and 76 dislikes, should return true (0.6763 is higher than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(1, 8, minimumQuorum),
            true, 
            "shouldContentBeEliminated method, when receiving 1 likes and 8 dislikes, should return true (0.6836 is higher than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(0, 6, minimumQuorum),
            true, 
            "shouldContentBeEliminated method, when receiving 0 likes and 6 dislikes, should return true (in case there are no likes, ouptut will default true as long as the minimum quorum is reached)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(13, 47, minimumQuorum),
            true, 
            "shouldContentBeEliminated method, when receiving 13 likes and 47 dislikes, should return true (0.6791 is higher than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(43310, 98100, minimumQuorum),
            true, 
            "shouldContentBeEliminated method, when receiving 13 likes and 47 dislikes, should return true (0.6791 is higher than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(43310, 98100, minimumQuorum),
            true, 
            "shouldContentBeEliminated method, when receiving 13 likes and 47 dislikes, should return true (0.6791 is higher than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(4950000000, 10050000000, minimumQuorum),
            true, 
            "shouldContentBeEliminated method, when receiving 4950000000 likes and 10050000000 dislikes, should return true (0.67 is higher than 0.66666666666)"
        );

        //false cases
        Assert.equal(
            utils.shouldContentBeEliminated(10, 8, minimumQuorum),
            false, 
            "shouldContentBeEliminated method, when receiving 10 likes and 8 dislikes, should return false (0.2148865106 is lesser than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(20, 5, minimumQuorum),
            false, 
            "shouldContentBeEliminated method, when receiving 20 likes and 5 dislikes, should return false (0.0432 is lesser than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(420, 280, minimumQuorum),
            false, 
            "shouldContentBeEliminated method, when receiving 420 likes and 280 dislikes, should return false (0.36 is lesser than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(8, 0, minimumQuorum),
            false, 
            "shouldContentBeEliminated method, when receiving 8 likes and 0 dislikes, should return false (because there are no dislikes)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(44, 56, minimumQuorum),
            false, 
            "shouldContentBeEliminated method, when receiving 44 likes and 56 dislikes, should return false (0.4627 is lesser than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(25, 75, minimumQuorum),
            false, 
            "shouldContentBeEliminated method, when receiving 25 likes and 75 dislikes, should return false (0.6651 is lesser than 0.66666666666)"
        );
        Assert.equal(
            utils.shouldContentBeEliminated(9759000000, 5241000000, minimumQuorum),
            false, 
            "shouldContentBeEliminated method, when receiving 5241000000 likes and 9759000000 dislikes, should return false (0.3494 is lesser than 0.66666666666)"
        );
    }

    function shouldContentBeEliminatedShouldRevert() public {
        //pass as parameters 2 likes, 2 dislikes (4 votes in total) and 5 for minimum quorum
        try utils.shouldContentBeEliminated(2,2,5) {
            Assert.ok(false, 'method execution should fail');
        } catch Error(string memory reason) {
            Assert.equal(
                reason, 
                "Minimum quorum hasn't been reached", 
                "In the shouldContentBeEliminated method if the total number of votes (likes plus dislikes) are less than the minimumQuorum the transaction should be reverted");
        } catch (bytes memory /*lowLevelData*/) {
            Assert.ok(false, 'failed unexpected');
        }
    }
}