"use client";

export default function ExpenseTable({data, deleteExpense, month}) {
    const expenses = data.expense ?? [];
    const amountArray = [];
    return (
        <table className="w-full min-w-max table-auto text-left divide-y divide-gray-200 mt-4">
            <thead className="sticky top-0 bg-gray-900 text-white">
                <tr>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50">SL</th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50">Expence Name</th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50">Amount</th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-3 transition-colors hover:bg-blue-gray-50">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                expenses.length > 0 && expenses.map((exp, index) => {
                    amountArray.push(exp.amount)
                    return (
                            <tr key={exp.id}>
                                <td className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 transition-colors hover:bg-blue-gray-50">{index + 1}</td>
                                <td className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 transition-colors hover:bg-blue-gray-50">{exp.name}</td>
                                <td className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 transition-colors hover:bg-blue-gray-50">{exp.amount}/-</td>
                                <td className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 transition-colors hover:bg-blue-gray-50">
                                    <button id={exp.id} onClick={ deleteExpense } className="rounded-md bg-red-600 px-3 py-2 mx-1 text-sm text-white">Delete</button>
                                </td>
                            </tr>
                    )
                })}

                {
                !expenses.length && 
                    <tr>
                        <td colSpan="4" className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 transition-colors hover:bg-blue-gray-50 text-center">No data found</td>
                    </tr>
                }
            </tbody>
            <tfoot className="sticky bottom-0 bg-gray-600 text-white">
                <tr >
                    <th colSpan="2" className="px-3 py-3">Total Expense of the month of {month}</th>
                    <th>{amountArray.reduce((acc, val) => acc + val, 0)}</th>
                    <th></th>
                </tr>
            </tfoot>
        </table>
    )
}