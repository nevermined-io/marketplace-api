import { AuthRoles } from '../type'

export interface AuthUser {
  userId: string;
  address: string;
  roles?: AuthRoles[];
}

export interface Request<G> {
  hostname: string;
  body?: G;
  query?: G;
  params?: G;
  client: { localPort: number };
  protocol: string;
  url: string;
  user?: AuthUser;
}
