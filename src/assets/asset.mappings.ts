import { MappingProperty } from '@elastic/elasticsearch/api/types';

const context = {
  type: 'text',
  copy_to: 'fulltext',
} as MappingProperty;

const authentication = {
  properties: {
    publicKey: {
      type: 'text',
      copy_to: 'fulltext',
    },
    type: {
      type: 'text',
      copy_to: 'fulltext',
    },
  },
} as MappingProperty;

const created = {
  type: 'date',
} as MappingProperty;

const id = {
  type: 'keyword',
} as MappingProperty;

const _nvm = {
  properties: {
    userId: {
      type: 'keyword',
    },
    appId: {
      type: 'keyword',
    },
    versions: {
      properties: {
        id: {
          type: 'integer',
        },
        updated: {
          type: 'date',
        },
        checksum: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
  },
} as MappingProperty;

const proof = {
  properties: {
    created: {
      type: 'date',
    },
    creator: {
      type: 'text',
      copy_to: 'fulltext',
    },
    signatureValue: {
      type: 'text',
      copy_to: 'fulltext',
    },
    type: {
      type: 'text',
      copy_to: 'fulltext',
    },
  },
} as MappingProperty;

const publicKey = {
  properties: {
    id: {
      type: 'text',
      copy_to: 'fulltext',
    },
    owner: {
      type: 'text',
      copy_to: 'fulltext',
    },
    publicKeyBase58: {
      type: 'text',
      copy_to: 'fulltext',
    },
    publicKeyPem: {
      type: 'text',
      copy_to: 'fulltext',
    },
    type: {
      type: 'text',
      copy_to: 'fulltext',
    },
  },
} as MappingProperty;

const verifiableCredential = {
  type: 'object',
} as MappingProperty;

const updated = {
  type: 'date',
} as MappingProperty;

const files = {
  properties: {
    name: {
      type: 'text',
      copy_to: 'fulltext',
    },
    url: {
      type: 'keyword',
    },
    index: {
      type: 'unsigned_long',
    },
    contentType: {
      type: 'keyword',
    },
    checksum: {
      type: 'keyword',
    },
    checksumType: {
      type: 'keyword',
    },
    contentLength: {
      type: 'keyword',
    },
    resourceId: {
      type: 'keyword',
    },
    encoding: {
      type: 'keyword',
    },
    compression: {
      type: 'keyword',
    },
  },
} as MappingProperty;

const main = {
  properties: {
    price: {
      type: 'keyword',
    },
    creator: {
      type: 'keyword',
    },
    name: {
      type: 'text',
      copy_to: 'fulltext',
    },
    datePublished: {
      type: 'date',
    },
    dateCreated: {
      type: 'date',
    },
    timeout: {
      type: 'unsigned_long',
    },
    ercType: {
      type: 'keyword',
    },
    nftType: {
      type: 'keyword',
    },
    type: {
      type: 'keyword',
    },
    author: {
      type: 'text',
      copy_to: 'fulltext',
    },
    license: {
      type: 'text',
      copy_to: 'fulltext',
    },
    files,
    isDTP: {
      type: 'boolean',
    },
  },
} as MappingProperty;

const additionalInformation = {
  properties: {
    priceHighestDenomination: {
      type: 'double',
    },
    description: {
      type: 'text',
      copy_to: 'fulltext',
    },
    copyrightHolder: {
      type: 'text',
      copy_to: 'fulltext',
    },
    workExample: {
      type: 'text',
      copy_to: 'fulltext',
    },
    links: {
      type: 'object',
    },
    inLanguage: {
      type: 'keyword',
    },
    categories: {
      type: 'keyword',
    },
    tags: {
      type: 'keyword',
    },
    updateFrequency: {
      type: 'keyword',
    },
    structuredMarkup: {
      properties: {
        uri: {
          type: 'keyword',
        },
        mediaType: {
          type: 'keyword',
        },
      },
    },
    customData: {
      type: 'object',
    },
    poseidonHash: {
      type: 'keyword',
    },
    providerKey: {
      properties: {
        x: {
          type: 'keyword',
        },
        y: {
          type: 'keyword',
        },
      },
    },
  },
} as MappingProperty;

const service = {
  type: 'nested',
  properties: {
    type: {
      type: 'keyword',
    },
    index: {
      type: 'unsigned_long',
    },
    serviceEndpoint: {
      type: 'keyword',
    },
    templateId: {
      type: 'keyword',
    },
    attributes: {
      properties: {
        main,
        additionalInformation,
        encryptedFiles: {
          type: 'keyword',
        },
        curation: {
          type: 'object',
        },
      },
    },
    service: {
      type: 'keyword',
    },
  },
} as MappingProperty;

export const AssetMappings: MappingProperty = {
  properties: {
    '@context': context,
    authentication,
    created,
    id,
    _nvm,
    proof,
    publicKey,
    verifiableCredential,
    updated,
    service,

    // For full text search
    // properties with type `text` should add `copy_to: 'fulltext'`
    fulltext: {
      type: 'text',
    },
  },
};
