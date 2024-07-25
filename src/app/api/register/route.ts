import { connectDB } from '@/config/db';
import { sendVerificationEmail } from '@/config/resend';
import { getHashedPassword } from '@/helpers/Bcrypt';
import Users from '@/models/userModel';

export async function POST(request: Request) {
    await connectDB();

    try {
        const { username, email, password } = await request.json();
        let id;

        //validation
        if (!username || !email || !password) {
            return Response.json({
                success: false,
                message: "Please fill the all required fields!"
            },
                {
                    status: 404
                }
            )
        }


        // chek: is user already exist? 
        const existUser = await Users.findOne({ email });

        // Genrate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existUser) {
            if (existUser.isVerified) {
                return Response.json({
                    success: false,
                    message: "You already registerd with this email please login."
                },
                    {
                        status: 200
                    })
            }
            else {
                // if user exist but this is not verified then update this verified status 
                const hashedPassword = await getHashedPassword(password);
                existUser.password = hashedPassword;
                existUser.verifyCode = verificationCode;
                existUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existUser.save();
                id = existUser._id;
            }
        }
        else {
            // if user not exist and this is not verified then create a new user and save it to database
            const hashedPassword = await getHashedPassword(password);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            // save user details
            const user = new Users({
                username,
                email,
                password: hashedPassword,
                verifyCode: verificationCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })

            await user.save();
            id = user._id;
        }

        // send verification email
        const response = await sendVerificationEmail(email, username, verificationCode);
        if (!response.success) {
            return Response.json({
                success: false,
                message: 'Failed to send verification email',
            },
                {
                    status: 400
                })
        }


        // send response
        return Response.json({
            success: true,
            message: "Your account has been successfully created, Please verify your account!",
            id
        },
            {
                status: 201
            })



    } catch (error) {
        console.log(`Error while user register : ${error}`);
        return Response.json({
            success: false,
            message: "Internal server error while user regsiter",
            error
        },
            {
                status: 500
            }
        )
    }
}