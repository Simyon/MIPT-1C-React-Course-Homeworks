import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getArticles } from "../helpers/get-articles";
import articlesJson from "../assets/data/articles.json";

function normalizeArticles(list) {
  return list.map((a, idx) => ({
    ...a,
    createdAt: a.createdAt ?? Date.now() - (idx + 1) * 60_000,
  }));
}

export const fetchArticles = createAsyncThunk("articles/fetchArticles", async () => {
  const data = await getArticles();
  return normalizeArticles(data);
});

export const loadArticlesSync = () => ({
  type: "articles/loadArticlesSync",
  payload: normalizeArticles(articlesJson),
});

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    sort: null, 
  },
  reducers: {
    setSort(state, action) {
      state.sort = action.payload;
    },
    addArticle(state, action) {
      state.items.unshift(action.payload);
    },
    toggleLike(state, action) {
      const { articleId, isNowLiked } = action.payload;
      const target = state.items.find((a) => a.articleId === articleId);
      if (!target) return;
      const delta = isNowLiked ? 1 : -1;
      target.currentLikes = Math.max(0, (target.currentLikes ?? 0) + delta);
    },
    editTitle(state, action) {
      const { articleId, title } = action.payload;
      const target = state.items.find((a) => a.articleId === articleId);
      if (!target) return;
      target.title = title;
    },
    editText(state, action) {
      const { articleId, text } = action.payload;
      const target = state.items.find((a) => a.articleId === articleId);
      if (!target) return;
      target.text = text;
    },
    incrementCommentsCount(state, action) {
      const articleId = action.payload;
      const target = state.items.find((a) => a.articleId === articleId);
      if (!target) return;
      target.commentsCount = (target.commentsCount ?? 0) + 1;
    },
    decrementCommentsCount(state, action) {
      const articleId = action.payload;
      const target = state.items.find((a) => a.articleId === articleId);
      if (!target) return;
      target.commentsCount = Math.max(0, (target.commentsCount ?? 0) - 1);
    },
    setCommentsCount(state, action) {
      const { articleId, count } = action.payload;
      const target = state.items.find((a) => a.articleId === articleId);
      if (!target) return;
      target.commentsCount = count;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? "Failed to load articles";
      })
      .addCase("articles/loadArticlesSync", (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    });
  },
});

export const {
  setSort,
  addArticle,
  toggleLike,
  editTitle,
  editText,
  incrementCommentsCount,
  decrementCommentsCount,
  setCommentsCount,
} = articlesSlice.actions;

export default articlesSlice.reducer;
