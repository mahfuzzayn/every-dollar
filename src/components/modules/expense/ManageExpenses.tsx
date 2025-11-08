"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Edit2, Trash2, Filter, X } from "lucide-react";
import AddExpense from "./AddExpense";
import EditExpenseDialog from "./EditExpenseDialog";
import { useExpense } from "@/contexts/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/types";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
];

const ManageExpenses = () => {
  const {
    expenses,
    filteredExpenses,
    isLoading,
    deleteExpense,
    filterByCategory,
    filterByMonth,
    selectedCategory,
    selectedMonth,
  } = useExpense();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Get unique months from all expenses (not filtered)
  const getAvailableMonths = () => {
    const months = new Set<string>();
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete._id);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-orange-400 text-black border-black",
      Transport: "bg-blue-400 text-black border-black",
      Shopping: "bg-pink-400 text-black border-black",
      Bills: "bg-red-400 text-black border-black",
      Entertainment: "bg-purple-400 text-black border-black",
      Healthcare: "bg-green-400 text-black border-black",
      Education: "bg-indigo-400 text-black border-black",
      Travel: "bg-yellow-400 text-black border-black",
      Other: "bg-gray-300 text-black border-black",
    };
    return colors[category] || colors.Other;
  };

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="w-full space-y-8">
      {/* Add Expense Section */}
      <Card className="bg-white">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-2xl font-black">Add New Expense</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <AddExpense />
        </CardContent>
      </Card>

      {/* Expenses List Section */}
      <Card className="bg-white">
        <CardHeader className="px-8 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <CardTitle className="text-2xl font-black">Your Expenses</CardTitle>
              <p className="text-base text-muted-foreground mt-2 font-medium">
                {filteredExpenses.length} expense
                {filteredExpenses.length !== 1 ? "s" : ""} • Total:{" "}
                <span className="font-black text-black">{formatCurrency(totalAmount)}</span>
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) =>
                  filterByCategory(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedMonth || "all"}
                onValueChange={(value) =>
                  filterByMonth(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {getAvailableMonths().map((month) => {
                    const [year, monthNum] = month.split("-");
                    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                    return (
                      <SelectItem key={month} value={month}>
                        {format(date, "MMMM yyyy")}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {(selectedCategory || selectedMonth) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    filterByCategory(null);
                    filterByMonth(null);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-muted-foreground font-bold text-lg">Loading expenses...</div>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-muted-foreground mb-3 font-bold text-lg">
                {selectedCategory || selectedMonth
                  ? "No expenses match your filters"
                  : "No expenses yet"}
              </div>
              <p className="text-base text-muted-foreground font-medium">
                {selectedCategory || selectedMonth
                  ? "Try adjusting your filters or add a new expense"
                  : "Add your first expense to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense._id}>
                        <TableCell className="font-medium">
                          {expense.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(expense.category)}
                          >
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(expense.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(expense)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredExpenses.map((expense) => (
                  <Card key={expense._id} className="bg-white">
                    <CardContent className="pt-6 px-6 pb-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="font-black text-xl mb-2">
                            {expense.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(expense.category)}
                          >
                            {expense.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-xl">
                            {formatCurrency(expense.amount)}
                          </div>
                          <div className="text-sm text-muted-foreground font-medium">
                            {format(new Date(expense.date), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4 border-t-4 border-black">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(expense)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDeleteClick(expense)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditExpenseDialog
        expense={editingExpense}
        open={!!editingExpense}
        onOpenChange={(open) => !open && setEditingExpense(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense "{expenseToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageExpenses;
