import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function getExpectedPassword() {
  return process.env.ADMIN_PASSWORD || "pocapoco_lin1013";
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return value === getExpectedPassword();
}

export async function login(password: string) {
  if (password !== getExpectedPassword()) return false;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, getExpectedPassword(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return true;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
