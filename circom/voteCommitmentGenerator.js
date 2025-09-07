const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
  // Example values
  const vote = 1n; // 0 = dislike, 1 = like
  const secret = 12345678901234567890123456789012n; // must be bigint
  const id = 3n; // proposalId

  // Build Poseidon
  const poseidon = await circomlibjs.buildPoseidon();

  // Calculate commitment
  const commitment = poseidon.F.toObject(poseidon([vote, secret, id]));

  // Prepare input object
  const input = {
    vote: Number(vote), // Circom likes integers in decimal
    secret: secret.toString(),
    id: Number(id),
    voteCommitment: commitment.toString()
  };

  // Write to file
  fs.writeFileSync("input.json", JSON.stringify(input, null, 2));

  console.log("✅ input.json generated!");
  console.log(input);
}

main();