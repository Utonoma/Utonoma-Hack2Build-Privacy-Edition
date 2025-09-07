pragma circom 2.0.0;


include "node_modules/circomlib/circuits/poseidon.circom";


template LikeOrDislikeCircuit() {
  // Public input
  signal input voteCommitment;


  signal input vote; // 0 for dislike and 1 for like
  signal input secret; // randomness
  signal input id;


  // Check that vote is binary
  vote * (1 - vote) === 0;


  component h = Poseidon(3);
  h.inputs[0] <== vote;
  h.inputs[1] <== secret;
  h.inputs[2] <== id;
  h.out === voteCommitment;
}


component main {public [voteCommitment]} = LikeOrDislikeCircuit();