import users from "../assets/data/users.json";

const AUTH_DELAY = 500;
const FAIL_PROBABILITY = 0.05;

const LS_KEY = "auth_v1";  

function randomFail() {
  if (Math.random() < FAIL_PROBABILITY) {
    throw new Error("Mock auth API error");
  }
}

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function login(login, password) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        randomFail();

        const found = users.find((u) => u.login === login && u.password === password);
        if (!found) {
          reject(new Error("Invalid login or password"));
          return;
        }
        
        const rawToken = `${found.login}:${found.name}:${Date.now()}`;
        const tokenHash = await sha256(rawToken);

        const payload = {
          login: found.login,
          name: found.name,
          tokenHash,
        };

        window.localStorage.setItem(LS_KEY, JSON.stringify(payload));
        resolve(payload);
      } catch (e) {
        reject(e);
      }
    }, AUTH_DELAY);
  });
}

export function logout() {
  window.localStorage.removeItem(LS_KEY);
}

export function getAuth() {
  const raw = window.localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthed() {
  return !!getAuth();
}

export const AUTH_LS_KEY = LS_KEY;