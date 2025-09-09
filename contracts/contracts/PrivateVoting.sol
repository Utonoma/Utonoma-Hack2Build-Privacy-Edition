// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

import {Groth16Verifier} from "./LikeOrDislikeVerifier.sol";

contract PrivateVoting is Groth16Verifier {
    Groth16Verifier public voteVerifier = new Groth16Verifier();
    mapping(uint256 voteCommitment => bool pendingToReveal) private _secretVotes;

    function getSecretVotes(uint256 voteCommitment) public view returns(bool) {
        //Returns true if this voteCommitment is pending to be revealed
        return _secretVotes[voteCommitment];
    }

    /// @notice Store a vote commitment, allways hide this method behind a paywall to avoid spamming
    function commitVote(uint256 newVoteCommitment) internal {
        _secretVotes[newVoteCommitment] = true;
    }

    // @notice Reveal the vote by veryfying the proof, user will need, among other data, the secret to create this proof.
    function checkVoteValidity(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals
    ) internal returns (bool) {

        require(_secretVotes[_pubSignals[0]] == true, "Secret vote not commited yet");
        require(voteVerifier.verifyProof(_pA, _pB, _pC, _pubSignals), "Invalid proof ");

        _secretVotes[_pubSignals[0]] = false;
        return true;
    }


}