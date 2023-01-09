import { MappingProperty } from '@elastic/elasticsearch/api/types'

export const ServiceMappings: MappingProperty = {
  properties: {
    agreementId: {
      type: 'keyword',
    },
    userId: {
      type: 'keyword',
      index: false,
    },
    index: {
      type: 'integer',
    },
    templateId: {
      type: 'keyword',
      index: false,
    },
    serviceEndpoint: {
      type: 'text',
    },
    type: {
      type: 'text',
    },
    attribute: {
      type: 'object',
    },
  },
}
