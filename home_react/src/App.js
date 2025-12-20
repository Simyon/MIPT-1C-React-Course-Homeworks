import { useEffect, useMemo, useState } from "react";
import styles from "./App.module.scss";

import { getArticles } from "./helpers/get-articles";
import ArticleCard from "./components/ArticleCard";
import AddArticleForm from "./components/AddArticleForm";

function App() {
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  const [articlesSort, setArticlesSort] = useState(null); // <-- ключевая строка

  const [commentsByArticleId, setCommentsByArticleId] = useState({});

  useEffect(() => {
    setIsLoadingArticles(true);
    getArticles()
      .then((data) => {
        const normalized = data.map((a, idx) => ({
          ...a,
          createdAt: a.createdAt ?? Date.now() - (idx + 1) * 60_000,
        }));
        setArticles(normalized);
      })
      .finally(() => setIsLoadingArticles(false));
  }, []);

  const articleIds = useMemo(() => new Set(articles.map((a) => a.articleId)), [articles]);

  const sortedArticles = useMemo(() => {
    const copy = [...articles];
    if (articlesSort === "date") copy.sort((a, b) => b.createdAt - a.createdAt);
    if (articlesSort === "likes") copy.sort((a, b) => b.currentLikes - a.currentLikes);
    return copy;
  }, [articles, articlesSort]);

  const handleCommentsLoaded = (articleId, loadedComments) => {
    const normalized = loadedComments.map((c, idx) => ({
      ...c,
      commentId: c.commentId ?? `${articleId}-${idx}-${Date.now()}`,
      createdAt: c.createdAt ?? Date.now() - (idx + 1) * 30_000,
      likes: c.likes ?? 0,
    }));

    setCommentsByArticleId((prev) => ({ ...prev, [articleId]: normalized }));

    setArticles((prev) =>
      prev.map((a) =>
        a.articleId === articleId ? { ...a, commentsCount: normalized.length } : a
      )
    );
  };

  const handleAddComment = (articleId, newComment) => {
    const normalized = {
      ...newComment,
      commentId: newComment.commentId ?? `${articleId}-${Date.now()}`,
      createdAt: newComment.createdAt ?? Date.now(),
      likes: newComment.likes ?? 0,
    };

    setCommentsByArticleId((prev) => {
      const current = prev[articleId] ?? [];
      return { ...prev, [articleId]: [...current, normalized] };
    });

    setArticles((prev) =>
      prev.map((a) =>
        a.articleId === articleId ? { ...a, commentsCount: a.commentsCount + 1 } : a
      )
    );
  };

  const handleToggleCommentLike = (articleId, commentId, isNowLiked) => {
    setCommentsByArticleId((prev) => {
      const list = prev[articleId] ?? [];
      const next = list.map((c) => {
        if (c.commentId !== commentId) return c;
        const delta = isNowLiked ? 1 : -1;
        return { ...c, likes: Math.max(0, (c.likes ?? 0) + delta) };
      });
      return { ...prev, [articleId]: next };
    });
  };

  const handleEditCommentText = (articleId, commentId, nextText) => {
    setCommentsByArticleId((prev) => {
      const list = prev[articleId] ?? [];
      const next = list.map((c) => (c.commentId === commentId ? { ...c, text: nextText } : c));
      return { ...prev, [articleId]: next };
    });
  };

  const handleDeleteComment = (articleId, commentId) => {
    setCommentsByArticleId((prev) => {
      const list = prev[articleId] ?? [];
      const next = list.filter((c) => c.commentId !== commentId);
      return { ...prev, [articleId]: next };
    });

    setArticles((prev) =>
      prev.map((a) =>
        a.articleId === articleId
          ? { ...a, commentsCount: Math.max(0, a.commentsCount - 1) }
          : a
      )
    );
  };

  const handleAddArticle = ({ title, text }) => {
    const base = Date.now();
    const newId = articleIds.has(base) ? base + Math.floor(Math.random() * 1000) : base;

    const newArticle = {
      articleId: newId,
      title,
      text,
      currentLikes: 0,
      commentsCount: 0,
      createdAt: Date.now(),
    };

    setArticles((prev) => [newArticle, ...prev]);
    setCommentsByArticleId((prev) => ({ ...prev, [newId]: [] }));
  };

  const handleToggleArticleLike = (articleId, isNowLiked) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.articleId !== articleId) return a;
        const delta = isNowLiked ? 1 : -1;
        return { ...a, currentLikes: Math.max(0, a.currentLikes + delta) };
      })
    );
  };

  const handleEditArticleTitle = (articleId, nextTitle) => {
    setArticles((prev) =>
      prev.map((a) => (a.articleId === articleId ? { ...a, title: nextTitle } : a))
    );
  };

  const handleEditArticleText = (articleId, nextText) => {
    setArticles((prev) =>
      prev.map((a) => (a.articleId === articleId ? { ...a, text: nextText } : a))
    );
  };

  return (
    <div className={styles.root}>
      <h1>Articles</h1>

      <AddArticleForm onAddArticle={handleAddArticle} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
        <button onClick={() => setArticlesSort("date")}>Sort articles by date</button>
        <button onClick={() => setArticlesSort("likes")}>Sort articles by likes</button>
        <button onClick={() => setArticlesSort(null)}>Clear sort</button>
      </div>

      {isLoadingArticles ? (
        <div>Loading articles...</div>
      ) : (
        sortedArticles.map((article) => (
          <ArticleCard
            key={article.articleId}
            article={article}
            comments={commentsByArticleId[article.articleId]}
            onCommentsLoaded={handleCommentsLoaded}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onToggleCommentLike={handleToggleCommentLike}
            onEditCommentText={handleEditCommentText}
            onToggleArticleLike={handleToggleArticleLike}
            onEditArticleTitle={handleEditArticleTitle}
            onEditArticleText={handleEditArticleText}
          />
        ))
      )}
    </div>
  );
}

export default App;