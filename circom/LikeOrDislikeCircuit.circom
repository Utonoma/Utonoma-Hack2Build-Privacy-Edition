pragma circom 2.0.0;


include "node_modules/circomlib/circuits/poseidon.circom";


template LikeOrDislikeCircuit() {
  // Public input
  signal input voteCommitment;


  signal input vote; // 0 for dislike and 1 for like
  signal input secret; // randomness
  signal input index;
  signal input contentType;


  // Check that vote is binary
  vote * (1 - vote) === 0;


  component h = Poseidon(4);
  h.inputs[0] <== vote;
  h.inputs[1] <== secret;
  h.inputs[2] <== index;
  h.inputs[3] <== contentType;

  h.out === voteCommitment;
}


component main {public [voteCommitment]} = LikeOrDislikeCircuit();