import { MappingProperty } from '@elastic/elasticsearch/api/types';

export const UserProfileMappings: MappingProperty = {
  properties: {
    userId: {
      type: 'keyword',
    },
    isListed: {
      type: 'boolean',
    },
    state: {
      type: 'text',
    },
    nickname: {
      type: 'keyword',
      index: false,
    },
    name: {
      type: 'text',
    },
    email: {
      type: 'keyword',
      index: false,
    },
    creationDate: {
      type: 'date',
    },
    updateDate: {
      type: 'date',
    },
  },
};
