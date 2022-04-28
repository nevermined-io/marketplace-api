import { Attributes } from './asset.interface';

export class Service {
  agreementId: string;
  userId: string;
  type: string;
  index: number;
  serviceEndpoint: string;
  templateId: string;
  attributes: Attributes;
}
