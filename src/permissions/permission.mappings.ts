import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

export const PermissionMappings: MappingProperty = {
  properties: {
    id: {
      type: 'keyword',
    },
    userId: {
      type: 'keyword',
    },
    issuer: {
      type: 'text',
    },
    holder: {
      type: 'text',
    },
    issuanceDate: {
      type: 'date',
    },
  },
}
