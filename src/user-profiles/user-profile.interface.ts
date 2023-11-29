export interface AdditionalInformation {
  profilePicture: string
  linkedinProfile: string
}

export interface Stripe {
  accountId: string
  isAccountValidated: boolean
  accountCreatedAt: string
  accountUpdatedAt: string
  additionalInformation: unknown
}
