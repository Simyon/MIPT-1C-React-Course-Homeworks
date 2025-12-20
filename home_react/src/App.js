import "./App.css";
import data from "./assets/mock-data.json";
import CardItem from "./components/CardItem";

function App() {
  return (
    <div className="App">
      <h1>Articles</h1>

      {data.map((item, index) => (
        <CardItem key={`${item.title}-${index}`} item={item} />
      ))}
    </div>
  );
}

export default App;
