import { State } from '../common/type'
import { AdditionalInformation } from './user-profile.interface'
import { v4 as uuidv4 } from 'uuid'

export class UserProfile {
  userId: string
  isListed: boolean
  state: State
  addresses: string[]
  nickname: string
  name: string
  email: string
  creationDate: Date
  updateDate: Date
  additionalInformation: AdditionalInformation

  constructor() {
    this.creationDate = new Date()
    this.updateDate = new Date()
    this.userId = `us-${uuidv4()}`
  }
}
