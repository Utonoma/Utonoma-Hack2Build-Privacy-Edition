// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Utils {

    uint256 private constant _baseReward = 1000;
    //uint256 internal constant _commission = 1333333333333333333; //1.333333333333333333% of commission
    //If the values of the _baseReward or _commission changes, the next const should also be recalculated
    uint256 private constant _commissionByBaseReward = 1333333333333333333000;
    uint256 private constant _minimumQuorum = 5;

    function baseReward() external pure returns (uint256) {
        return _baseReward;
    }

    function commissionByBaseReward() external pure returns(uint256) {
        return _commissionByBaseReward;
    }

    function minimumQuorum() external pure returns(uint256) {
        return _minimumQuorum;
    }


    /**
    * @dev Receives the number of likes, dislikes and the minimum quorum required to deliverate about a content
    * returns the true if the content should be eliminated, false if not. 
    * 
    * It does it by calculated the upper limit of the confidence interval and compairing it with 2/3, that is 
    * the proportion of negative votes that will cause the content to be eliminated. 
    * https://en.wikipedia.org/wiki/Confidence_interval.
    */
    function shouldContentBeEliminated(uint256 likes, uint256 dislikes) public pure returns(bool) {
        uint256 likesPlusDislikes = (likes + dislikes);
        require(likesPlusDislikes > _minimumQuorum, "Minimum quorum hasn't been reached");
        if(dislikes == 0) return false;
        uint256 normalizedDislikes = dislikes * 10**18;
        uint256 p = normalizedDislikes / likesPlusDislikes;
        uint256 oneMinusP = 1000000000000000000 - p;
        uint256 pByOneMinusP = p * oneMinusP;
        uint256 n = likesPlusDislikes * 10**18;
        uint256 pByOneMinusPBetweenN = pByOneMinusP / n;
        uint256 root = Math.sqrt(pByOneMinusPBetweenN);
        uint256 z = 1960000000000000000;
        uint256 rootByZ = (root * z) / 10**9;
        uint256 pMinusRootByZ;
        unchecked{
            pMinusRootByZ = p - rootByZ;
        }
        if(pMinusRootByZ > p) return false;
        uint256 twoThirds = 666666666700000000;
        
        return pMinusRootByZ > twoThirds;
    }

    function calculateReward(uint256 usersNumber) public pure returns(uint256) {
        require(usersNumber != 0, "Number of users can't be zero");
        return (10**18 * _baseReward) / usersNumber**2;
    }

    function calculateFee(uint256 usersNumber) public pure returns(uint256) {
        require(usersNumber != 0, "Number of users can't be zero");
        return _commissionByBaseReward / usersNumber**2;
    }

    function calculateFeeForUsersWithStrikes(uint64 numberOfStrikes, uint256 usersNumber) public pure returns(uint256) {
        require(numberOfStrikes > 0, "Number of strikes should be greater than zero");
        return calculateFee(usersNumber) ** numberOfStrikes;
    }

    function collectFee(uint256 fee) internal {
        require(IERC20(address(this)).balanceOf(msg.sender) >= fee, "Balance is not enough to pay the fee");
        require(IERC20(address(this)).allowance(msg.sender, address(this)) >= fee, 
            "No allowance to this smarcontract for the fee amount");
        IERC20(address(this)).transferFrom(msg.sender, address(this), fee);
    }

    function isValidUserName(bytes15 userName) public pure returns(bool) {
        require(userName != 0x0, "User name is empty");

        uint256 numberOfCharacters;
        bool nullSpace;
        bool charAfterNullSpace;
        for(uint256 i = 0; i < 15; i++) {
            if(userName[i] == 0x00) nullSpace = true;
            if(nullSpace && userName[i] != 0x00) charAfterNullSpace = true;

            require(
                userName[i] == 0x00 ||
                userName[i] == 0x5F ||
                (userName[i] >= 0x30 && userName[i] <= 0x39) ||
                (userName[i] >= 0x61 && userName[i] <= 0x7A),
                "Forbidden character in username"
            );

            if(userName[i] != 0x00) numberOfCharacters++;
        }

        require(numberOfCharacters > 3, "At least 4 characters");
        require(!charAfterNullSpace, "Invalid null value in between username");

        return true;
    }
}