import { promises as fs } from "fs";
import path from "path";

export type ReservationStatus = "new" | "in_progress" | "done" | "canceled";

export type Reservation = {
  id: string;
  ownerName: string;
  contact: string;
  dogName: string;
  dogBreed?: string;
  desiredAt: string;
  plan: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "reservations.json");

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf-8");
  }
}

export async function listReservations(): Promise<Reservation[]> {
  await ensureFile();
  const raw = await fs.readFile(dataFile, "utf-8");
  const items = JSON.parse(raw) as Reservation[];
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createReservation(
  input: Omit<Reservation, "id" | "createdAt" | "status">,
): Promise<Reservation> {
  const reservations = await listReservations();
  const next: Reservation = {
    id: crypto.randomUUID(),
    ...input,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  reservations.push(next);
  await fs.writeFile(dataFile, JSON.stringify(reservations, null, 2), "utf-8");
  return next;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<boolean> {
  const reservations = await listReservations();
  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) return false;

  reservations[index].status = status;
  await fs.writeFile(dataFile, JSON.stringify(reservations, null, 2), "utf-8");
  return true;
}
