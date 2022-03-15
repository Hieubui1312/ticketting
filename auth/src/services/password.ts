import {scrypt, randomBytes} from "crypto";
import {promisify} from "util";

const scriptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString("hex");
        const buf = (await  scriptAsync(password, salt, 65)) as Buffer;
        return `${buf.toString("hex")}.${salt}`
    }

    static async comparePassword(storedPassword: string, suppliedPassword: string) {
        const [hashPassword, salt] = storedPassword.split(".")
        const buf = (await  scriptAsync(suppliedPassword, salt, 65)) as Buffer;

        return buf.toString("hex") === hashPassword;
    }
}
