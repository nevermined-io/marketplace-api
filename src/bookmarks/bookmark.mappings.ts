import { MappingProperty } from '@elastic/elasticsearch/api/types'

export const BookmarkMappings: MappingProperty = {
  properties: {
    id: {
      type: 'keyword',
    },
    did: {
      type: 'keyword',
      index: false,
    },
    userId: {
      type: 'keyword',
    },
    description: {
      type: 'text',
      fields: {
        keywords: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    createdAt: {
      type: 'date',
    },
  },
}
