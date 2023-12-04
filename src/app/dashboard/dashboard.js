"use client";

import { useSession } from "next-auth/react";
import ExpenseOverview from '../components/expense-overview/page';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {Backend_URL} from '../../lib/Constants';

export default function DashboardComponent({children}) {
  const {data: session} = useSession();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getExpenses = async () => {
        const response = await fetch(Backend_URL + "/dashboard/" + session?.user.id, {
            method: "GET",
            headers: { 
                authorization: `Bearer ${ session?.backendTokens.accessToken }`
            }
        });
    
        const result = await response.json();
        if(response.ok) {
            setData(result);
        } else {
          toast.error(result.message);
        }
    }

    if(session) {
      getExpenses();
    }
    
  }, [session]);

  return (
    <>
    {data.length > 0 && data.map(month => {
        let amount = 0;
        month.expense.map((exp) => {
          amount += exp.amount;
        });

        return (<ExpenseOverview month={month.month + " " + month.year} totalEarn={month.totalEarn} totalExpense={amount} remaining={month.totalEarn - amount} stock={month.user.InStock} />);
    })}

    {!data.length && <div>
      <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
            <div className="p-6">
              <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                No Data Found!
              </h5>
            </div>
        </div>
    </div>}
</>
    
  )
}