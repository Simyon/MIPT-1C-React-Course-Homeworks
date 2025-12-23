import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "../store/authSlice";

const initial = { login: "", password: "" };

function reducer(state, action) {
  switch (action.type) {
    case "setLogin":
      return { ...state, login: action.payload };
    case "setPassword":
      return { ...state, password: action.payload };
    case "reset":
      return initial;
    default:
      return state;
  }
}

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth.user);
  const isLoading = useSelector((s) => s.auth.isLoading);
  const error = useSelector((s) => s.auth.error);

  const [form, formDispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (user) navigate("/articles", { replace: true });
  }, [user, navigate]);

  const submit = (e) => {
    e.preventDefault();
    const l = form.login.trim();
    const p = form.password.trim();
    if (!l || !p) return;

    dispatch(loginThunk({ login: l, password: p }))
      .unwrap()
      .then(() => {
        formDispatch({ type: "reset" });
      })
      .catch((err) => {
        console.error("[auth error]", new Date().toISOString(), { login: l }, err);
      });
  };

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h1>Auth</h1>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          placeholder="login"
          value={form.login}
          onChange={(e) => formDispatch({ type: "setLogin", payload: e.target.value })}
        />
        <input
          placeholder="password"
          type="password"
          value={form.password}
          onChange={(e) => formDispatch({ type: "setPassword", payload: e.target.value })}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error && <div style={{ marginTop: 10, color: "crimson" }}>{error}</div>}

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        Test users: admin/admin123, user/user123
      </div>
    </div>
  );
}