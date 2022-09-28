import { Link, Outlet } from "react-router-dom";
import { MaxWidthBox } from "../components/MaxWidthBox";
import { Toaster } from "react-hot-toast";

export default function Root() {
  return (
    <div className="h-full flex flex-col">
      <Toaster />
      <div className="border-solid border-b border-gray-200 py-1.5">
        <MaxWidthBox>
          <Link to={`/`} className="prose prose-lg font-semibold">
            Jort
          </Link>
        </MaxWidthBox>
      </div>
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
}
