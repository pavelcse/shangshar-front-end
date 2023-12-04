import Link from 'next/link';

export default function Nav({ user }) {
    return (
        <div>
            <div className="text-gray-100 text-xl">
            <div className="p-2.5 mt-1 flex items-center">
                <Link href="/dashboard">
                    <h1 className="font-bold text-gray-200 text-[15px] ml-3">Sangshar Management - {user.name}</h1>
                </Link>
            </div>
            <div className="my-2 bg-gray-600 h-[1px]"></div>
            </div>

            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white text-left">
                <Link className="text-[15px] ml-4 text-gray-200 font-bold w-full" href={"/user/" + user.id}>Profile</Link>
            </div>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white text-left">
                <Link className="text-[15px] ml-4 text-gray-200 font-bold w-full" href="/item-add">Items</Link>
            </div>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white text-left">
                <Link className="text-[15px] ml-4 text-gray-200 font-bold w-full" href="/expense-add">Add Expense</Link>
            </div>

            
            <div className="my-4 bg-gray-600 h-[1px]"></div>
            
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
                <Link className="text-[15px] ml-4 text-gray-200 font-bold" href="/api/auth/signout">Logout</Link>
            </div>
        </div>
    )
}