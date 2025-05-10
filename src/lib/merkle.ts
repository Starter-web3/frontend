import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import Papa from 'papaparse';
import { ethers } from 'ethers';

export interface Recipient {
  address: string;
  amount?: string; // Optional but kept for future use
}

export interface RecipientWithProof extends Recipient {
  proof: string[];
}

export function createMerkleTree(recipients: Recipient[]): {
  merkleTree: MerkleTree;
  merkleRoot: string;
  proofs: { [address: string]: string[] };
  recipientsWithProof: RecipientWithProof[];
} {
  // Normalize and validate addresses first
  const normalizedRecipients = recipients
    .filter((recipient) => recipient.address && ethers.isAddress(recipient.address))
    .map((recipient) => ({
      ...recipient,
      address: recipient.address.toLowerCase().trim(),
    }));

  if (normalizedRecipients.length === 0) {
    throw new Error('No valid addresses found in recipient list');
  }

  // Hash addresses consistently with the smart contract
  // Note: If the contract checks both address and amount, you would need to hash them together
  // like: keccak256(ethers.solidityPacked(['address', 'uint256'], [address, amount]))
  const leaves = normalizedRecipients.map((recipient) => keccak256(recipient.address));

  console.log('🔍 Normalized Addresses:');
  normalizedRecipients.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.address}`);
  });

  console.log('🔢 Leaves (hashed addresses):');
  leaves.forEach((leaf, i) => {
    console.log(`  Leaf ${i + 1}: ${leaf.toString('hex')}`);
  });

  // Create the Merkle tree with sorted pairs for consistent root
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getHexRoot();

  console.log('🌳 Generated Merkle Root:', merkleRoot);

  const proofs: { [address: string]: string[] } = {};
  const recipientsWithProof: RecipientWithProof[] = [];

  // Generate proofs for each recipient
  normalizedRecipients.forEach((recipient) => {
    const leaf = keccak256(recipient.address);
    const proof = merkleTree.getHexProof(leaf);
    proofs[recipient.address] = proof;

    console.log(`🧾 Proof for ${recipient.address}:`, proof);

    // Verify proof is valid against the root
    const isValid = merkleTree.verify(proof, leaf, merkleRoot);
    console.log(`✅ Proof valid for ${recipient.address}?`, isValid);

    if (!isValid) {
      console.error('❌ WARNING: Invalid proof generated for', recipient.address);
    }

    recipientsWithProof.push({
      ...recipient,
      proof,
    });
  });

  return {
    merkleTree,
    merkleRoot,
    proofs,
    recipientsWithProof,
  };
}

/**
 * Parse a CSV file into a list of recipients
 * Expected format: CSV with 'address' column (required) and 'amount' column (optional)
 */
export async function parseCSV(file: File): Promise<Recipient[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep everything as strings
      complete: (result) => {
        if (result.errors && result.errors.length > 0) {
          console.error('CSV parsing errors:', result.errors);
        }

        const recipients: Recipient[] = [];

        // Process each row
        for (const row of result.data as Array<{ address?: string; amount?: string }>) {
          // Skip rows with no address
          if (!row.address) continue;

          const address = String(row.address).trim();

          // Validate Ethereum address
          if (!ethers.isAddress(address)) {
            console.warn(`Invalid address skipped: ${address}`);
            continue;
          }

          recipients.push({
            address,
            amount: row.amount ? String(row.amount).trim() : undefined,
          });
        }

        console.log(`Parsed ${recipients.length} valid recipients from CSV`);
        resolve(recipients);
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        reject(error);
      },
    });
  });
}

/**
 * Verify if an address is eligible to claim by checking if it's in the merkle tree
 */
export function verifyAddressEligibility(
  address: string,
  recipientsWithProof: RecipientWithProof[],
  merkleRoot: string,
): { eligible: boolean; proof?: string[] } {
  // Normalize address
  const normalizedAddress = address.toLowerCase().trim();

  // Find recipient
  const recipient = recipientsWithProof.find((r) => r.address.toLowerCase() === normalizedAddress);

  if (!recipient) {
    return { eligible: false };
  }

  // Verify proof
  const leaf = keccak256(normalizedAddress);
  const merkleTree = new MerkleTree([], keccak256, { sortPairs: true });
  const isValid = merkleTree.verify(recipient.proof, leaf, merkleRoot);

  return {
    eligible: isValid,
    proof: isValid ? recipient.proof : undefined,
  };
}
