import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
      <h1>Jort</h1>
      <Link to={`/gates`}>Gate</Link>
      <Link to={`/stats`}>Statistics</Link>
    </>
  );
}
