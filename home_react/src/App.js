import { useEffect, useMemo, useState } from "react";
import styles from "./App.module.scss";

import { getArticles } from "./helpers/get-articles";
import ArticleCard from "./components/ArticleCard";
import AddArticleForm from "./components/AddArticleForm";

function App() {
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  const [commentsByArticleId, setCommentsByArticleId] = useState({});

  useEffect(() => {
    setIsLoadingArticles(true);
    getArticles()
      .then((data) => setArticles(data))
      .finally(() => setIsLoadingArticles(false));
  }, []);

  const articleIds = useMemo(() => new Set(articles.map((a) => a.articleId)), [articles]);

  const handleCommentsLoaded = (articleId, loadedComments) => {
    setCommentsByArticleId((prev) => ({
      ...prev,
      [articleId]: loadedComments,
    }));

    setArticles((prev) =>
      prev.map((a) =>
        a.articleId === articleId ? { ...a, commentsCount: loadedComments.length } : a
      )
    );
  };

  const handleAddComment = (articleId, newComment) => {
    setCommentsByArticleId((prev) => {
      const current = prev[articleId] ?? [];
      return { ...prev, [articleId]: [...current, newComment] };
    });

    setArticles((prev) =>
      prev.map((a) =>
        a.articleId === articleId ? { ...a, commentsCount: a.commentsCount + 1 } : a
      )
    );
  };

  const handleDeleteComment = (articleId, indexToDelete) => {
    setCommentsByArticleId((prev) => {
      const current = prev[articleId] ?? [];
      const next = current.filter((_, idx) => idx !== indexToDelete);
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
    };

    setArticles((prev) => [newArticle, ...prev]);
    setCommentsByArticleId((prev) => ({ ...prev, [newId]: [] }));
  };

  return (
    <div className={styles.root}>
      <h1>Articles</h1>

      <AddArticleForm onAddArticle={handleAddArticle} />

      {isLoadingArticles ? (
        <div>Loading articles...</div>
      ) : (
        articles.map((article) => (
          <ArticleCard
            key={article.articleId}
            article={article}
            comments={commentsByArticleId[article.articleId]}
            onCommentsLoaded={handleCommentsLoaded}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        ))
      )}
    </div>
  );
}

export default App;
