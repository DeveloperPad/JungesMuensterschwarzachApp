import * as PHPPassword from 'node-php-password';
import * as UUID from 'uuid/v1';

export class CryptoService {

    private static PASSWORD_LENGTH_MIN = 4;
    

    // Password Hash Stuff

    public static passwordHash(passwordPlain: string): string {
        return PHPPassword.hash(passwordPlain, "PASSWORD_DEFAULT");
    }

    public static passwordVerify(passwordPlain: string, passwordHash: string): boolean {
        return PHPPassword.verify(passwordPlain, passwordHash);
    }

    public static validatePassword(passwordPlain: string): boolean {
        return passwordPlain && CryptoService.PASSWORD_LENGTH_MIN <= passwordPlain.length;
    }

    public static validatePasswordHash(passwordHash: string): boolean {
        return !PHPPassword.needsRehash(passwordHash, "PASSWORD_DEFAULT");
    }


    // Session Hash Stuff

    public static generateUUID(): string {
        return UUID();
    }

    public static validateUUID(uuid: string): boolean {
        return /([a-f]|[0-9]){8}-([a-f]|[0-9]){4}-([a-f]|[0-9]){4}-([a-f]|[0-9]){4}-([a-f]|[0-9]){12}/g.test(uuid);
    }

}