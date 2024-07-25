"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { LogIn, Loader2, House, MoveLeft } from 'lucide-react';
import Meteors from "@/components/magicui/meteors";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { loginSchema } from '@/schemas/loginSchema';
import toast from 'react-hot-toast';
import { useState } from 'react';
import AnimatedShinyText from '@/components/magicui/animated-shiny-text';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const Login = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        setLoading(true)
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            setLoading(false)
            if (result.error === 'CredentialsSignin') {
                toast.error("Login Failed!")
            } else {
                toast.error(result?.error)
            }
        }

        if (result?.url) {
            toast.success("Login successfully!")
            setLoading(false)
            router.replace('/dashboard');
        }
    };


    return <>
        <div className='flex items-center justify-center h-[100vh] overflow-hidden relative'>
            <Link className='absolute top-20 left-20 flex items-center gap-1 bg-slate-100 text-black rounded-full px-2 py-2' href={'/'}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <MoveLeft />

                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Back to home</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </Link>

            <Meteors number={50} />
            <div className="border-sm border-2 border-inherit px-10 py-5 rounded">
                <AnimatedShinyText className="font-semibold w-full text-3xl inline-flex items-center justify-center transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span>Welcome Back!</span>
                </AnimatedShinyText>
                <p className="text-center text-gray-300 tracking-wide mb-5">Fill in the form below to create account!</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            loading ?
                                <Button disabled className="w-full">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>

                                : <Button className="w-full">
                                    LOGIN
                                    <LogIn className="ml-2 h-4 w-4" />
                                </Button>

                        }
                    </form>
                    <div className='mt-3'>
                        <p className="text-center">Don't have any account? <span className='text-[#FF204E] underline'> <Link href={`/register`}>register</Link></span></p>
                    </div>
                </Form>
            </div>
        </div>
    </>
};

export default Login;