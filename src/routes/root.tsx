import { Link, Outlet } from "react-router-dom";
import { MaxWidthBox } from "../components/MaxWidthBox";

export default function Root() {
  return (
    <div>
      <div className="border-solid border-b border-gray-200 py-1">
        <MaxWidthBox>
          <Link to={`/`} className="prose prose-lg font-semibold">
            Jort
          </Link>
        </MaxWidthBox>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
