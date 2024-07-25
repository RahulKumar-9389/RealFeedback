import { connectDB } from "@/config/db";
import Users, { Message } from "@/models/userModel";


export async function POST(request: Request) {
    await connectDB();
    const { id, content } = await request.json();


    try {
        const user = await Users.findById(id);

        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    message: 'User is not accepting messages',
                    success: false
                },
                { status: 403 }
            );
        }

        const newMessage = { content, createdAt: new Date() };

        // Push the new message to the user's messages array
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}