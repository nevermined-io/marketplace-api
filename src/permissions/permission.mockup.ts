import { faker } from '@faker-js/faker'
import { Permission } from './permission.entity'
import { PermissionType } from '../common/type'

export const permission = new Permission()
permission.userId = `${faker.string.uuid()}`
permission.issuer = '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12'
permission.holder = '0x37BB53e3d293494DE59fBe1FF78500423dcFd43B'
permission.issuanceDate = faker.date.recent()
permission.type = [PermissionType.Read, PermissionType.Update, PermissionType.Delete]

export const newPermission = { ...permission, type: [PermissionType.Admin] }
