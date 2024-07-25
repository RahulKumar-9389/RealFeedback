import { connectDB } from "@/config/db";
import Users from "@/models/userModel";

export async function POST(req: Request) {
    await connectDB();
    try {


        const { id, code } = await req.json();

        if (!id) {
            return Response.json({
                success: false,
                message: "User ID not found!"
            },
                {
                    status: 404
                })
        }
        const user = await Users.findById(id);
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found!"
            },
                {
                    status: 401
                })
        }

        // chek code is correact or not
        const savedCode = user.verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (savedCode === code && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully!"
            },
                {
                    status: 200
                })
        }
        if (savedCode !== code) {
            return Response.json({
                success: false,
                message: "Invalid verification code!"
            },
                {
                    status: 400
                })
        }

        if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, Please register again to get code!"
            },
                {
                    status: 200
                })
        }


    } catch (error) {
        console.log(`Account verifation has failed due to ${error}`);
        return Response.json({
            success: false,
            message: "Account verifation has failed due to internal server error!",
            error
        },
            {
                status: 500
            })

    }
}