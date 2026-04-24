import { Schema, model, Document, Types } from 'mongoose';

export interface IExpense extends Document {
  userId: Types.ObjectId;
  amount: number;
  category: string;
  description: string;
  date: string;
  idempotency_key: string;
  created_at: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    date: { type: String, required: true },
    idempotency_key: { type: String, required: true, unique: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
);

ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ date: -1 });

export const Expense = model<IExpense>('Expense', ExpenseSchema);
