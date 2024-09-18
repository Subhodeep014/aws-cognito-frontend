import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast'
import { addEmail, deleteEmail } from '../../redux/user/verifySlice';
import { signInSuccess } from '../../redux/user/userSlice';
import { Loader2 } from "lucide-react"
export default function Signin() {
    const {email} = useSelector(state=>state.email);
    const[showVerify, setShowVerify] = useState(false)
    const[errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [formData, setFormData] = useState({
        email : "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();
    // const {loading, error: errorMessage} = useSelector(state => state.user)
    
    const navigate = useNavigate();
    const handleChange = (e)=>{
        setFormData({...formData, [e.target.id]: e.target.value.trim()})
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        if(!formData.email){
            const showToast = () => {
                toast({
                  title: "Please enter a email first!",
                  variant: "destructive",
                  duration : 2500,
                  
                })
            }
            showToast()
            setLoading(false);
            return ;
        }
        dispatch(addEmail(formData?.email));
        try {
            const res = await fetch("/api/user/signin", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(formData)
            })
            const data = await res.json()
            if(res.ok){
                const showToast = () => {
                    toast({
                      title: `Signin Success!`,
                      description : `Welcome ${data?.name}!`,
                      variant: "success",
                      duration : 2000,
                    })
                }
                showToast();
                dispatch(signInSuccess(data))
                dispatch(deleteEmail());
                navigate("/")
            }else{
                setLoading(false);
                const errorMsg = data?.message;
                setErrorMessage(errorMsg)
                setShowVerify(true);
                const showToast = () => {
                    toast({
                      title: `${errorMsg}`,
                      variant: "destructive",
                      duration : 2000,
                    })
                }
                showToast();
                
                if(errorMessage==='Please verify you email before signin'){
                    try {
                        const res = await fetch('/api/user/resend-otp', {
                            method : "POST",
                            headers : {
                                "Content-Type" : "application/json"
                            },
                            body : JSON.stringify({email:formData?.email})
                        })
    
                        const data = await res.json();
                        if(res.ok){
                            const showToast = () => {
                                toast({
                                  title: `${data?.message}`,
                                  duration : 2000,
                                })
                            }
                            showToast();
                        }  
                        navigate("/verify")                      
                    } catch (error) {
                        setLoading(false);
                        console.error(error)
                    }



                }
    
            }            
        } catch (error) {
            setLoading(false)
            setShowVerify(true);
            console.error(error);
        }



    }
    return (
        <div className="w-full lg:grid lg:grid-cols-2 h-3/4">
            <div className="flex justify-center items-center py-12"> 
                <div className="mx-auto grid w-[350px] md:w-[400px] gap-4"> 
                    <div className="text-center space-y-3 mb-5"> 
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                      </div>
                    <div className="grid gap-4"> 
                        <form onSubmit={handleSubmit}>
                        <div className="grid gap-2">

                            <Label  htmlFor="email">Email</Label>
                            <Input
                                ref={emailRef}
                                id="email"
                                onChange ={handleChange}
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                            </div>
                            <div className="grid gap-2 mt-2"> 
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" ref={passwordRef} onChange ={handleChange} type="password" placeholder='********' required />
                            </div>
                            <Button type="submit" disabled = {loading} className={`w-full mt-4 mb-2 ${loading? "opacity-40" : ""}`}>
                                {loading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Login
                            </Button>
                            {/* <Button type="button" className="w-full bg-teal-400">
                            Login with Google
                            </Button> */}
                        </form>

                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className ="underline">
                            Sign up
                        </Link>
                        {showVerify && (
                            <div className="mt-4 text-center text-sm">
                                <Link to='/verify' className="underline">Verify Email</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="hidden lg:block h-screen bg-muted">
                <img
                    src="https://images.pexels.com/photos/3299/postit-scrabble-to-do.jpg?auto=compress&cs=tinysrgb&w=1280&h=854&dpr=1"
                    alt="Image"
                    className="h-screen w-full object-cover"
                />
            </div>
        </div>
    );
}