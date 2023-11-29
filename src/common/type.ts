export enum MarketplaceIndex {
  Bookmark = 'bookmark',
  Asset = 'asset',
  DDOStatus = 'status',
  Service = 'service',
  UserProfile = 'user_profile',
  Permission = 'permission',
}

export enum Status {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
}

export enum SourceType {
  Elasticsearch = 'Elasticsearch',
}

export enum State {
  Disabled = 'disabled',
  Unconfirmed = 'unconfirmed',
  Confirmed = 'confirmed',
}

export enum AuthRoles {
  Admin = 'admin',
}

export enum PermissionType {
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Admin = 'admin',
}

export enum PaymentMethodsAccepted {
  Crypro = 'crypto',
  Fiat = 'fiat',
  All = 'all',
  NotSelected = 'notSelected',
}
