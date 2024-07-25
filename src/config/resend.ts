import EmailTemplate from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<any> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: EmailTemplate({ username, code: verificationCode }),
        });
        return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Failed to send verification email.' };
    }
}