import { MappingProperty } from '@elastic/elasticsearch/api/types';

export const AssetMappings: MappingProperty = {
  properties: {
    '@context': {
      type: 'text',
    },
    userId: {
      type: 'keyword',
      index: false,
    },
    created: {
      type: 'date',
    },
    updated: {
      type: 'date',
    },
    id: {
      type: 'keyword',
    },
    proof: {
      type: 'object',
    },
  },
};
