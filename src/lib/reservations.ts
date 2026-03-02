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

type D1Result<T = unknown> = { results: T[] };
type D1Prepared = {
  bind: (...values: unknown[]) => { run: () => Promise<void>; all: <T = unknown>() => Promise<D1Result<T>> };
};
type D1DatabaseLike = { prepare: (query: string) => D1Prepared };

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

async function getD1(): Promise<D1DatabaseLike | null> {
  try {
    const cloudflare = await import("@opennextjs/cloudflare");
    const ctx = await cloudflare.getCloudflareContext({ async: true });
    const env = ctx.env as Record<string, unknown>;
    return (env.DB as D1DatabaseLike | undefined) ?? null;
  } catch {
    return null;
  }
}

async function ensureD1Table(db: D1DatabaseLike) {
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      owner_name TEXT NOT NULL,
      contact TEXT NOT NULL,
      dog_name TEXT NOT NULL,
      dog_breed TEXT,
      desired_at TEXT NOT NULL,
      plan TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
  ).bind().run();
}

export async function listReservations(): Promise<Reservation[]> {
  const db = await getD1();
  if (db) {
    await ensureD1Table(db);
    const rows = await db
      .prepare(
        `SELECT id, owner_name, contact, dog_name, dog_breed, desired_at, plan, notes, status, created_at
         FROM reservations
         ORDER BY created_at DESC`,
      )
      .bind()
      .all<{
        id: string;
        owner_name: string;
        contact: string;
        dog_name: string;
        dog_breed: string | null;
        desired_at: string;
        plan: string;
        notes: string | null;
        status: ReservationStatus;
        created_at: string;
      }>();

    return rows.results.map((r) => ({
      id: r.id,
      ownerName: r.owner_name,
      contact: r.contact,
      dogName: r.dog_name,
      dogBreed: r.dog_breed ?? "",
      desiredAt: r.desired_at,
      plan: r.plan,
      notes: r.notes ?? "",
      status: r.status,
      createdAt: r.created_at,
    }));
  }

  await ensureFile();
  const raw = await fs.readFile(dataFile, "utf-8");
  const items = JSON.parse(raw) as Reservation[];
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createReservation(
  input: Omit<Reservation, "id" | "createdAt" | "status">,
): Promise<Reservation> {
  const next: Reservation = {
    id: crypto.randomUUID(),
    ...input,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  const db = await getD1();
  if (db) {
    await ensureD1Table(db);
    await db
      .prepare(
        `INSERT INTO reservations (id, owner_name, contact, dog_name, dog_breed, desired_at, plan, notes, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        next.id,
        next.ownerName,
        next.contact,
        next.dogName,
        next.dogBreed || "",
        next.desiredAt,
        next.plan,
        next.notes || "",
        next.status,
        next.createdAt,
      )
      .run();
    return next;
  }

  const reservations = await listReservations();
  reservations.push(next);
  await fs.writeFile(dataFile, JSON.stringify(reservations, null, 2), "utf-8");
  return next;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<boolean> {
  const db = await getD1();
  if (db) {
    await ensureD1Table(db);
    const existing = await db
      .prepare("SELECT id FROM reservations WHERE id = ?")
      .bind(id)
      .all<{ id: string }>();
    if (existing.results.length === 0) return false;

    await db.prepare("UPDATE reservations SET status = ? WHERE id = ?").bind(status, id).run();
    return true;
  }

  const reservations = await listReservations();
  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) return false;

  reservations[index].status = status;
  await fs.writeFile(dataFile, JSON.stringify(reservations, null, 2), "utf-8");
  return true;
}
