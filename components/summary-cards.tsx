"use client";

import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { BudgetRule, Expense } from "@/lib/types";

interface SummaryCardsProps {
  expenses: Expense[];
  budgets: BudgetRule[];
}

const SummaryCards = ({ expenses, budgets }: SummaryCardsProps) => {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyByCategory = budgets.map((budget) => {
    const spent = expenses
      .filter((expense) => expense.category === budget.category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = Math.max(budget.monthlyLimit - spent, 0);
    return {
      ...budget,
      spent,
      remaining,
      utilization: budget.monthlyLimit
        ? Math.min(spent / budget.monthlyLimit, 1)
        : 0,
    };
  });

  const largestExpense = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 1)
    .at(0);

  const plannedTotal = budgets.reduce((sum, budget) => sum + budget.monthlyLimit, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card
        icon={<Wallet className="h-5 w-5 text-primary-300" />}
        label="Total spent"
        primary={`$${totalSpent.toFixed(2)}`}
        subLabel={`${expenses.length} expenses logged`}
      />
      <Card
        icon={<PiggyBank className="h-5 w-5 text-emerald-300" />}
        label="Budget utilization"
        primary={plannedTotal ? `${Math.round((totalSpent / plannedTotal) * 100)}%` : "--"}
        subLabel={plannedTotal ? `Of $${plannedTotal.toFixed(2)} planned` : "Set budgets to track"}
      />
      <Card
        icon={<TrendingUp className="h-5 w-5 text-orange-300" />}
        label="Largest expense"
        primary={largestExpense ? `$${largestExpense.amount.toFixed(2)}` : "--"}
        subLabel={largestExpense ? largestExpense.name : "Add expenses to see"}
      />
      <Card
        icon={<TrendingDown className="h-5 w-5 text-sky-300" />}
        label="Budgets remaining"
        primary={`$${monthlyByCategory.reduce((sum, item) => sum + item.remaining, 0).toFixed(2)}`}
        subLabel={`Across ${monthlyByCategory.length} categories`}
      />
    </div>
  );
};

interface CardProps {
  icon: React.ReactNode;
  label: string;
  primary: string;
  subLabel: string;
}

const Card = ({ icon, label, primary, subLabel }: CardProps) => (
  <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
    <div className="flex items-center gap-3 text-slate-400">
      <div className="rounded-full border border-slate-800 bg-slate-950/70 p-2">{icon}</div>
      <span className="text-sm uppercase tracking-wide">{label}</span>
    </div>
    <div className="text-3xl font-semibold text-slate-100">{primary}</div>
    <p className="text-xs text-slate-400">{subLabel}</p>
  </div>
);

export default SummaryCards;
