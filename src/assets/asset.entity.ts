import { AuthenticationDto } from './dto/authentication.dto';
import { ProofDto } from './dto/proof.dto';
import { PublicKeyDto } from './dto/publicKey.dto';
import { AuthorizationDto } from './dto/authorization.dto';
import { AccessDto } from './dto/access.dto';
import { MetamadataDto } from './dto/metadata.dto';
import {v4 as uuidv4} from 'uuid';

export class Asset {
    id: string;
    context: string;
    authentication: AuthenticationDto[];
    created: Date;
    proof: ProofDto;
    publicKey: PublicKeyDto[];
    service: (AuthorizationDto | AccessDto | MetamadataDto)[];

    constructor() {
        this.created = new Date();
        this.id = `as-${uuidv4()}`;
    }
}