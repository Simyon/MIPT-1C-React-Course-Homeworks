import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Navigate, Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";

export default function ArticlePage() {
  const { articleId } = useParams();
  const id = Number(articleId);

  const article = useSelector((s) => s.articles.items.find((a) => a.articleId === id));

  useEffect(() => {
    console.info(
      "[visit]",
      new Date().toISOString(),
      "visited article page",
      { articleId: id }
    );
  }, [id]);

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/articles">← Back to articles</Link>
      </div>

      <ArticleCard article={article} />
    </div>
  );
}