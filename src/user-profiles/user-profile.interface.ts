export interface AdditionalInformation {
  profilePicture: string
  linkedinProfile: string
}

export interface Stripe {
  accountId: string
  isAccountValidated: boolean
  accountCreatedAt: Date
  accountUpdatedAt: Date
  additionalInformation: unknown
}
