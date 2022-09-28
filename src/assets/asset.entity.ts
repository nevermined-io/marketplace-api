import { Authentication, Nvm, Proof, PublicKey, Service } from './asset.interface';

export class Asset {
  id: string;
  ['@context']: string;
  _nvm: Nvm;
  authentication: Authentication[];
  created: string;
  updated: string;
  proof: Proof;
  publicKey: PublicKey[];
  service: Service[];
}
