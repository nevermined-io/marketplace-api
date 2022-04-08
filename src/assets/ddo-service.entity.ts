import { Attributes } from './asset.interface';

export class Service {
  agreementId: string;
  type: string;
  index: number;
  serviceEndpoint: string;
  templateId: string;
  attributes: Attributes;
}
