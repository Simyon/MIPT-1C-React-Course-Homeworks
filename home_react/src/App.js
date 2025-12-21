import { addArticle, fetchArticles, setSort } from "./store/articlesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

import ArticleCard from "./components/ArticleCard";
import AddArticleForm from "./components/AddArticleForm";
import styles from "./App.module.scss";

function App() {
  const dispatch = useDispatch();
  const articles = useSelector((s) => s.articles.items);
  const isLoading = useSelector((s) => s.articles.isLoading);
  const sort = useSelector((s) => s.articles.sort);
  
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);
  
  const sortedArticles = useMemo(() => {
    const copy = [...articles];
    if (sort === "date") copy.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "likes") copy.sort((a, b) => (b.currentLikes ?? 0) - (a.currentLikes ?? 0));
    return copy;
  }, [articles, sort]);

  const handleAddArticle = ({ title, text }) => {
    const newArticle = {
      articleId: Date.now(),
      title,
      text,
      currentLikes: 0,
      commentsCount: 0,
      createdAt: Date.now(),
    };
    dispatch(addArticle(newArticle));
  };

  return (
    <div className={styles.root}>
      <h1>Articles</h1>

      <AddArticleForm onAddArticle={handleAddArticle} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
        <button onClick={() => dispatch(setSort("date"))}>Sort articles by date</button>
        <button onClick={() => dispatch(setSort("likes"))}>Sort articles by likes</button>
        <button onClick={() => dispatch(setSort(null))}>Clear sort</button>
      </div>

      {isLoading ? (
        <div>Loading articles...</div>
      ) : (
        sortedArticles.map((article) => <ArticleCard key={article.articleId} article={article} />)
      )}
    </div>
  );
}

export default App;