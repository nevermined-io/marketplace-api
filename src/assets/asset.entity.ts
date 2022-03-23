import { Authentication, Proof, PublicKey, Authorization, Access, Metadata } from './asset.interface';

type Service = Authorization | Access | Metadata;

export class Asset {
  id: string;
  ['@context']: string;
  authentication: Authentication[];
  created: Date;
  proof: Proof;
  publicKey: PublicKey[];
  service: Service[];

  constructor() {
    this.created = new Date();
  }
}
