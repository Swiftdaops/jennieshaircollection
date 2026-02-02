function stripTrailingSlashes(url) {
  return String(url || "").replace(/\/+$/, "");
}

export function getApiBase() {
  const fromEnv = stripTrailingSlashes(process.env.NEXT_PUBLIC_API_URL);

  if (fromEnv) return fromEnv;

  // Dev-friendly default. In production, set NEXT_PUBLIC_API_URL.
  if (process.env.NODE_ENV === "development") return "http://localhost:5000";

  return "https://jennieshairsbackend.onrender.com";
}
