"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarIcon, DollarSign, TagIcon } from "lucide-react";
import type { Expense, ExpenseCategory } from "@/lib/types";

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  categories: ExpenseCategory[];
}

const defaultForm: Omit<Expense, "id"> = {
  name: "",
  amount: 0,
  category: "Other",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

const ExpenseForm = ({ onAddExpense, categories }: ExpenseFormProps) => {
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () => form.name.trim().length > 0 && form.amount > 0,
    [form.amount, form.name],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    onAddExpense({ ...form, id: crypto.randomUUID() });
    setForm({ ...defaultForm, date: form.date });
    setTimeout(() => setIsSubmitting(false), 250);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl"
    >
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm text-slate-300">
          Expense name
        </label>
        <div className="relative">
          <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="eg. Groceries"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none transition focus:border-primary-500 focus:ring focus:ring-primary-500/30"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="amount" className="text-sm text-slate-300">
            Amount
          </label>
          <div className="relative">
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount === 0 ? "" : form.amount}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  amount: Number.parseFloat(event.target.value || "0"),
                }))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none transition focus:border-primary-500 focus:ring focus:ring-primary-500/30"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="date" className="text-sm text-slate-300">
            Date
          </label>
          <div className="relative">
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, date: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none transition focus:border-primary-500 focus:ring focus:ring-primary-500/30"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="category" className="text-sm text-slate-300">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                category: event.target.value as ExpenseCategory,
              }))
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary-500 focus:ring focus:ring-primary-500/30"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="notes" className="text-sm text-slate-300">
            Notes (optional)
          </label>
          <input
            id="notes"
            name="notes"
            value={form.notes ?? ""}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, notes: event.target.value }))
            }
            placeholder="Add context"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary-500 focus:ring focus:ring-primary-500/30"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:bg-slate-600"
      >
        {isSubmitting ? "Adding..." : "Add expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;
