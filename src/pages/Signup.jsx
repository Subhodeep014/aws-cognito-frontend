import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { addEmail, deleteEmail } from '../../redux/user/verifySlice'
import { useDispatch } from 'react-redux'

export default function Signup() {
    const {toast} = useToast();
    const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email : "",
    name : "",
    password : ""
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const[showVerify, setShowVerify] = useState(false)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]:e.target.value})
    // console.log(formData)
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    if(!formData.email || !formData.name || !formData.password || !formData.email==="" || !formData.name==="" || !formData.password==="" ){
      toast({
        title : "Please fill out all feilds",
        duration : 2500,
        variant : "destructive"
      });
      setLoading(false);
      return setErrorMessage('Please fill out all feilds');
    }
    try {
      dispatch(addEmail(formData?.email));
        const res = await fetch('/api/user/signup' , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify(formData)
        })
        const data = await res.json(); // Parse response data
        if(res.ok){
            setFormData({
                name: '',
                email: '',
                password: '',
            });
            const showToast = () => {
                toast({
                  title: "Account created successfully!",
                  variant: "success",
                  duration : 2500,
                  
                })
            }
            // toast.success('Account created successfully!');
            showToast();
            setLoading(false);
            navigate("/verify")
        }
        else{
          setLoading(false)
            const errorMsg = data?.message || 'Something went wrong';
            setErrorMessage(errorMsg);
            const showToast = () => {
                toast({
                  title: `${errorMsg}`,
                  variant: "destructive",
                  duration : 2500,
                })
            }

            showToast();
            setShowVerify(true);
            // toast.error(errorMsg);
            
        }

    } catch (error) {
        // toast.error(errorMessage)
        // showToast();
        setLoading(false)
        setShowVerify(true);
        console.error(error);
    }


  }
    return (
        <Card className="mx-auto max-w-sm md:max-w-md mt-8">
            {/* <Button onClick = {showToast}>Click me </Button> */}
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-4"> 
                  <Label value="Your name">Full Name</Label>
                  <Input id="name" onChange={handleChange} placeholder="John Doe" value={formData.name} required />
                </div>
                <div className="grid gap-2">
                  <Label value="Your email">Email</Label>
                  <Input
                    id="email"
                    onChange={handleChange}
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label value='Your password'>Password</Label>
                  <Input id="password" onChange={handleChange} type="password" value={formData.password} required/>
                </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {
                      loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please Wait
                        </>
                      ) : 'Create an account'
                    }
                  </Button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to='/signin' className="underline">
                Sign in
              </Link>
            </div>
            {showVerify && (
                <div className="mt-4 text-center text-sm">
                    <Link to='/verify' className="underline">Verify Email</Link>
                </div>
            )}

          </CardContent>
        </Card>
    )
}