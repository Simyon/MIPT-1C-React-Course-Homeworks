import { Link } from "react-router-dom";
import { setSort } from "../store/articlesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

function cutText(text, limit = 100) {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

export default function ArticlesPage() {
  const dispatch = useDispatch();
  const articles = useSelector((s) => s.articles.items);
  const isLoading = useSelector((s) => s.articles.isLoading);
  const sort = useSelector((s) => s.articles.sort);

  const sortedArticles = useMemo(() => {
    const copy = [...articles];
    if (sort === "date") copy.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "likes") copy.sort((a, b) => (b.currentLikes ?? 0) - (a.currentLikes ?? 0));
    return copy;
  }, [articles, sort]);

  if (isLoading) return <div style={{ padding: 16 }}>Loading articles...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Articles</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
        <button onClick={() => dispatch(setSort("date"))}>Sort by date</button>
        <button onClick={() => dispatch(setSort("likes"))}>Sort by likes</button>
        <button onClick={() => dispatch(setSort(null))}>Clear sort</button>
      </div>

      <ul style={{ paddingLeft: 18 }}>
        {sortedArticles.map((a) => (
          <li key={a.articleId} style={{ marginBottom: 12 }}>
            <div>
              <Link to={`/articles/${a.articleId}`}>
                <b>{a.title}</b>
              </Link>
            </div>
            <div style={{ opacity: 0.8 }}>{cutText(a.text, 100)}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Likes: {a.currentLikes} · Comments: {a.commentsCount}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}