# Utonoma

**Utonoma** is a decentralized social network like no other.  
It runs on blockchain and allows content creators to **earn cryptocurrency for each like** they receive.  

The twist?  
- If content gets too many dislikes, it will be removed from the platform.  
- This creates a system of **democratic and decentralized moderation**, shaping a freer and fairer internet.

---

## ✨ Key Features

- 📝 **Post Content**: Share content or proof of positive actions.  
- 👍 **Community Voting**: Likes reward creators, dislikes can remove content.  
- 💰 **Crypto Rewards**: Earn native tokens for valuable contributions.  
- 🗳 **Democratic Moderation**: No centralized censorship, decisions come from the community.  
- 📂 **IPFS Integration**: Content hosted in a censorship-resistant way.  
- ⚖️ **Fair Incentives**: Token issuance adapts to network activity to avoid inflation.  

---

## 🧩 How It Works

1. **Create content** → Users upload content or documentary evidence of actions.  
2. **Voting** → Other users vote on-chain (likes/dislikes).  
3. **Rewards** → Authors earn cryptocurrency proportional to positive votes.  
4. **Moderation** → If negative votes prevail, content is removed and the author penalized.  

---

## 📖 Whitepaper

The full incentive model and technical details are described in the whitepaper:  
👉 [Utonoma Whitepaper (English)](https://blog.utonoma.com/wp-content/uploads/2024/04/utonoma_en.pdf)

```mermaid
sequenceDiagram
    participant Voter
    participant CommitmentCreator
    participant SmartContract
    participant Relayer

    CommitmentCreator->>SmartContract: Submit vote commitment + fee
    SmartContract-->>CommitmentCreator: Commitment ID issued

    CommitmentCreator->>Voter: Share secrets to reveal vote (QR or text)

    Voter->>Relayer: <br>Reveals the zkSNARK proof<br/>+ like or dislike + content ID
    Relayer->>SmartContract: Validates zkSNARK proof and submit tx

    SmartContract->>SmartContract: Verify zkSNARK proof
    SmartContract-->>SmartContract: Proof valid (vote accepted) and marks it to not be revealed again

    SmartContract-->>Voter: Vote recorded (identity not revealed)
```

## 📖 How to compile the circuits
**Prerequisite: Install Rust, Node and Circom** Refer to this guide for the installation: https://docs.circom.io/getting-started/installation/
1. **Install the npm depencies** → Navigate to the /circom folder and type in the terminal "npm install" this will install the requred npm packages required by the circuit.
2. **Compile the circuit** → Run circom LikeOrDislikeCircuit.circom --r1cs --wasm --sym --c
3. **Generate the input file for the witness** → Run the command "node voteCommitmentGenerator.js" It will create a file called input.json that is required for the next step.
4. **Generate the witness** → Run the command node ./LikeOrDislikeCircuit_js/generate_witness.js ./LikeOrDislikeCircuit_js/LikeOrDislikeCircuit.wasm input.json witness.wtns
This will compute the witness with WebAssembly
5. **Do the Powers of Tau ceremony** Run the command: 
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v 
and then 
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
Give entropy as the input to this last command
6. **Do the Phase2** Run this command snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
and then this other:
snarkjs groth16 setup LikeOrDislikeCircuit.r1cs pot12_final.ptau LikeOrDislikeCircuit_0000.zkey
Then this:
snarkjs zkey contribute LikeOrDislikeCircuit_0000.zkey LikeOrDislikeCircuit_0001.zkey --name="1st Contributor Name" -v
And after, this:
snarkjs zkey export verificationkey LikeOrDislikeCircuit_0001.zkey verification_key.json
7. **Generate a proof** 
snarkjs groth16 prove LikeOrDislikeCircuit_0001.zkey witness.wtns proof.json public.json

Validate proof:
snarkjs groth16 verify verification_key.json public.json proof.json

Generate the verification smart contract
snarkjs zkey export solidityverifier LikeOrDislikeCircuit_0001.zkey verifier.sol

snarkjs generatecall
