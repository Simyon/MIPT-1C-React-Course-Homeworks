import { fetchArticles } from "./store/articlesSlice";
import { logout } from "./store/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import ArticlesPage from "./pages/ArticlesPage";
import ArticlePage from "./pages/ArticlePage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./App.module.scss";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchArticles()).unwrap().catch((err) => {
      console.error("[api error]", new Date().toISOString(), "fetchArticles", err);
    });
  }, [dispatch]);

  return (
    <div className={styles.applicationHolder}>
      <div style={{ padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>
        <Link to="/articles">Articles</Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          {user ? (
            <>
              <span style={{ fontSize: 12, opacity: 0.8 }}>
                {user.name} ({user.login})
              </span>
              <button onClick={() => dispatch(logout())}>Logout</button>
            </>
          ) : (
            <Link to="/auth">Login</Link>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:articleId" element={<ArticlePage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

export default App;