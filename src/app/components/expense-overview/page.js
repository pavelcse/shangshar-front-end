export default function ExpenseOverview({month, totalEarn, totalExpense, remaining, stock}) {
    return (
        <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
            <div className="p-6">
              <h5
                className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                {month}
              </h5>
              <p className="mb-0 text-base text-neutral-600 dark:text-neutral-200"> Total Earning - { totalEarn ?? 0 }/- </p>
              <p className="mb-0 text-base text-neutral-600 dark:text-neutral-200"> Total Expence - { totalExpense ?? 0 }/- </p>
              <p className="mb-0 text-base text-neutral-600 dark:text-neutral-200"> Remaining Balance - { remaining ?? 0 }/- </p>
              <p className="mb-0 text-base text-neutral-600 dark:text-neutral-200"> In Stock - { stock ?? 0 }/- </p>
            </div>
        </div>
    )
}