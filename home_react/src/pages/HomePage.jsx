import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Home page</h1>
      <p>This is the home page.</p>

      <div style={{ marginTop: 12 }}>
        <Link to="/articles">Go to articles</Link>
      </div>
    </div>
  );
}