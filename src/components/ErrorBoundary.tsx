import { Component, type ErrorInfo, type ReactNode } from "react";

interface State { error: Error | null }

/** Evita la "pantalla en blanco": si algo falla, muestra un mensaje y permite recuperar. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info.componentStack);
  }

  clearCacheAndReload = () => {
    try { localStorage.removeItem("dp-data-v1"); } catch {}
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui, sans-serif", background: "#f4f8fc", color: "#2b3f5c" }}>
        <div style={{ maxWidth: 440, textAlign: "center", background: "#fff", padding: 32, borderRadius: 24, boxShadow: "0 10px 40px -15px rgba(40,100,180,.3)" }}>
          <div style={{ fontSize: 42 }}>🦷</div>
          <h1 style={{ fontSize: 22, margin: "12px 0 8px" }}>Algo salió mal</h1>
          <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
            Ocurrió un error inesperado. Puedes recargar la página; si persiste, limpia la memoria local.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            <button onClick={() => window.location.reload()} style={{ padding: "10px 20px", borderRadius: 999, border: 0, background: "#3b82d6", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Recargar</button>
            <button onClick={this.clearCacheAndReload} style={{ padding: "10px 20px", borderRadius: 999, border: "1.5px solid #3b82d6", background: "transparent", color: "#3b82d6", fontWeight: 600, cursor: "pointer" }}>Limpiar memoria y recargar</button>
          </div>
        </div>
      </div>
    );
  }
}
