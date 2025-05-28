'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PhoneInput } from '@/components/ui/phone-input'
import Link from 'next/link'

// Schema for phone number validation
const formSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' }),
})

export default function ForgetPhone() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      toast.success('OTP sent to your phone number. Please check your messages.')
    } catch (error) {
      console.error('Error sending OTP', error)
      toast.error('Failed to send OTP. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[60vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your phone number to receive an OTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="phone">Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          id="phone"
                          placeholder="+234 812 345 6789"
                          defaultCountry="NG"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Send Code
                </Button>

                <Link href="/auth/forgot">
                  <Button
                    type="button"
                    className="w-full flex items-center justify-center gap-2"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path strokeDasharray="64" strokeDashoffset="64" d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z">
                      <animate attributeName="stroke-dashoffset" dur="0.6s" values="64;0" fill="freeze" />
                    </path>
                    <path strokeDasharray="24" strokeDashoffset="24" d="M3 6.5l9 5.5l9 -5.5">
                      <animate attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="24;0" fill="freeze" />
                    </path>
                  </g>
                </svg>
                Use Email Instead
              </Button>
</Link>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
