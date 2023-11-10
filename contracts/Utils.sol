// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

contract Utils {

    /**
    * @dev Receives the number of likes, dislikes and the minimum quorum required to deliverate about a content
    * returns the true if the content should be eliminated, false if not. 
    * 
    * It does it by calculated the upper limit of the confidence interval and compairing it with 2/3, that is 
    * the proportion of negative votes that will cause the content to be eliminated. 
    * https://en.wikipedia.org/wiki/Confidence_interval.
    */
    function shouldContentBeEliminated(uint256 likes, uint256 dislikes, uint256 minimumQuorum) public pure returns(bool) {
        uint256 likesPlusDislikes = (likes + dislikes);
        require(likesPlusDislikes > minimumQuorum, "Minimum quorum hasn't been reached");
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
        uint256 pMinusRootByZ = p - rootByZ;
        uint256 twoThirds = 666666666700000000;
        
        return pMinusRootByZ > twoThirds;
    }
}