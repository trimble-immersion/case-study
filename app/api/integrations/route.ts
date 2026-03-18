import { NextResponse } from "next/server";
import { listConnections } from "@/lib/services";

export async function GET() {
  const connections = listConnections();
  return NextResponse.json(connections);
}
