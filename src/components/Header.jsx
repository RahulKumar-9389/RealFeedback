'use client'
import { useRouter } from "next/navigation";
import { MessageCircleHeart, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';



const Header = () => {

    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();

    return <>
        <header className="container header flex items-center justify-between">
            <div
                className="logo_container cursor-pointer className='header container flex gap-1 items-center"
                onClick={() => router.push("/")}
            >
                <MessageCircleHeart className="logo" />
                <p className="text-white text-2xl">RealFeedback</p>
            </div>

            {
                session ?
                    <>
                        <Button className="rounded-xl" onClick={() => signOut()}>
                            LOGOUT
                            <MoveRight className="ml-2 h-5 w-5" />
                        </Button>
                    </>
                    :
                    <>
                        <Button className="rounded-xl" onClick={() => router.push("/login")}>
                            LOGIN
                            <MoveRight className="ml-2 h-5 w-5" />
                        </Button>
                    </>
            }

        </header>
    </>
};


export default Header;