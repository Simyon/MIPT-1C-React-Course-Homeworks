import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { login, logout, getAuth, isAuthed, AUTH_LS_KEY } from "../auth-api";

async function ensureWebCrypto() {
  if (!globalThis.crypto?.subtle) {
    const mod = await import("crypto");
    globalThis.crypto = mod.webcrypto;
  }
}

function flushPromises() {
  return new Promise((r) => queueMicrotask(r));
}

describe("helpers/auth-api.js", () => {
  beforeEach(async () => {
    await ensureWebCrypto();
    vi.useFakeTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("login: resolves payload and writes to localStorage", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    vi.spyOn(Date, "now").mockReturnValue(1700000000000);

    // deterministic hash
    const digestSpy = vi
      .spyOn(globalThis.crypto.subtle, "digest")
      .mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);

    const p = login("admin", "admin"); 
    vi.advanceTimersByTime(500);
    await flushPromises();

    const payload = await p;

    expect(payload).toEqual({
      login: "admin",
      name: expect.any(String),
      tokenHash: "010203",
    });

    expect(digestSpy).toHaveBeenCalledTimes(1);

    const raw = window.localStorage.getItem(AUTH_LS_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw)).toEqual(payload);

    expect(isAuthed()).toBe(true);
    expect(getAuth()).toEqual(payload);
  });

  it("login: rejects on invalid credentials and does not write to localStorage", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    const p = login("no_such_user", "bad_pass");
    vi.advanceTimersByTime(500);
    await flushPromises();

    await expect(p).rejects.toThrow("Invalid login or password");
    expect(window.localStorage.getItem(AUTH_LS_KEY)).toBeNull();
    expect(isAuthed()).toBe(false);
  });

  it("login: rejects when randomFail triggers", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.0); 

    const p = login("admin", "admin");  
    vi.advanceTimersByTime(500);
    await flushPromises();

    await expect(p).rejects.toThrow("Mock auth API error");
    expect(window.localStorage.getItem(AUTH_LS_KEY)).toBeNull();
  });

  it("logout: removes auth payload from localStorage", () => {
    window.localStorage.setItem(
      AUTH_LS_KEY,
      JSON.stringify({ login: "x", name: "y", tokenHash: "z" })
    );

    logout();

    expect(window.localStorage.getItem(AUTH_LS_KEY)).toBeNull();
    expect(isAuthed()).toBe(false);
  });

  it("getAuth: returns null if missing", () => {
    expect(getAuth()).toBeNull();
  });

  it("getAuth: returns null on invalid JSON", () => {
    window.localStorage.setItem(AUTH_LS_KEY, "{not-json");
    expect(getAuth()).toBeNull();
    expect(isAuthed()).toBe(false);
  });
});