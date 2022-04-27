interface AuthUser {
  userId: string;
  address: string;
}

export interface Request {
  hostname: string;
  client: { localPort: number };
  protocol: string;
  url: string;
  user?: AuthUser;
}
