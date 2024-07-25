import { connectDB } from "@/config/db";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import Users from "@/models/userModel";

export async function POST(req: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },
            {
                status: 401
            })
    }

    const userID = user._id;
    const { acceptMessages } = await req.json();

    try {

        const user = await Users.findByIdAndUpdate(userID,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )

        if (!user) {
            return Response.json({
                success: false,
                message: "No user found!"
            },
                {
                    status: 404
                })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully!"
        },
            {
                status: 200
            })

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error while accept messages",
            error
        },
            {
                status: 500
            })

    }
};


export async function GET(request: Request) {
    // Connect to the database
    await connectDB();

    // Get the user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Check if the user is authenticated
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        // Retrieve the user from the database using the ID
        const foundUser = await Users.findById(user._id);

        if (!foundUser) {
            // User not found
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Return the user's message acceptance status
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error retrieving message acceptance status' },
            { status: 500 }
        );
    }
}