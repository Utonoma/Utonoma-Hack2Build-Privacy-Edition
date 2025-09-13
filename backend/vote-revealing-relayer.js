const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const snarkjs = require('snarkjs');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// read verification key for off-chain verification:
const verificationKey = JSON.parse(fs.readFileSync('../circom/verification_key.json'));

async function proofToSolidityCallData(proof, publicSignals) {
  const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
  //the array comes as a string, so we need to parse it
  const parsedArray = JSON.parse(`[${calldata}]`);
  return [pA, pB, pC, pubSignals] = parsedArray;;
}

// Endpoint: receive proof + publicSignals + vote meta (contentId,vote)
app.post('/submitReveal', async (req, res) => {
  try {
    const { proof, publicSignals, contentId, vote } = req.body;
    if (!proof || !publicSignals || contentId === undefined || vote === undefined) {
      return res.status(400).json({ error: "missing proof/publicSignals/contentId/vote" });
    }
    // 1) verify off-chain using snarkjs
    const ok = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
    if (!ok) {
      return res.status(400).json({ error: "invalid proof" });
    }
    const solidityCalldata = await proofToSolidityCallData(proof, publicSignals);
    console.log(solidityCalldata)
    return res.json({ status: solidityCalldata });
  } catch (err) {
    console.error("Error submitReveal:", err);
    return res.status(500).json({ error: err.toString() });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log("Relayer listening on port", PORT);
});