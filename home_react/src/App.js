import { addArticle, fetchArticles } from "./store/articlesSlice";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import styles from "./App.module.scss";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArticles())
      .unwrap()
      .catch((err) => {
        console.error("[api error]", new Date().toISOString(), "fetchArticles", err);
      });
  }, [dispatch]);

  const handleAddArticle = useCallback(
    ({ title, text }) => {
      const newArticle = {
        articleId: Date.now(),
        title,
        text,
        currentLikes: 0,
        commentsCount: 0,
        createdAt: Date.now(),
      };
      dispatch(addArticle(newArticle));
    },
    [dispatch]
  );

  return (
    <div className={styles.applicationHolder}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:articleId" element={<ArticlePage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

export default App;