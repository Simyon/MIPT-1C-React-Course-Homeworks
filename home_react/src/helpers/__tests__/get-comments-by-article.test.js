import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { getComments } from "../get-comments-by-article";
import comments from "../../assets/data/comments.json";

function flushPromises() {
  return new Promise((r) => queueMicrotask(r));
}

describe("helpers/get-comments-by-article.js", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("getComments: resolves only comments for the given articleId", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    
    const existingId = comments[0]?.articleId;
    expect(existingId).toBeDefined();

    const expected = comments.filter((c) => c.articleId === existingId);

    const p = getComments(existingId);
    vi.advanceTimersByTime(1000);
    await flushPromises();

    await expect(p).resolves.toEqual(expected);
  });

  it("getComments: resolves empty array if no comments match articleId", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    const nonExistingId = "__no_such_article__";
    const p = getComments(nonExistingId);

    vi.advanceTimersByTime(1000);
    await flushPromises();

    await expect(p).resolves.toEqual([]);
  });

  it("getComments: rejects on failure probability and includes articleId in message", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.0);

    const p = getComments("a1");
    vi.advanceTimersByTime(1000);
    await flushPromises();

    await expect(p).rejects.toThrow("getComments failed (mock), articleId=a1");
  });
});
