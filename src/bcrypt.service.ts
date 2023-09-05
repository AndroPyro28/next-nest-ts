import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    private saltOrRounds = 10;

    async bcryptHash (password: string) {
        const hash = await bcrypt.hash(password, this.saltOrRounds);
        return hash
    }
}