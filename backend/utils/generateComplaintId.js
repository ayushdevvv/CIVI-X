import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 5);

/**
 * Generates a human-friendly, unique complaint ID e.g. CVX-7K2P9
 */
export function generateComplaintId() {
  return `CVX-${nanoid()}`;
}
