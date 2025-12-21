import { useState } from "react";

export default function AddArticleForm({ onAddArticle }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const t = title.trim();
    const x = text.trim();
    if (!t || !x) return;

    onAddArticle({ title: t, text: x });
    setTitle("");
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "12px 0", padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          placeholder="Article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Article text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minWidth: 320 }}
        />
        <button type="submit">Add article</button>
      </div>
    </form>
  );
}