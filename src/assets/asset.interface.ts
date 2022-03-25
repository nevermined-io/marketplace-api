export class Handler {
  functionName: string;
  moduleName: string;
  version: string;
}

export interface Parameter {
  name: string;
  type: string;
  value: unknown;
}

export interface Event {
  actionType: string;
  handler: Handler;
  name: string;
}

export interface Condition {
  contractName: string;
  functionName: string;
  name: string;
  events: Event[];
  parameters: Parameter[];
  timelock: number;
  timeout: number;
}

export interface ConditionDependency {
  access: string[];
  escrowPayment: string[];
  execCompute: string[];
  lockPayment: string[];
}

export interface ServiceAgreementTemplate {
  conditionDependency: ConditionDependency;
  conditions: Condition[];
  contractName: number;
  events: Event[];
  fulfillmentOrder: string;
}

export interface Container {
  entrypoint: string;
  image: string;
  tag: string;
}

export interface Algorithm {
  language: string;
  format: string;
  version: string;
  container: Container;
}

export interface Curation {
  numVotes: number;
  rating: number;
  schema: string;
  isListed: boolean;
}

export interface File {
  checksum: string;
  url: string;
  checksumType: string;
  name: string;
  compression: string;
  contentLength: string;
  contentType: string;
  encoding: string;
  index: number;
  resourceId: string;
  encrypted: boolean;
  encryptionMode: string;
}

export interface Link {
  name: string;
  type: string;
  url: string;
}

export interface AditionalInformation {
  copyrightHolder: string;
  description: string;
  inLanguage: string;
  links: Link[];
  tags: string[];
  workExample: string;
  categories: string[];
}

export interface Main {
  author: string;
  dateCreated: string;
  encryptedFiles: string;
  files: File[];
  license: number;
  name: string;
  price: string;
  type: string;
  algorithm: Algorithm;
}

export interface Attributes {
  additionalInformation: AditionalInformation;
  curation: Curation;
  main: Main;
  serviceAgreementTemplate: ServiceAgreementTemplate;
}

export interface Authentication {
  publicKey: string;
  type: string;
}

export interface Main {
  author: string;
  dateCreated: string;
  datePublished: string;
  encryptedFiles: string;
  files: File[];
  license: number;
  name: string;
  price: string;
  type: string;
}

export interface Proof {
  created: string;
  creator: string;
  signatureValue: string;
  type: string;
}

export interface PublicKey {
  id: string;
  owner: string;
  type: string;
}

export interface Service {
  index: number;
  attributes: Attributes;
  service: string;
  purchaseEndpoint: string;
  serviceEndpoint: string;
  type: string;
}
