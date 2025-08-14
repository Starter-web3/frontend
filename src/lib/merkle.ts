import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Papa from "papaparse";
import { ethers } from "ethers";

export interface Recipient {
  address: string;
  amount?: string; // Optional for custom distributions
}

export interface RecipientWithProof extends Recipient {
  proof: string[];
}

export function createMerkleTree(
  recipients: Recipient[],
  isCustomDistribution: boolean = false,
  defaultAmount: string = "0"
): {
  merkleTree: MerkleTree;
  merkleRoot: string;
  proofs: { [address: string]: string[] };
  recipientsWithProof: RecipientWithProof[];
} {
  const normalizedRecipients = recipients
    .filter((r) => r.address && ethers.isAddress(r.address))
    .map((r) => ({
      ...r,
      address: r.address.toLowerCase().trim(),
      amount: isCustomDistribution && r.amount ? r.amount : defaultAmount,
    }));

  if (normalizedRecipients.length === 0) {
    throw new Error("No valid addresses found in recipient list");
  }

  const leaves = normalizedRecipients.map((r) => {
    if (isCustomDistribution && r.amount) {
      const amountBN = ethers.parseUnits(r.amount, 18);
      return keccak256(
        ethers.solidityPacked(["address", "uint256"], [r.address, amountBN])
      );
    }
    return keccak256(r.address);
  });

  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getHexRoot();

  const proofs: { [address: string]: string[] } = {};
  const recipientsWithProof: RecipientWithProof[] = [];

  normalizedRecipients.forEach((r) => {
    const leaf =
      isCustomDistribution && r.amount
        ? keccak256(
            ethers.solidityPacked(
              ["address", "uint256"],
              [r.address, ethers.parseUnits(r.amount, 18)]
            )
          )
        : keccak256(r.address);

    const proof = merkleTree.getHexProof(leaf);
    proofs[r.address] = proof;

    recipientsWithProof.push({ ...r, proof });
  });

  return {
    merkleTree,
    merkleRoot,
    proofs,
    recipientsWithProof,
  };
}

/**
 * Parse a CSV file into recipient list
 * CSV format: address, amount (optional)
 */
export async function parseCSV(file: File): Promise<Recipient[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (result) => {
        if (result.errors && result.errors.length > 0) {
          console.error("CSV parsing errors:", result.errors);
        }

        const recipients: Recipient[] = [];

        for (const row of result.data as Array<{
          address?: string;
          amount?: string;
        }>) {
          if (!row.address) continue;
          const address = String(row.address).trim();
          if (!ethers.isAddress(address)) {
            console.warn(`Invalid address skipped: ${address}`);
            continue;
          }

          recipients.push({
            address,
            amount: row.amount ? String(row.amount).trim() : undefined,
          });
        }

        resolve(recipients);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}

/**
 * Verifies address eligibility by reconstructing the merkle tree
 */
export function verifyAddressEligibility(
  address: string,
  recipientsWithProof: RecipientWithProof[],
  merkleRoot: string,
  isCustomDistribution: boolean = false,
  defaultAmount: string = "0"
): { eligible: boolean; proof?: string[] } {
  const normalizedAddress = address.toLowerCase().trim();

  const recipient = recipientsWithProof.find(
    (r) => r.address.toLowerCase() === normalizedAddress
  );
  if (!recipient) return { eligible: false };

  const leaves = recipientsWithProof.map((r) => {
    const amount = isCustomDistribution && r.amount ? r.amount : defaultAmount;
    if (isCustomDistribution && amount) {
      const amountBN = ethers.parseUnits(amount, 18);
      return keccak256(
        ethers.solidityPacked(
          ["address", "uint256"],
          [r.address.toLowerCase(), amountBN]
        )
      );
    }
    return keccak256(r.address.toLowerCase());
  });

  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  const leaf =
    isCustomDistribution && recipient.amount
      ? keccak256(
          ethers.solidityPacked(
            ["address", "uint256"],
            [normalizedAddress, ethers.parseUnits(recipient.amount, 18)]
          )
        )
      : keccak256(normalizedAddress);

  const isValid = merkleTree.verify(recipient.proof, leaf, merkleRoot);

  return {
    eligible: isValid,
    proof: isValid ? recipient.proof : undefined,
  };
}
