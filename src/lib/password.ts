import crypto from "crypto";

const PEPPER = "doctor-house-care-doc-gate";

export function hashPassword(plain: string): string {
  return crypto
    .createHash("sha256")
    .update(PEPPER + plain)
    .digest("hex");
}
