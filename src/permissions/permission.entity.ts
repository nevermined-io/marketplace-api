import { PermissionType } from '../common/type'
import { v4 as uuidv4 } from 'uuid'

export class Permission {
  id: string
  userId: string
  type: PermissionType[]
  issuer: string
  holder: string
  issuanceDate: Date

  constructor() {
    this.id = `pe-${uuidv4()}`
    this.issuanceDate = new Date()
  }
}
