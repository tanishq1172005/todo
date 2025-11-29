import { useState } from "react";
import axios from 'axios'
import {BASE_URL,API_PATHS} from '../utils/apiPath'
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Login(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [message,setMessage] = useState('')
    const [error,setError] = useState(null)
    const navigate = useNavigate()
    const login = useAuthStore((state)=>state.login)
    const handleRegister =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try{
            const res = await axios.post(`${BASE_URL}${API_PATHS.AUTH.LOGIN}`,{email,password})
          
            setMessage('Log in successfull')
            login({
              id:res.data._id,
              name:res.data.name,
              email:res.data.email

            },res.data.token)
            navigate('/')
        }catch(err:any){
            setError(err.response?.data?.message)
        }
    }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <h2 className="text-3xl font-semibold text-white text-center">
          Log In
        </h2>
        <p className="text-zinc-400 text-center mt-2 text-sm">
          Welcome back and start your journey
        </p>
        <form onSubmit={handleRegister}  className="mt-8 space-y-5">

          <div>
            <label className="text-sm text-zinc-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 cursor-pointer bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-all duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-zinc-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="text-center text-zinc-500 text-sm mt-6">
          <Link to="/forgot-password" className="text-white hover:underline">
            Forgot Password?
          </Link>
        </p>
        {message && (
            <p className="text-blue-500 text-sm">{message}</p>
        )}
        {error && (
            <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}


