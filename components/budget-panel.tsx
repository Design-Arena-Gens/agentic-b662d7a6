"use client";

import { useMemo, useState } from "react";
import { BarChart3, Plus, Trash2 } from "lucide-react";
import type { BudgetRule, Expense, ExpenseCategory } from "@/lib/types";

interface BudgetPanelProps {
  categories: ExpenseCategory[];
  budgets: BudgetRule[];
  onSaveBudgets: (budgets: BudgetRule[]) => void;
  expenses: Expense[];
}

const BudgetPanel = ({ categories, budgets, onSaveBudgets, expenses }: BudgetPanelProps) => {
  const [draftBudgets, setDraftBudgets] = useState<BudgetRule[]>(budgets);

  const insights = useMemo(() => {
    return draftBudgets.map((budget) => {
      const spent = expenses
        .filter((expense) => expense.category === budget.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      const remaining = Math.max(budget.monthlyLimit - spent, 0);
      const utilization = budget.monthlyLimit
        ? Math.min(spent / budget.monthlyLimit, 1)
        : 0;
      return { ...budget, spent, remaining, utilization };
    });
  }, [draftBudgets, expenses]);

  const addBudget = () => {
    const unused = categories.find(
      (category) => !draftBudgets.some((budget) => budget.category === category),
    );
    if (!unused) return;
    setDraftBudgets((prev) => [...prev, { category: unused, monthlyLimit: 0 }]);
  };

  const updateBudget = (category: ExpenseCategory, limit: number) => {
    setDraftBudgets((prev) =>
      prev.map((item) =>
        item.category === category
          ? {
              ...item,
              monthlyLimit: Number.isFinite(limit) && limit >= 0 ? limit : 0,
            }
          : item,
      ),
    );
  };

  const removeBudget = (category: ExpenseCategory) => {
    setDraftBudgets((prev) => prev.filter((item) => item.category !== category));
  };

  const handleSave = () => onSaveBudgets(draftBudgets);

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-slate-800 bg-slate-950/70 p-2">
            <BarChart3 className="h-5 w-5 text-primary-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Budgets</h2>
            <p className="text-xs text-slate-400">Set monthly limits and monitor progress</p>
          </div>
        </div>
        <button
          onClick={addBudget}
          disabled={draftBudgets.length >= categories.length}
          className="inline-flex items-center gap-2 rounded-lg border border-primary-500/40 px-3 py-1.5 text-xs font-medium text-primary-300 transition hover:bg-primary-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
        >
          <Plus className="h-3 w-3" /> Add budget
        </button>
      </header>

      <div className="space-y-4">
        {insights.length === 0 && (
          <p className="text-sm text-slate-500">Add a budget to begin tracking goals.</p>
        )}

        {insights.map((insight) => (
          <div
            key={insight.category}
            className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/70 p-4"
          >
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span className="font-medium text-slate-100">{insight.category}</span>
              <button
                onClick={() => removeBudget(insight.category)}
                className="inline-flex items-center gap-1 text-xs text-red-400 transition hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-xs uppercase tracking-wide text-slate-400">
                Monthly limit
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={insight.monthlyLimit}
                  onChange={(event) =>
                    updateBudget(
                      insight.category,
                      Number.parseFloat(event.target.value || "0"),
                    )
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500 focus:ring focus:ring-primary-500/30"
                />
              </label>
              <dl className="grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs text-slate-300">
                <div>
                  <dt className="text-slate-500">Spent</dt>
                  <dd className="text-sm font-semibold text-primary-300">
                    ${insight.spent.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Remaining</dt>
                  <dd className="text-sm font-semibold text-emerald-300">
                    ${insight.remaining.toFixed(2)}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-500">Utilization</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-full rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-primary-400 transition-all"
                        style={{ width: `${insight.utilization * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      {Math.round(insight.utilization * 100)}%
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-400"
        >
          Save budgets
        </button>
      </div>
    </section>
  );
};

export default BudgetPanel;
