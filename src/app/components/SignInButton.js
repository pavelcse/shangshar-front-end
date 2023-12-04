import Link from 'next/link';

const SignIn = ({session}) => {
    if(session && session.user) {
        return (
            <div className='flex gap-4 ml-auto'>
                <p className='text-sky-600'>{session.user.name} - Shangshar Management</p>
                <Link className="flex gap-4 ml-auto bg-blue-400 text-white p-2 rounded" href={"/dashboard"}>
                    Dashboard
                </Link>
                <Link className="flex gap-4 bg-red-500 text-white p-2 rounded" href={"/api/auth/signout"}>
                    Sign Out
                </Link>
            </div>
        )
    }
  return (
    <div className='flex gap-4 ml-auto items-center'>
        <p className='text-sky-600'>Shangshar Management</p>
        <Link className="flex gap-4 ml-auto bg-blue-600 text-green-200 p-2 rounded" href={"/api/auth/signin"}>
            Sign In
        </Link>
        <Link className="flex gap-4 bg-green-600 text-green-200 p-2 rounded" href={"/register"}>
            Sign Up
        </Link>
    </div>
  )
}

export default SignIn;