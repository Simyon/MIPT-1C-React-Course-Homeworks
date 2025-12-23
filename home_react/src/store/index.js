import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./articlesSlice";
import authReducer from "./authSlice";
import commentsReducer from "./commentsSlice";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    comments: commentsReducer,
    auth: authReducer,
  },
});
