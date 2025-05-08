import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Papa from "papaparse";
import { ethers } from "ethers";

export interface Recipient {
  address: string;
  amount?: string;
}

export function createMerkleTree(recipients: Recipient[]): {
  merkleTree: MerkleTree;
  merkleRoot: string;
  proofs: { [address: string]: string[] };
} {
  const leaves = recipients.map((recipient) =>
    keccak256(ethers.solidityPackedKeccak256(["address"], [recipient.address]))
  );

  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getHexRoot();

  const proofs: { [address: string]: string[] } = {};
  recipients.forEach((recipient, index) => {
    proofs[recipient.address.toLowerCase()] = merkleTree.getHexProof(leaves[index]);
  });

  return { merkleTree, merkleRoot, proofs };
}

export async function parseCSV(file: File): Promise<Recipient[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const recipients: Recipient[] = result.data
          .map((row: any) => ({
            address: row.address?.trim(),
            amount: row.amount?.trim(),
          }))
          .filter((recipient) => recipient.address && ethers.isAddress(recipient.address));
        resolve(recipients);
      },
      error: (error) => reject(error),
    });
  });
}