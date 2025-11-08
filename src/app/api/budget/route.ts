import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/monogdb';
import Budget from '@/models/Budget';
import { verifyAuth } from '@/lib/auth';

// GET route - Fetch current month's budget
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const user = verifyAuth(request);

    // Get current month in YYYY-MM format
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const budget = await Budget.findOne({
      userId: user.userId,
      month: currentMonth,
    }).lean();

    return NextResponse.json(
      {
        message: 'Budget fetched successfully',
        data: budget || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching budget:', error);

    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json(
        {
          message: 'Authentication error',
          error: error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Error fetching budget',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST route - Create or update budget for current month
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const user = verifyAuth(request);

    const body = await request.json();
    const { amount } = body;

    // Validation
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      return NextResponse.json(
        {
          message: 'Validation error',
          error: 'Amount must be a positive number',
        },
        { status: 400 }
      );
    }

    // Get current month in YYYY-MM format
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Find existing budget or create new one
    const budget = await Budget.findOneAndUpdate(
      {
        userId: user.userId,
        month: currentMonth,
      },
      {
        userId: user.userId,
        amount,
        month: currentMonth,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        message: 'Budget saved successfully',
        data: budget,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving budget:', error);

    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json(
        {
          message: 'Authentication error',
          error: error.message,
        },
        { status: 401 }
      );
    }

    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        {
          message: 'Budget already exists',
          error: 'A budget for this month already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: 'Error saving budget',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

