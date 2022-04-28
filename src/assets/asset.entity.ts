import { Authentication, Proof, PublicKey, Service } from './asset.interface';

export class Asset {
  id: string;
  ['@context']: string;
  userId: string;
  authentication: Authentication[];
  created: string;
  updated: string;
  proof: Proof;
  publicKey: PublicKey[];
  service: Service[];
}
