import { MappingProperty } from '@elastic/elasticsearch/api/types';

const context = {
  type: 'text',
  fields: {
    keyword: {
      type: 'keyword',
      ignore_above: 256,
    },
  },
} as MappingProperty;

const authentication = {
  properties: {
    publicKey: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    type: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
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
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    signatureValue: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    type: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
  },
} as MappingProperty;

const publicKey = {
  properties: {
    id: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    owner: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    publicKeyBase58: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    publicKeyPem: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    type: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
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
    },
    license: {
      type: 'text',
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
    },
    copyrightHolder: {
      type: 'text',
    },
    workExample: {
      type: 'text',
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
  },
};
