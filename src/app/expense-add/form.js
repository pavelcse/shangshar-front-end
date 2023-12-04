"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ItemSingle from "../components/item-single/page";
import ExpenseTable from './table';
import { Backend_URL } from '../../lib/Constants';
import toast from "react-hot-toast";
import ExpenseOverview from '../components/expense-overview/page';

export default function ExpenseForm({children}) {
    const {data: session} = useSession();
    const [formData, setFormData] = useState({
        month: '',
        year: '',
        name: '',
        amount: '',
        totalEarn: 0,
        InStock: 0,
        isCompleted: false,
        shawCompleteButton: false,
        readonly: false,
    });
    const [expenseData, setExpenseData] = useState([]);

    const [items, setItems] = useState([])

    const [totalExpense, setTotalExpense] = useState(0);
    const [remainingBalance, setRemainingBalance] = useState(0);;


    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentYear = (new Date()).getFullYear();
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
    const years = range(currentYear, currentYear - 50, -1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name == 'month' || name == 'year') {
            setFormData({...formData, [name]: value, currentChange: name, shawCompleteButton: false});
        } else {
            setFormData({...formData, [name]: value, currentChange: name});
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(formData.month && formData.year && formData.name && formData.amount) {
            const response = await fetch(Backend_URL + "/expense/add", {
                method: "POST",
                body: JSON.stringify({
                    id: expenseData?.id,
                    userId: session?.user.id,
                    month: formData.month,
                    year: formData.year,
                    totalEarn: formData.totalEarn,
                    expense: [
                        {
                            userId: session?.user.id,
                            name: formData.name,
                            amount: formData.amount,
                        }
                    ]
                }),
                headers: { 
                    "Content-Type": "application/json" ,
                    authorization: `Bearer ${ session?.backendTokens.accessToken }`
                }
            });
    
            if(response.ok) {
                const result = await response.json();
                
                setExpenseData({...expenseData, expense: result.expense});

                // Get total amount of expense
                const expenseList = result.expense;
                expenseList.map(exp => setTotalExpense(totalExpense + exp.amount));
                setFormData({...formData, name: '', amount: '', currentChange: '',});
                //setRemainingBalance(formData.totalEarn - totalExpense);
                toast.success("Expense item added.");
            }
        }
    }

    const deleteExpense = async (e) => {
        const expenseId = e.target.id;
        
        const response = await fetch(Backend_URL + "/expense/" + expenseId, {
            method: "GET",
            headers: { 
                authorization: `Bearer ${ session?.backendTokens.accessToken }`
            }
        });

        const result = await response.json();

        if(response.ok) {
            const updatedExpense = expenseData.expense.filter((exp) => exp.id !== result.id);
            setExpenseData({...expenseData, expense: updatedExpense});

            // Get total amount of expense
            let sumExpenseAmount = 0;
            updatedExpense.map(exp => sumExpenseAmount += exp.amount);
            setTotalExpense(sumExpenseAmount);
            setFormData({...formData,})
            //setRemainingBalance(formData.totalEarn - totalExpense);

            toast.success("Expense item deleted successfully.");
        } else {
            toast.error(result.message);
        }
    }

    const getItems = async (userId) => {
        const response = await fetch(Backend_URL + "/item/" + userId, {
            headers: { 
                "Content-Type": "application/json" ,
                authorization: `Bearer ${ session?.backendTokens.accessToken }`
            }
          });

          const result = await response.json();

          if(response.ok) {
            setItems(result)
          }
    }

    const addToExpense = (item) => {
        setFormData({...formData, name: item.item, amount: item.cost});
    }

    const resetExpenseForm = () => {
        setFormData({ ...formData, name: '', amount: '' });
    }

    const getExpenceHistory = async () => {
        if(formData.month && formData.year) {
            const response = await fetch(Backend_URL + "/expense/items", {
                method: "POST",
                body: JSON.stringify({
                    userId: session?.user.id,
                    month: formData.month,
                    year: formData.year,
                }),
                headers: { 
                    "Content-Type": "application/json" ,
                    authorization: `Bearer ${ session?.backendTokens.accessToken }`
                }
            });
    
            const result = await response.json();
            if(response.ok) {
                setExpenseData(result);
                
                // Get total amount of expense
                let sumExpenseAmount = 0;
                const expenseList = result.expense;
                expenseList.map(exp => sumExpenseAmount += exp.amount);
                setTotalExpense(sumExpenseAmount);
                setFormData({...formData, totalEarn: result.totalEarn, InStock:result.user.InStock, isCompleted: result.isCompleted, shawCompleteButton: true,});
                //setRemainingBalance(formData.totalEarn - totalExpense);
                toast.success("Expense data loaded successfylly");
            } else {
                setExpenseData([]);
                setFormData({...formData, totalEarn: 0, InStock: 0, shawCompleteButton: true });
                setTotalExpense(0);
                toast.error(result.message || response.statusText);
            }

            getItems(session?.user.id);
        } else {
            toast.error("Please select Month and Year!")
        }
    }

    const makeAsComplete = async () => {
        const response = await fetch(Backend_URL + "/expense/complete-incomplete", {
            method: "POST",
            body: JSON.stringify({
                id: expenseData.id,
                isCompleted: !formData.isCompleted,
                remainingBalcnce: remainingBalance,
                InStock: formData.InStock,
            }),
            headers: { 
                "Content-Type": "application/json" ,
                authorization: `Bearer ${ session?.backendTokens.accessToken }`
            }
        });

        const result = await response.json();

        if(response.ok) {
            setFormData({...formData, isCompleted: result.month[0].isCompleted, InStock: result.InStock});
            if(result.isCompleted) {
                toast.success("Expense successfylly mark as complete");
            } else {
                toast.success("Expense successfylly mark as incomplete");
            }
        }
    }

    useEffect(() => {
        setRemainingBalance(formData.totalEarn - totalExpense);
        console.log(555);
    },[formData.totalEarn, totalExpense]);

    return (
        <div className="flex">
            <div className="w-3/4">
            <div className="p-2 bg-gradient-to-b from-gray-500 to-gray-700 text-white rounded">
                Add Expenses
            </div>
                <div className="p-5 mb-2 bg-white shadow-sm rounded-md">
                    <div className="my-1 flex">
                        <div className="w-2/6 mr-3">
                            <div className="flex rounded-lg shadow-sm">
                                <span className="px-3 w-1/6 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400">Month</span>
                                <select name="month" onChange={ e => handleChange(e) } className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm rounded-e-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                                    <option key="" value="">Select Month</option>
                                    {months.map(manth => (
                                        <option key={manth} value={manth}>{manth}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-2/6 ml-3">
                            <div className="flex rounded-lg shadow-sm">
                                <span className="px-3 w-1/6 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400">Year</span>
                                <select name="year" onChange={ e => handleChange(e) } className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm rounded-e-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                                    <option key="" value="">Select Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-2/6 ml-3">
                            <div className="flex rounded-lg shadow-sm">
                                <span className="px-3 w-1/6 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400">Total Earning</span>
                                <input readOnly={formData.readonly}  name="totalEarn" value={formData.totalEarn} onChange={ e => handleChange(e) } className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm rounded-e-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="my-2 justify-center flex">
                        <button onClick={ getExpenceHistory } type="button" className="bg-blue-400 hover:bg-blue-600 w-2.5/6 text-white font-bold py-2 px-10 mx-2 rounded-lg">Set As Current Month</button>
                        { formData.shawCompleteButton && <button onClick={ makeAsComplete } type="button" className={`${formData.isCompleted ? "bg-red-400" : "bg-green-400"} ${formData.isCompleted ? "hover:bg-red-600" : "hover:bg-green-600"} w-2.5/6 text-white font-bold py-2 px-10 mx-2 rounded-lg`}>{formData.isCompleted ? 'Make As Incomplete' : 'Make As Complete'}</button>}
                    </div>
                    <div className="my-4 bg-gray-600 h-[1px]"></div>

                    {
                    !formData.isCompleted && 
                        <form onSubmit={handleSubmit}>
                            <div className="my-1">
                                <div className="flex rounded-lg shadow-sm">
                                <span className="px-3 w-1/6 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400">Expense Name</span>
                                <input type="text" name="name" onChange={ e => handleChange(e) } value={formData.name} className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm rounded-e-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="Expense Name"/>
                                </div>
                            </div>
                            <div className="my-1">
                                <div className="flex rounded-lg shadow-sm">
                                <span className="px-3 w-1/6 inline-flex items-center min-w-fit rounded-s-md border border-e-0 border-gray-200 bg-gray-50 text-sm text-gray-500 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400">Expense Amount</span>
                                <input type="number" name="amount" onChange={ e => handleChange(e) } value={formData.amount} className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm rounded-e-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="Expense Amount"/>
                                </div>
                            </div>
                            <div className="my-1 text-right">
                                <button onClick={resetExpenseForm} type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-10 mx-2 rounded-lg">Clear</button>
                                <button type="submit" className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-10 mx-2 rounded-lg">Save Expense</button>
                            </div>
                        </form>
                    }
                </div> 
                <div className="px-5  bg-white shadow-sm rounded-md max-h-[600px] overflow-y-scroll">
                    <ExpenseTable data={expenseData} deleteExpense={ deleteExpense } month={ formData.month + ' ' + formData.year } />
                </div> 
            </div>
            <div className="w-1/4 ml-2">
                <div className="p-2 bg-gradient-to-b from-gray-500 to-gray-700 text-white rounded">
                    Items List
                </div>
                <div className="max-h-[500px] overflow-y-scroll bg-white mb-2">
                    {!formData.isCompleted && items.length > 0 && items.map(item => (
                        <ItemSingle addToExpense={ addToExpense } key={item.id} item={item} />
                    ))}

                    {!items.length &&
                    <div className="my-2 shadow-sm rounded-md">
                        <h3 className='border ml-1 px-3 py-2 mb-1 rounded-md bg-blue-100'> No items found </h3>
                    </div>
                    }
                </div>
                <div className="bg-white rounded">
                    <div className="p-2 bg-gradient-to-b from-gray-500 to-gray-700 text-white rounded">
                        Month Overview
                    </div>
                    <ExpenseOverview month={formData.month + ' ' + formData.year} totalEarn={formData.totalEarn} totalExpense={totalExpense} remaining={remainingBalance} stock={formData.InStock} />
                </div>
            </div>
        </div>
    )
}