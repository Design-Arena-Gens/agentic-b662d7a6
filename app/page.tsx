"use client";

import { useMemo } from "react";
import ExpenseForm from "@/components/expense-form";
import ExpenseList from "@/components/expense-list";
import SummaryCards from "@/components/summary-cards";
import BudgetPanel from "@/components/budget-panel";
import { useLocalStorage } from "@/lib/use-local-storage";
import type { BudgetRule, Expense, ExpenseCategory } from "@/lib/types";

const categories: ExpenseCategory[] = [
  "Housing",
  "Utilities",
  "Groceries",
  "Transport",
  "Health",
  "Entertainment",
  "Dining",
  "Shopping",
  "Savings",
  "Other",
];

const Page = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [budgets, setBudgets] = useLocalStorage<BudgetRule[]>("budgets", []);

  const monthlyGrouped = useMemo(() => {
    const groups = new Map<string, Expense[]>();
    expenses.forEach((expense) => {
      const key = expense.date.slice(0, 7);
      const items = groups.get(key) ?? [];
      items.push(expense);
      groups.set(key, items);
    });
    return [...groups.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, items]) => ({ month, items }));
  }, [expenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const handleSaveBudgets = (rules: BudgetRule[]) => {
    setBudgets(rules);
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-100">Expense Dashboard</h1>
            <p className="text-sm text-slate-400">
              Add transactions, monitor budgets, and discover spending insights.
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs text-slate-400">
            Local storage only. Your data stays in this browser.
          </div>
        </div>
        <SummaryCards expenses={expenses} budgets={budgets} />
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ExpenseForm onAddExpense={handleAddExpense} categories={categories} />
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {monthlyGrouped.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-400">
                Start adding expenses to see your spending history.
              </div>
            )}
            {monthlyGrouped.map(({ month, items }) => (
              <section key={month} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-100">
                    {new Date(`${month}-01`).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    Total: ${items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                  </span>
                </div>
                <ExpenseList expenses={items} onDelete={handleRemoveExpense} />
              </section>
            ))}
          </div>
        </div>
      </section>

      <BudgetPanel
        categories={categories}
        budgets={budgets}
        onSaveBudgets={handleSaveBudgets}
        expenses={expenses}
      />
    </main>
  );
};

export default Page;
