import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

const stripe: MappingProperty = {
  properties: {
    accountId: {
      type: 'keyword',
    },
    isAccountValidated: {
      type: 'boolean',
    },
    accountCreatedAt: {
      type: 'date',
    },
    accountUpdatedAt: {
      type: 'date',
    },
    additionalInformation: {
      type: 'object',
    },
  },
}

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
    isPublisherEnabled: {
      type: 'boolean',
    },
    paymentMethodsAccepted: {
      type: 'keyword',
    },
    stripe,
  },
}
