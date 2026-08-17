import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validation";

// POST /api/orders — submit a new order from the mission control form
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  try {
    const order = await prisma.order.create({
      data: {
        projectName: data.projectName,
        email: data.email,
        objective: data.objective,
        sector: data.sector,
        budgetUsd: data.budgetUsd,
        timelineDays: data.timelineDays,
        references: data.references || null,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Failed to create order:", err);
    return NextResponse.json({ error: "Could not save order" }, { status: 500 });
  }
}

// GET /api/orders — list orders, protected by ADMIN_TOKEN header for the admin panel
export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
