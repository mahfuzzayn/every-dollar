import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  month: string; // Format: "YYYY-MM"
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget amount must be positive'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries - one budget per user per month
BudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

// Prevent re-compilation during development
const Budget: Model<IBudget> =
  mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;

