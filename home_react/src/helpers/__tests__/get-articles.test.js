import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { getArticles } from "../get-articles";
import articles from "../../assets/data/articles.json";

function flushPromises() {
  return new Promise((r) => queueMicrotask(r));
}

describe("helpers/get-articles.js", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("getArticles: resolves articles on success", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    const p = getArticles();
    vi.advanceTimersByTime(1500);
    await flushPromises();

    await expect(p).resolves.toEqual(articles);
  });

  it("getArticles: rejects on failure probability", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.0);

    const p = getArticles();
    vi.advanceTimersByTime(1500);
    await flushPromises();

    await expect(p).rejects.toThrow("getArticles failed (mock)");
  });
});