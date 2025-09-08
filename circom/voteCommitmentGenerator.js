const fs = require("fs");
const circomlibjs = require("circomlibjs");
const crypto = require("crypto");

async function main() {


  // Generate random secrets (bigints)
  // You can also set them manually if needed
  const s1 = BigInt("0x" + crypto.randomBytes(31).toString("hex")); // 248-bit secret
  const s2 = BigInt("0x" + crypto.randomBytes(31).toString("hex"));


  // Build Poseidon
  const poseidon = await circomlibjs.buildPoseidon();

  // Calculate commitment
  const voteCommitment = poseidon.F.toObject(poseidon([s1, s2]));

  // Prepare input.json
  const input = {
    s1: s1.toString(),
    s2: s2.toString(),
    voteCommitment: voteCommitment.toString()
  };

  // Write to file
  fs.writeFileSync("input.json", JSON.stringify(input, null, 2));

  console.log("✅ input.json generated!");
  console.log(input);
}

main();