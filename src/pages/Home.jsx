import React from 'react';
import { Button } from '../components/ui/button';
import { useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from 'react-router-dom';

export default function Home() {
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const handleClick = ()=>{
    console.log("hello")
  }

  return (
    <div className='px-4 md:px-16 py-10'>
      <div className="dark:text-white bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4 flex-nowrap md:flex-row">
        <div className="flex-1 w-4/6 md:w-auto">
          <div className="">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl">
              <span className="leading-normal bg-black dark:bg-white rounded-lg text-white dark:text-black font-semibold p-1">
                StackTask
              </span>
              <span className="font-semibold"> Manage Tasks Effortlessly</span>
            </h1>
          </div>
          <div className="w-full lg:w-[500px] md:w-[300px] mt-5 mb-5">
            <span className="text-sm md:text-lg font-montserrat">
            Efficiently manage your tasks and boost your productivity. 
            Our to-do list app helps you stay organized and focused, every step of the way.
            </span>
          </div>
          <div className="">
          <Button className="bg-green-800 dark:bg-green-800 text-white dark:text-white dark:hover:bg-teal-900">
            <Link to={currentUser ? '/todo' : '/signin'}>
                {currentUser ? 'Get Started' : 'Sign in to get started'}
            </Link>
        </Button>
          </div>
        </div>

        <div className=" rounded-3xl overflow-hidden flex-1 mt-4 md:mt-0">
          <div className="">
            <img
              className="w-full h-[380px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover"
              src="https://img.freepik.com/free-vector/project-management-goal-completion-list-questionnaire-survey-answering-business-organization-tool_335657-3289.jpg?t=st=1720526423~exp=1720530023~hmac=7dd34f814149b7866dbdba2e377abdc042ea7d902daf084e4e4a19159db3d564&w=740"
              alt=""/>
          </div>
        </div>
      </div>
    </div>

  );
}