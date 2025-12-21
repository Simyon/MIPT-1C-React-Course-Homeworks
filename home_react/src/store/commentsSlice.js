import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getComments } from "../helpers/get-comments-by-article";
import commentsJson from "../assets/data/comments.json";

function normalizeLoadedComments(articleId, list) {
  return list.map((c, idx) => ({
    ...c,
    articleId,
    commentId: c.commentId ?? `${articleId}-${idx}-${Date.now()}`,
    createdAt: c.createdAt ?? Date.now() - (idx + 1) * 30_000,
    likes: c.likes ?? 0,
  }));
}

function selectByArticleIdSync(articleId) {
  const list = commentsJson.filter((c) => c.articleId === articleId);
  return normalizeLoadedComments(articleId, list);
}

export const fetchCommentsByArticleId = createAsyncThunk(
  "comments/fetchByArticleId",
  async (articleId) => {
    const data = await getComments(articleId);
    return { articleId, comments: normalizeLoadedComments(articleId, data) };
  }
);

export const loadCommentsSync = (articleId) => ({
  type: "comments/loadCommentsSync",
  payload: { articleId, comments: selectByArticleIdSync(articleId) },
});

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    byArticleId: {},  
    isLoadingByArticleId: {},  
    sortByArticleId: {},  
    errorByArticleId: {},  
  },
  reducers: {
    setSort(state, action) {
      const { articleId, sort } = action.payload;
      state.sortByArticleId[articleId] = sort;
    },
    addComment(state, action) {
      const { articleId, author, text } = action.payload;
      const list = state.byArticleId[articleId] ?? [];
      const newComment = {
        articleId,
        author,
        text,
        commentId: `${articleId}-${Date.now()}`,
        createdAt: Date.now(),
        likes: 0,
      };
      state.byArticleId[articleId] = [...list, newComment];
    },
    deleteComment(state, action) {
      const { articleId, commentId } = action.payload;
      const list = state.byArticleId[articleId] ?? [];
      state.byArticleId[articleId] = list.filter((c) => c.commentId !== commentId);
    },
    toggleLike(state, action) {
      const { articleId, commentId, isNowLiked } = action.payload;
      const list = state.byArticleId[articleId] ?? [];
      const target = list.find((c) => c.commentId === commentId);
      if (!target) return;
      const delta = isNowLiked ? 1 : -1;
      target.likes = Math.max(0, (target.likes ?? 0) + delta);
    },
    editText(state, action) {
      const { articleId, commentId, text } = action.payload;
      const list = state.byArticleId[articleId] ?? [];
      const target = list.find((c) => c.commentId === commentId);
      if (!target) return;
      target.text = text;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByArticleId.pending, (state, action) => {
        const articleId = action.meta.arg;
        state.isLoadingByArticleId[articleId] = true;
        state.errorByArticleId[articleId] = null;
      })
      .addCase(fetchCommentsByArticleId.fulfilled, (state, action) => {
        const { articleId, comments } = action.payload;
        state.isLoadingByArticleId[articleId] = false;
        state.byArticleId[articleId] = comments;
      })
      .addCase(fetchCommentsByArticleId.rejected, (state, action) => {
        const articleId = action.meta.arg;
        state.isLoadingByArticleId[articleId] = false;
        state.errorByArticleId[articleId] = action.error?.message ?? "Failed to load comments";
      })
      .addCase("comments/loadCommentsSync", (state, action) => {
      const { articleId, comments } = action.payload;
      state.byArticleId[articleId] = comments;
      state.isLoadingByArticleId[articleId] = false;
      state.errorByArticleId[articleId] = null;
    });
  },
});

export const { setSort, addComment, deleteComment, toggleLike, editText } =
  commentsSlice.actions;

export default commentsSlice.reducer;
