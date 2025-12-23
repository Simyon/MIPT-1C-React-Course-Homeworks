import { useReducer } from "react";
import styles from "./AddArticleForm.module.scss";

const initialState = { title: "", text: "" };

function reducer(state, action) {
  switch (action.type) {
    case "setTitle":
      return { ...state, title: action.payload };
    case "setText":
      return { ...state, text: action.payload };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export default function AddArticleForm({ onAddArticle }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = state.title.trim();
    const x = state.text.trim();
    if (!t || !x) return;

    onAddArticle({ title: t, text: x });
    dispatch({ type: "reset" });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Article title"
        value={state.title}
        onChange={(e) => dispatch({ type: "setTitle", payload: e.target.value })}
      />
      <input
        className={styles.input}
        placeholder="Article text"
        value={state.text}
        onChange={(e) => dispatch({ type: "setText", payload: e.target.value })}
      />
      <button className={styles.button} type="submit">
        Add article
      </button>
    </form>
  );
}