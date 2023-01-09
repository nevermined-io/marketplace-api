import { MappingProperty } from '@elastic/elasticsearch/api/types'

export const StatusMappings: MappingProperty = {
  properties: {
    did: {
      type: 'keyword',
    },
    internal: {
      properties: {
        id: {
          type: 'keyword',
          index: false,
        },
        type: {
          type: 'text',
        },
        status: {
          type: 'text',
        },
        url: {
          type: 'text',
        },
      },
    },
  },
}
