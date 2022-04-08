export interface Request {
  hostname: string;
  client: { localPort: number };
  protocol: string;
  url: string;
}
