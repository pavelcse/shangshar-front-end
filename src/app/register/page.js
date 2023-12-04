"use client";

import { Backend_URL } from '../../lib/Constants';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({...userData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(Backend_URL + "/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }),
      headers: { "Content-Type": "application/json" }
    });

    if(!res.ok) {
      alert(res.statusText);
      return;
    }

    const response = await res.json();
    alert("User Registered");
    
  }

  return (
    <>
    <div className="bg-emerald-200 w-full p-5">
      <div className="flex gap-4 ml-auto items-center">
        <p className="text-sky-600">Shangshar Management</p>
        <a className="flex gap-4 ml-auto bg-blue-600 text-green-200 p-2 rounded" href="/api/auth/signin">Sign In</a>
        <a className="flex gap-4 bg-green-600 text-green-200 p-2 rounded" href="/register">Sign Up</a>
      </div>
    </div>

    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-emerald-200  w-2/5 p-10">
        <form onSubmit={handleSubmit}>
        <div className="py-3">
            <input type="text" id="" name="name" className="py-3 rounded-lg px-3 w-full" placeholder="Your Name" onChange={e => handleChange(e)} />
          </div>

          <div className="relative py-3">
            <input type="text" id="" name="email" className="py-3 px-3 ps-11 rounded-lg w-full" placeholder="you@site.com" onChange={e => handleChange(e)} />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
              <svg className="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
          </div>

          <div className="py-3">
            <input type="password" id="" name="password" className="py-3 rounded-lg px-3 w-full" placeholder="Your Password" onChange={e => handleChange(e)} />
          </div>

          <div className="py-3 text-right">
            <Link className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 mx-2 px-10 rounded-full" href="/api/auth/signin">Login</Link>
            <button type='submit' className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 mx-2 px-10 rounded-full">Register</button>
          </div>
        </form>
      </div>
    </main>
    </>
  )
}
