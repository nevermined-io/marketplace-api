import { Account } from "@nevermined-io/nevermined-sdk-js";
import HDWalletProvider from "@truffle/hdwallet-provider";
import {
    decodeJwt,
    decodeProtectedHeader,
    JWSHeaderParameters,
    JWTPayload,
    ProtectedHeaderParameters,
    SignJWT
} from "jose";
import Web3 from "web3";

export class EthSignJWT extends SignJWT {
    protectedHeader: JWSHeaderParameters;

    setProtectedHeader(protectedHeader: JWSHeaderParameters) {
        this.protectedHeader = protectedHeader;
        return this;
    }

    public async ethSign(
        account: Account,
        web3: Web3
    ): Promise<string> {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const encodedPayload = encoder.encode(
            this.base64url(JSON.stringify(this._payload))
        );
        const encodedHeader = encoder.encode(
            this.base64url(JSON.stringify(this.protectedHeader))
        );
        const data = this.concat(encodedHeader, encoder.encode('.'), encodedPayload);

        const sign = await web3.eth.personal.sign(decoder.decode(data), account.getId(), undefined);

        const signed = this.base64url(
            Uint8Array.from(web3.utils.hexToBytes(sign))
        );
        const grantToken = `${decoder.decode(encodedHeader)}.${decoder.decode(
            encodedPayload
        )}.${signed}`;

        return grantToken;
    }

    private base64url(input: Uint8Array | string): string {
        return Buffer.from(input)
            .toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    private concat(...buffers: Uint8Array[]): Uint8Array {
        const size = buffers.reduce((acc, { length }) => acc + length, 0);
        const buf = new Uint8Array(size);
        let i = 0;
        buffers.forEach(buffer => {
            buf.set(buffer, i);
            i += buffer.length;
        });
        return buf;
    }
}

export const concat = (...buffers: Uint8Array[]): Uint8Array => {
    const size = buffers.reduce((acc, { length }) => acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    buffers.forEach(buffer => {
        buf.set(buffer, i);
        i += buffer.length;
    });
    return buf;
};

export const recoverPublicKey = async (protectedHeader: string, payload: string, signature: string) => {
    const signatureInput = `${protectedHeader}.${payload}`;
    const signatureDecoded = `0x${Buffer.from(signature, 'base64').toString('hex')}`;

    const seedphrase = 'taxi music thumb unique chat sand crew more leg another off lamp';
    const provider = new HDWalletProvider(seedphrase, 'http://localhost:8545', 0, 10);
    const web3 = new Web3(provider);

    const address = await web3.eth.personal.ecRecover(signatureInput, signatureDecoded);
    return web3.utils.toChecksumAddress(address);
};

export const jwtEthVerify = async (
    jwt: string,
) => {
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jwt.split('.');

    if (length !== 3) {
        throw new Error('Invalid Compact JWS');
    }

    // decode and validate protected header
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let parsedProtectedHeader: ProtectedHeaderParameters;
    try {
        parsedProtectedHeader = decodeProtectedHeader(jwt);
    } catch (error) {
        throw new Error(`ProtectedHeader: Failed to decode header (${(error as Error).message})`);
    }
    if (parsedProtectedHeader.alg !== 'ES256K') {
        throw new Error('ProtectedHeader: Invalid algorithm');
    }

    // recover public key from signature
    // This is the de-facto signature validation
    let publicKey: string;
    try {
        publicKey = await recoverPublicKey(protectedHeader, payload, signature);
    } catch (error) {
        throw new Error(`Signature: Failed to validate signature (${(error as Error).message})`);
    }

    // verify the payload
    let parsedPayload: JWTPayload;
    try {
        parsedPayload = decodeJwt(jwt);
    } catch (error) {
        throw new Error(`Payload: Failed to decode payload (${(error as Error).message})`);
    }
    if (!parsedPayload.iss) {
        throw new Error('Payload: `iss` field is required');
    }
    let isValidAddress: boolean;
    try {
        isValidAddress = Web3.utils.checkAddressChecksum(parsedPayload.iss);
    } catch (error) {
        throw new Error(`Payload: 'iss' field must be a valid checksum ethereum address (${(error as Error).message})`);
    }
    if (!isValidAddress) {
        throw new Error('Payload: `iss` field must be a valid checksum ethereum address');
    }
    if (parsedPayload.iss !== publicKey) {
        throw new Error('Payload: `iss` is not the signer of the payload');
    }

    return parsedPayload;
};