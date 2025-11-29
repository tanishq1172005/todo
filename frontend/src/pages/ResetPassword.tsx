import { useState } from "react";
import axios from 'axios'
import {BASE_URL,API_PATHS} from '../utils/apiPath'
import { useNavigate, Link } from "react-router-dom";

export default function ResetPassword(){
    const [email,setEmail] = useState('')
    const [otp,setOtp] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [message,setMessage] = useState(null)
    const [error,setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try{
            const res = await axios.post(`${BASE_URL}${API_PATHS.AUTH.RESET_PASSWORD}`,{email,otp,newPassword})
            setMessage(res.data.message)
            navigate('/login')
        }catch(err:any){
            setError(err.response?.data?.message)
        }
    }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <h2 className="text-3xl font-semibold text-white text-center">
          Reset Password
        </h2>
        <p className="text-zinc-400 text-center mt-2 text-sm">
          Reset your password
        </p>
        <form onSubmit={handleSubmit}  className="mt-8 space-y-5">

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
            <label className="text-sm text-zinc-300">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e=>setOtp(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter OTP"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e=>setNewPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter new password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-white cursor-pointer text-black font-medium rounded-xl hover:bg-zinc-200 transition-all duration-200"
          >
            Change Password
          </button>
        </form>
        <p className="text-center text-zinc-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:underline">
            Sign Up
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


