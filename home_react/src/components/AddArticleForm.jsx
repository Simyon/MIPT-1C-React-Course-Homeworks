import { useState } from "react";
import styles from "./AddArticleForm.module.scss";

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={styles.input}
        placeholder="Article text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className={styles.button} type="submit">
        Add article
      </button>
    </form>
  );
}