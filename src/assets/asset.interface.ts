export interface Access {
  index: number;
  purchaseEndpoint: string;
  serviceEndpoint: string;
  type: string;
}

export class Curation {
  numVotes: number;
  rating: number;
  schema: string;
}

export interface File {
  compression: string;
  contentLength: string;
  contentType: string;
  encoding: string;
  index: number;
  resourceId: string;
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
}

export interface Attributes {
  additionalInformation: AditionalInformation;
  curation: Curation;
  main: Main;
}

export interface Authentication {
  publicKey: string;
  type: string;
}

export interface Authorization {
  index: number;
  service: string;
  serviceEndpoint: string;
  type: string;
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
}

export interface Metadata {
  attributes: Attributes;
  index: number;
  serviceEndpoint: string;
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
