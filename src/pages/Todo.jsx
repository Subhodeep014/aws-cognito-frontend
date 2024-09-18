import React, { useEffect, useRef, useState } from 'react'

import {
    ListFilter,
    Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import TableRowTodo from '@/components/TableRowTodo'
import { useDispatch, useSelector } from 'react-redux'
// import { toast } from 'react-toastify'
import { useToast } from '@/hooks/use-toast'
import { signoutSuccess } from '../../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
export default function Todo() {
  const {toast} = useToast()
  const dispatch = useDispatch()
    const todoRef = useRef();
    const {currentUser} = useSelector((state)=> state.user)
    const [userTodo, setUserTodo] = useState([]);
    const [todo, setTodo] = useState({todo:""});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOrderAsc, setFilterOrderAsc] = useState(true)
    const navigate = useNavigate()
    
    const fetchTodos = async()=>{
        let startIndex = 0;
      try {
        const res = await fetch(`/api/todo/get/${currentUser?.userId}`,{
          method : "GET",
          headers: { 
            'Content-Type': 'application/json' 
          }
        })
        
        const data = await res.json();
        if(data?.message==='Unauthorized, no access token'){
          dispatch(signoutSuccess());
          toast({
            title : "Signed out!",
            duration  : 2000
          })
          navigate("/signin")
          return;
        }
        // console.log(data)
        if(res.ok){
          setUserTodo(data?.todos)
          startIndex=userTodo?.length
          console.log(userTodo)
          if(data?.length>=9){
            setShowMore(true)
          }
        }

        
    } catch (error) {
        console.log(error.message)
      }
    }
    useEffect(()=>{
        fetchTodos();
        console.log(userTodo)
        
    },[currentUser._id])
    const handleShowMore = async()=>{

    }

    const handleChange = async(e)=>{
        setTodo({[e.target.id]: e.target.value})

    }
    const handleClick = async()=>{
        if (todoRef.current) todoRef.current.value = '';
        todoRef.current.focus()

        try {
            const res = await fetch(`/api/todo/add/${currentUser?.userId}`,{
              method:"POST",  
              headers: { 
                'Content-Type': 'application/json' 
              },
              body : JSON.stringify(todo)
            })
            const data = await res.json();
            console.log(data?.todo);
            if(res.ok){
              toast({
                title : "Todo added successfully!",
                variant : "success",
                duration : 2000,
              })
              setUserTodo([...userTodo, data?.todo]);
              if(userTodo.length>=9){
                setShowMore(true);
              }
            }
            console.log(data)
        } catch (error) {
            toast({
              title : "Something went wrong",
              duration : 2000,
            })
            console.error(error);
        }
    }

  const searchAsc = () => {
    setFilterOrderAsc(true);
    const sortedTodos = [...userTodo].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setUserTodo(sortedTodos);
  };

  const searchDesc = () => {
    setFilterOrderAsc(false);
    const sortedTodos = [...userTodo].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setUserTodo(sortedTodos);
  };
  
  return (
    <div>
        <main className="gap-4 p-4 ">
            <div className="flex items-center mt-5 gap-2">
                {/* <Search className="left-96 h-4 w-4 text-muted-foreground" /> */}
                <Input
                id='todo'
                onChange = {handleChange}
                ref={todoRef}
                type="text"
                placeholder="Add your task..."
                className="w-full rounded-lg bg-background pl-8 md:w-[336px] dark:placeholder:text-black dark:text-black"
                />
                <Button onClick = {handleClick}>Add</Button>
            </div>
          <Tabs defaultValue="all">
            <div className="flex items-center mt-5">
              <TabsList>
                <TabsTrigger onClick = {fetchTodos} value="all">All</TabsTrigger>
                <TabsTrigger onClick = {fetchTodos} value="active">Active</TabsTrigger>
                <TabsTrigger onClick = {fetchTodos} value="completed">Completed</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button  variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem onClick = {searchDesc} checked={!filterOrderAsc}>
                      Newest first
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem onClick = {searchAsc} checked={filterOrderAsc}>Oldest first</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Manage your tasks and view their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader className="bg-slate-200 dark:bg-sky-950">
                      <TableRow className = "p-0 m-0" >
                        <TableHead className="p-3 m-0">Task</TableHead>
                        <TableHead className="p-0 m-0">Name</TableHead>
                        <TableHead className="p-0 m-0">Created At</TableHead>
                        <TableHead className="p-0 m-0">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userTodo?.length>0  && userTodo?.map(todo=>(
                            <TableRowTodo key={todo?.todoId} task={todo} setUserTodo = {setUserTodo} userTodo = {userTodo}/>
                        ))}                        
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="active">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Manage your tasks and view their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader className="bg-slate-200 dark:bg-sky-950">
                      <TableRow className = "p-0 m-0" >
                        <TableHead className="p-3 m-0">Task</TableHead>
                        <TableHead className="p-0 m-0">Name</TableHead>
                        <TableHead className="p-0 m-0">Created At</TableHead>
                        <TableHead className="p-0 m-0">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userTodo?.length>0  && userTodo?.map(todo=> !todo?.completed &&(
                            <TableRowTodo key={todo?.todoId} task={todo} setUserTodo = {setUserTodo} userTodo = {userTodo}/>
                        ))}                        
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="completed">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Manage your tasks and view their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader className="bg-slate-200 dark:bg-sky-950">
                      <TableRow className = "p-0 m-0" >
                        <TableHead className="p-3 m-0">Task</TableHead>
                        <TableHead className="p-0 m-0">Name</TableHead>
                        <TableHead className="p-0 m-0">Created At</TableHead>
                        <TableHead className="p-0 m-0">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userTodo?.length>0  && userTodo.map(todo=> todo.completed &&(
                            <TableRowTodo key={todo?.todoId} task={todo} setUserTodo = {setUserTodo} userTodo = {userTodo}/>
                        ))}                        
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
    </div>
  )
}