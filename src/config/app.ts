import invariant from "tiny-invariant";

const { VITE_API_URL, VITE_API_SOCKET_URL } = import.meta.env;
invariant(
  VITE_API_URL && typeof VITE_API_URL === "string",
  "VITE_API_URL in undefined in .env"
);

export const apiUrl = VITE_API_URL;
