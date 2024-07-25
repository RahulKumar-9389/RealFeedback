"use client"


import { verifyCodeSchema } from "@/schemas/verifyCodeSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Loader2 } from 'lucide-react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const VerifyAccount = () => {

    const params = useParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema),
        defaultValues: {
            code: "",
        },
    });


    const onSubmit = async (values: z.infer<typeof verifyCodeSchema>) => {
        try {
            setLoading(true)
            const response = await fetch('/api/verify', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: params.id,
                    code: values.code
                })
            })

            const data = await response.json();
            if (data?.success) {
                toast.success("Account Verified Successfully!")
                router.push('/login')
            }
            else {
                toast.error(data.message)
            }


        } catch (error) {
            toast.error("Verification Failed!")
        }
        finally {
            setLoading(false)
        }
    }

    return <>
        <div className="flex items-center justify-center min-h-screen">
            <div className="shadow-md border-2 rounded border-inherit px-5 py-5 border-solid">
                <h1 className="text-center font-semibold text-white text-3xl">Verify Your Account</h1>
                <p className="mb-4 text-gray-300">Enter the verification code sent to your email</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
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
                                    VERIFY
                                    <BadgeCheck className="ml-2 h-4 w-4" />
                                </Button>

                        }
                    </form>
                </Form>
            </div>
        </div>
    </>
};


export default VerifyAccount;