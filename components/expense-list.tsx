"use client";

import { useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, FilterIcon, Search } from "lucide-react";
import type { Expense } from "@/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

type SortKey = "date" | "amount" | "name";

type SortState = {
  key: SortKey;
  direction: "asc" | "desc";
};

const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "date", direction: "desc" });
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filteredExpenses = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return expenses
      .filter((expense) =>
        filterCategory === "All" ? true : expense.category === filterCategory,
      )
      .filter((expense) => {
        if (!normalized) return true;
        return (
          expense.name.toLowerCase().includes(normalized) ||
          (expense.notes ?? "").toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => {
        const multiplier = sort.direction === "asc" ? 1 : -1;
        switch (sort.key) {
          case "amount":
            return multiplier * (a.amount - b.amount);
          case "name":
            return multiplier * a.name.localeCompare(b.name);
          case "date":
          default:
            return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
        }
      });
  }, [expenses, filterCategory, searchTerm, sort.direction, sort.key]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={searchTerm.trimStart()}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search expenses"
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="hidden h-4 w-4 text-slate-400 lg:block" />
          <select
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
          >
            <option value="All">All categories</option>
            {[...new Set(expenses.map((expense) => expense.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 shadow-2xl">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/90">
            <tr>
              <SortableHeader
                label="Date"
                active={sort.key === "date"}
                direction={sort.direction}
                onClick={() => toggleSort("date")}
              />
              <SortableHeader
                label="Name"
                active={sort.key === "name"}
                direction={sort.direction}
                onClick={() => toggleSort("name")}
              />
              <SortableHeader
                label="Category"
                active={false}
                direction="asc"
                onClick={() => undefined}
              />
              <SortableHeader
                label="Amount"
                active={sort.key === "amount"}
                direction={sort.direction}
                onClick={() => toggleSort("amount")}
              />
              <th className="px-4 py-3 text-right font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-900/60">
                <td className="px-4 py-3 text-slate-200">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium text-slate-100">{expense.name}</td>
                <td className="px-4 py-3 text-slate-300">{expense.category}</td>
                <td className="px-4 py-3 text-right font-semibold text-primary-300">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-xs font-medium text-red-400 transition hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  No expenses match your filters yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}

const SortableHeader = ({ label, active, direction, onClick }: SortableHeaderProps) => (
  <th scope="col" className="px-4 py-3 text-left font-medium text-slate-400">
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-xs uppercase tracking-wide transition ${
        active ? "text-primary-300" : "text-slate-400"
      }`}
    >
      {label}
      {active ? (
        direction === "asc" ? (
          <ArrowDownAZ className="h-3 w-3" />
        ) : (
          <ArrowUpAZ className="h-3 w-3" />
        )
      ) : null}
    </button>
  </th>
);

export default ExpenseList;
