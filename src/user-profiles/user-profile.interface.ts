import { PaymentMethodsAccepted } from '../common/type'

export interface AdditionalInformation {
  profilePicture: string
  linkedinProfile: string
  isPublisherEnabled: boolean
  paymentMethodsAccepted: PaymentMethodsAccepted
  stripe: Stripe
}

export interface Stripe {
  accountId: string
  isAccountValidated: boolean
  accountCreatedAt: string
  accountUpdatedAt: string
  additionalInformation: unknown
}
