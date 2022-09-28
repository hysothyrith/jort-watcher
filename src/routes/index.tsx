import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="h-full">
      <div className="flex h-full justify-center items-center">
        <div className="rounded-md border border-gray-100 p-6 w-96 drop-shadow-lg bg-white -translate-y-16">
          <Link to={`/gates`}>
            <span className="transition-colors duration-100 block border border-gray-200 hover:border-gray-300 hover:bg-gray-100 rounded-md p-2 mb-2 shadow-sm">
              Gate
            </span>
          </Link>
          <Link to={`/stats`}>
            <span className="transition-colors duration-100 block border border-gray-200 hover:border-gray-300 hover:bg-gray-100 rounded-md p-2 shadow-sm">
              Statistics
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
