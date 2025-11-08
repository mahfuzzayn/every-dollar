"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useExpense } from "@/contexts/ExpenseContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { Budget } from "@/types";

export default function BudgetTracker() {
  const { expenses } = useExpense();
  const { isAuthenticated } = useAuth();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Get current month in YYYY-MM format
  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  // Calculate current month spending
  const currentMonthSpending = useMemo(() => {
    if (!expenses || expenses.length === 0) return 0;

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
        return expenseMonth === currentMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  }, [expenses, currentMonth]);

  // Fetch budget
  const fetchBudget = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/budget", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch budget");
      }

      setBudget(result.data);
      if (result.data) {
        setBudgetAmount(result.data.amount.toString());
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save budget
  const saveBudget = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to set budget");
      return;
    }

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save budget");
      }

      setBudget(result.data);
      setIsDialogOpen(false);
      toast.success("Budget saved successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save budget"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch budget on mount and when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBudget();
    }
  }, [isAuthenticated]);

  // Component automatically re-renders when expenses change
  // currentMonthSpending is recalculated via useMemo when expenses change

  if (!isAuthenticated) return null;

  const budgetAmountNum = budget?.amount || 0;
  const spendingPercentage = budgetAmountNum > 0 
    ? Math.min((currentMonthSpending / budgetAmountNum) * 100, 100) 
    : 0;
  const isOverBudget = currentMonthSpending > budgetAmountNum;
  const remaining = budgetAmountNum - currentMonthSpending;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <Card className="bg-white">
      <CardHeader className="px-6 md:px-8 pt-6 md:pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl md:text-2xl font-black">
              Monthly Budget
            </CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs md:text-sm font-bold"
                style={{ borderColor: 'var(--neo-border)' }}
              >
                {budget ? "Edit Budget" : "Set Budget"}
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-md"
              style={{
                borderColor: 'var(--neo-border)',
                boxShadow: '8px 8px 0px 0px var(--shadow-color)',
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-black">
                  {budget ? "Update Monthly Budget" : "Set Monthly Budget"}
                </DialogTitle>
                <DialogDescription className="text-base font-medium">
                  Set your spending limit for {formatMonth(currentMonth)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-black">
                    Budget Amount ($)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter monthly budget"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="text-base font-medium"
                    style={{ borderColor: 'var(--neo-border)' }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="font-bold"
                  style={{ borderColor: 'var(--neo-border)' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveBudget}
                  disabled={isSaving}
                  className="font-bold"
                  style={{ borderColor: 'var(--neo-border)' }}
                >
                  {isSaving ? "Saving..." : budget ? "Update" : "Set Budget"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="px-6 md:px-8 pb-6 md:pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground font-bold">Loading budget...</div>
          </div>
        ) : !budget ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground font-medium">
              No budget set for {formatMonth(currentMonth)}
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="font-bold"
              style={{ borderColor: 'var(--neo-border)' }}
            >
              Set Your Budget
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Budget</p>
                <p className="text-2xl font-black">{formatCurrency(budgetAmountNum)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Spent</p>
                <p className={`text-2xl font-black ${isOverBudget ? "text-destructive" : ""}`}>
                  {formatCurrency(currentMonthSpending)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">Progress</span>
                <span className={`font-black ${isOverBudget ? "text-destructive" : ""}`}>
                  {spendingPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="relative border-2 h-4" style={{ borderColor: 'var(--neo-border)', backgroundColor: 'var(--muted)' }}>
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(spendingPercentage, 100)}%`,
                    backgroundColor: isOverBudget 
                      ? 'var(--destructive)' 
                      : spendingPercentage >= 80 
                        ? '#f59e0b' 
                        : 'var(--primary)',
                  }}
                />
              </div>
            </div>

            {/* Remaining/Over Budget */}
            {isOverBudget ? (
              <div 
                className="p-4 border-4 flex items-start gap-3"
                style={{ 
                  borderColor: 'var(--destructive)',
                  backgroundColor: '#fee2e2',
                }}
              >
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-black text-destructive mb-1">Budget Exceeded!</p>
                  <p className="text-sm font-medium text-destructive/80">
                    You've spent {formatCurrency(Math.abs(remaining))} over your budget this month.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-4 space-y-1" style={{ borderColor: 'var(--neo-border)' }}>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-medium">Remaining</p>
                  </div>
                  <p className="text-xl font-black">{formatCurrency(remaining)}</p>
                </div>
                <div className="p-4 border-4 space-y-1" style={{ borderColor: 'var(--neo-border)' }}>
                  <p className="text-sm text-muted-foreground font-medium">Month</p>
                  <p className="text-lg font-black">{formatMonth(currentMonth)}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

