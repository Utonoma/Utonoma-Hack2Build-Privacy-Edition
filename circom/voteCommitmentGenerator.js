const circomlibjs = require("circomlibjs");

async function main() {
  const poseidon = await circomlibjs.buildPoseidon();

  const vote = 1n;
  const secret = 12345678901234567890123456789012n;
  const id = 3n;

  const commitment = poseidon.F.toObject(
    poseidon([vote, secret, id])
  );

  console.log("Commitment:", commitment.toString());
}
main();