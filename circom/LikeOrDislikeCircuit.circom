pragma circom 2.0.0;


include "node_modules/circomlib/circuits/poseidon.circom";


template LikeOrDislikeCircuit() {
  // Public input
  signal input voteCommitment;


  signal input s1;
  signal input s2;


  component hasher = Poseidon(2);
  hasher.inputs[0] <== s1;
  hasher.inputs[1] <== s2;

  hasher.out === voteCommitment;
}


component main {public [voteCommitment]} = LikeOrDislikeCircuit();