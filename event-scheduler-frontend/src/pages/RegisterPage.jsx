import React, { useState } from "react";
import { register, setToken } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ name, email, password });
      setToken(res.token);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        {err && <div className="text-red-500 mb-3">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded"/>
          <input required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded"/>
          <input required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded"/>
          <button className="w-full py-2 bg-green-600 text-white rounded">Register</button>
        </form>
        <div className="text-sm text-slate-600 mt-3">
          Already have an account? <Link className="text-blue-600" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
