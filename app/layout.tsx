import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track spending, budgets, and categories with a modern dashboard.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className="antialiased">{children}</body>
  </html>
);

export default RootLayout;
