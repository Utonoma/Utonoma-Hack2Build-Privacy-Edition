const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
  // Example values
  const vote = 0n; // 0 = dislike, 1 = like
  const secret = 1234567890123456789012345678901221322n; // must be bigint
  const index = 1n; // index of the content in the content type library
  const contentType = 0n; // One of the content types available in Utonoma

  // Build Poseidon
  const poseidon = await circomlibjs.buildPoseidon();

  // Calculate commitment
  const commitment = poseidon.F.toObject(poseidon([vote, secret, index, contentType]));

  // Prepare input object
  const input = {
    vote: Number(vote), // Circom likes integers in decimal
    secret: secret.toString(),
    index: Number(index),
    contentType: Number(contentType),
    voteCommitment: commitment.toString()
  };

  // Write to file
  fs.writeFileSync("input.json", JSON.stringify(input, null, 2));

  console.log("✅ input.json generated!");
  console.log(input);
}

main();