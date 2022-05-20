import { MappingProperty } from '@elastic/elasticsearch/api/types';

export const StatusMappings: MappingProperty = {
  properties: {
    did: {
      type: 'keyword',
    },
    internal: {
      type: 'object',
    },
  },
};
