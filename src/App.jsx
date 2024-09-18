import { useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter , Routes, Route} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from './components/ui/toaster'
import { Verify } from './pages/Verify'
import PrivateRoute from './components/PrivateRoute'
import Todo from './pages/Todo'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Toaster/>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route element = {<PrivateRoute/>}>
            <Route path="/todo" element={<Todo/>}></Route>
        </Route>
        <Route path='/verify' element={<Verify/>}></Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
