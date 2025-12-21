import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./articlesSlice";
import commentsReducer from "./commentsSlice";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    comments: commentsReducer,
  },
});
