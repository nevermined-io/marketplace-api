import { Authentication, Proof, PublicKey, Service } from './asset.interface';

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
