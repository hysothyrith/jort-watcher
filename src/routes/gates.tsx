import { MaxWidthBox } from "../components/MaxWidthBox";

export default function Gates() {
  return (
    <div className="mt-8">
      <MaxWidthBox>
        <h1 className="prose prose-2xl font-semibold">Gate</h1>

        <form>
          <div className="mb-4"></div>
          <input
            type="text"
            className="rounded-md py-2 px-2 border border-gray-300"
          />
          <br />
          <div className="mb-2"></div>
          <button
            className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded-md border border-gray-300 transition-colors"
            type="submit"
          >
            Connect
          </button>
        </form>
      </MaxWidthBox>
    </div>
  );
}
