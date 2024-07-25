import bcrypt, { genSalt } from 'bcrypt';

export async function getHashedPassword(password: string) {
    const saltRounds = await bcrypt.genSalt(10);
    return bcrypt.hash(password, saltRounds);
};


export async function comparePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword)
}