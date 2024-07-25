"use client"

import { registerSchema } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { Button } from "@/components/ui/button"
import { LogIn, Loader2, MoveLeft } from 'lucide-react';
import Meteors from "@/components/magicui/meteors";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const Register = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    // Submit user details
    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        try {
            setLoading(true)
            const response = await fetch("/api/register", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password
                })

            })
            const data = await response.json();
            if (data?.success) {
                toast.success(data?.message)
                router.replace(`/verify/${data?.id}`)
            }
            else {
                toast.error(data?.message)
            }
        } catch (error) {
            toast.error("Registration Failed!")
        }
        finally {
            setLoading(false)
        }
    }

    return <>
        <div className="flex items-center justify-center h-screen w-full relative overflow-hidden">
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
                    <span>Create an Account</span>
                </AnimatedShinyText>
                <p className="text-center text-gray-300 tracking-wide mb-5">Fill in the form below to create account!</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} className="w-80" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" {...field} />
                                    </FormControl>
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
                                    REGISTER
                                    <LogIn className="ml-2 h-4 w-4" />
                                </Button>

                        }

                    </form>
                    <div className='mt-3'>
                        <p className="text-center">Already have an account. <span className='text-[#FF204E] underline'> <Link href={`/login`}>login</Link></span></p>
                    </div>
                </Form>
            </div>
        </div>
    </>
};

export default Register;