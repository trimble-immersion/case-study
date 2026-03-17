import { NextRequest, NextResponse } from "next/server";
import { createChange } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, labor, materials, equipment } = body;
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof labor !== "number" ||
      typeof materials !== "number" ||
      typeof equipment !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }
    const change = createChange({
      title,
      description,
      labor,
      materials,
      equipment,
    });
    return NextResponse.json(change);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create change" },
      { status: 500 }
    );
  }
}
