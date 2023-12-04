"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SignInButton from './components/SignInButton';

export default function Login() {
  const { data: session } = useSession();
  return (
    <>
    <div className="bg-emerald-200  w-full p-5">
      <SignInButton session={session} />
    </div>
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-emerald-200 w-3/5 p-10">
          <h2>Welcome to Shangshar Management</h2>
        </div>
    </main>
    </>
  )
}
