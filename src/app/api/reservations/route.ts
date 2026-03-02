import { createReservation, updateReservationStatus } from "@/lib/reservations";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();

    await createReservation({
      ownerName: String(form.get("ownerName") || ""),
      contact: String(form.get("contact") || ""),
      dogName: String(form.get("dogName") || ""),
      dogBreed: String(form.get("dogBreed") || ""),
      desiredAt: String(form.get("desiredAt") || ""),
      plan: String(form.get("plan") || ""),
      notes: String(form.get("notes") || ""),
    });

    return NextResponse.redirect(new URL("/reserve?success=1", request.url));
  }

  const body = await request.json();
  const created = await createReservation(body);
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; status?: "new" | "in_progress" | "done" | "canceled" };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const ok = await updateReservationStatus(body.id, body.status);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
