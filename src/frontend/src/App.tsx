import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function RouterError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Page error";
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h2
        style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}
      >
        Page Error
      </h2>
      <p style={{ color: "#666", maxWidth: "420px", marginBottom: "1rem" }}>
        {message}
      </p>
      <button
        type="button"
        onClick={() => window.location.assign("/")}
        style={{
          padding: "0.5rem 1.25rem",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        Go to Home
      </button>
    </div>
  );
}

function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h2
        style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}
      >
        Page Not Found
      </h2>
      <p style={{ color: "#666", maxWidth: "420px", marginBottom: "1rem" }}>
        The page you're looking for doesn't exist.
      </p>
      <button
        type="button"
        onClick={() => window.location.assign("/")}
        style={{
          padding: "0.5rem 1.25rem",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        Go to Home
      </button>
    </div>
  );
}

const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error }) => <RouterError error={error} />,
  defaultNotFoundComponent: () => <NotFound />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
