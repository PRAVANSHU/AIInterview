"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import FormField from "@/components/FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import {signIn,signUp} from "@/lib/actions/auth.action"

type FormType = "sign-in" | "sign-up"

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  })

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
  const formSchema = authFormSchema(type)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit =async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const {name,email,password}=values;

        const userCredentials=await createUserWithEmailAndPassword(auth,email,password);

        const result=await signUp({
          uid:userCredentials.user.uid,
          name:name!,
          email,
          password,
        })
         
        if(!result?.success){
          toast.error(result.message);
          return;
        }

        toast.success('Account created successfully.Please sign in.');
        router.push('/sign-in')
      } else {

        const {email,password}=values;

        const userCredentials=await signInWithEmailAndPassword(auth,email,password);
        const idToken=await userCredentials.user.getIdToken();

        if(!idToken){
          toast.error('Sign in failed')
          return;
        }

        await signIn({
          email,idToken
        })
        toast.success('Sign in successfully.')
        router.push('/');
      }
    } catch (error) {
      console.error(error)
      toast.error(`There was an error: ${error}`)
    }
  }

  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[556px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">AIInterview</h2>
        </div>

        <h3 className="text-primary-100">Practice Job Interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
