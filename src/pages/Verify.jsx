import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { toast } from '@/hooks/use-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export function Verify() {
  const navigate = useNavigate();
  const {email} = useSelector(state=>state.email);
  const [otp, setOtp] = useState("")
  const handleChange = (value) => {
    setOtp(value)
  }

  const handleComplete = (value) => {
    setOtp(value)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (otp.length === 6) {
      console.log('Submitted OTP:', otp)
      try {
        const res = await fetch('/api/user/confirm-signup', {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            email : email,
            confirmationCode : otp
          })
        })
  
        const data = await res.json();

        if(res.ok){
          toast({
            title: `${data?.message}`,
            description: "Your email has been successfully confirmed.",
            variant: "success",
            duration : 2000
          })  
          navigate('/signin');  
        }else{
          toast({
            title: "Invalid Code",
            description: `${data?.message}`,
            variant: "destructive",
            duration : 2000
          })
        }
    
      } catch (error) {
        console.error(error);

      }

    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit confirmation code.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className='flex items-center justify-center h-[500px]'>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Confirm Your Email</CardTitle>
          <CardDescription>Enter the 6-digit code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <InputOTP maxLength={6} value={otp} onChange={handleChange} onComplete={handleComplete}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">Confirm Email</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
