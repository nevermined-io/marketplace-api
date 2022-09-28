import { Authentication, NvmConfig, Proof, PublicKey, Service } from './asset.interface';

export class Asset {
  id: string;
  ['@context']: string;
  _nvm: NvmConfig;
  authentication: Authentication[];
  created: string;
  updated: string;
  proof: Proof;
  publicKey: PublicKey[];
  service: Service[];
}
