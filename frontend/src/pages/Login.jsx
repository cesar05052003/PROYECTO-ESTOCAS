import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { login } from "../services/auth.service";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await login(email, password);
      setAuth(data.user, data.token);
      if (rememberMe) {
        localStorage.setItem('pesv_remember_email', email);
      } else {
        localStorage.removeItem('pesv_remember_email');
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(180deg, #0F1923 0%, #1A2C3D 100%)" }}
    >
      <div className="w-full" style={{ maxWidth: 420 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Shield size={28} color="white" />
          </div>
          <h1 className="text-2xl font-semibold text-white">PESV Digital</h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            Plan Estratégico de Seguridad Vial
          </p>
          <p className="text-xs mt-1" style={{ color: "#64748B" }}>
            Resolución 40595 de 2022 — Ministerio de Transporte
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 relative" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)", animation: "fadeInUp 0.6s ease-out" }}>
          {/* Botón Volver */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Bienvenido
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Ingresa con tus credenciales corporativas
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@pesv.co"
                className="w-full px-3 py-2.5 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--bg-input)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm pr-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-blue-600 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-700 mt-2 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Checkbox Recordarme */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <label htmlFor="remember" className="text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                Recordarme en este dispositivo
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white mt-2 transition-all disabled:opacity-70"
              style={{ backgroundColor: "var(--accent)" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                  Ingresando...
                </span>
              ) : "Ingresar al sistema"}
            </button>
          </form>

          {/* Separador visual */}
          <div className="my-6">
            <div className="w-full border-t" style={{ borderColor: "var(--border)" }}></div>
          </div>

          {/* Credenciales demo */}
          <div className="mt-2">
            <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>
              CREDENCIALES DE DEMOSTRACIÓN
            </p>
            <div className="space-y-1.5">
              {[
                { email: "admin@pesv.co", pwd: "admin123", rol: "Admin" },
                { email: "lider@pesv.co", pwd: "lider123", rol: "Líder PESV" },
                { email: "gerente@pesv.co", pwd: "gerente123", rol: "Gerente" },
              ].map((c) => (
                <button
                  key={c.email}
                  type="button"
                  onClick={() => { setEmail(c.email); setPassword(c.pwd); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-gray-50"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="font-medium">{c.rol}:</span>{" "}
                  <span style={{ color: "var(--text-muted)" }}>{c.email} / {c.pwd}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#475569" }}>
          TransCor S.A.S. · Sistema PESV Digital v1.0
        </p>
      </div>
    </div>
  );
}
