import { useState, useRef, useEffect } from "react";
import { Plus, Send, Shield, User, MessageSquare, Trash2 } from "lucide-react";
import { consultaNormativa } from "../services/ia.service";

const SUGERENCIAS = [
  "¿Cuáles son los 24 pasos del PESV según la Resolución 40595?",
  "Genera una política de seguridad vial para TransCor S.A.S.",
  "¿Qué exige la Resolución 40595 sobre capacitación de conductores?",
  "¿Cómo calcular los indicadores del Paso 20?",
  "Genera un acta de comité PESV de esta semana",
  "¿Qué sanciones aplican por incumplir el PESV en Colombia?",
];

const idNuevo = () => `chat_${Date.now()}`;

export default function AsistenteIA() {
  const [chats, setChats] = useState([{ id: idNuevo(), titulo: "Nueva conversación", mensajes: [] }]);
  const [chatActivo, setChatActivo] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const chat = chats.find((c) => c.id === chatActivo);
  const mensajes = chat?.mensajes || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, loading]);

  const nuevaConversacion = () => {
    const nuevo = { id: idNuevo(), titulo: "Nueva conversación", mensajes: [] };
    setChats((prev) => [nuevo, ...prev]);
    setChatActivo(nuevo.id);
  };

  const eliminarChat = (id) => {
    if (chats.length === 1) return;
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (chatActivo === id) setChatActivo(chats.find((c) => c.id !== id)?.id || "");
  };

  const enviar = async (texto) => {
    const msg = (texto || input).trim();
    if (!msg || loading) return;
    setInput("");

    const nuevosMensajes = [...mensajes, { role: "user", content: msg }];

    setChats((prev) => prev.map((c) => {
      if (c.id !== chatActivo) return c;
      const titulo = nuevosMensajes.length === 1 ? msg.slice(0, 45) + (msg.length > 45 ? "…" : "") : c.titulo;
      return { ...c, titulo, mensajes: nuevosMensajes };
    }));

    setLoading(true);
    try {
      const historial = nuevosMensajes.map((m) => ({ role: m.role, content: m.content }));
      const { data } = await consultaNormativa(historial);

      setChats((prev) => prev.map((c) => {
        if (c.id !== chatActivo) return c;
        return { ...c, mensajes: [...nuevosMensajes, { role: "assistant", content: data.respuesta }] };
      }));
    } catch (err) {
      const serverError = err.response?.data?.error || "";
      let errMsg;
      if (serverError.toLowerCase().includes("credit") || serverError.toLowerCase().includes("balance")) {
        errMsg = "La cuenta de Anthropic no tiene créditos. Ve a console.anthropic.com → Plans & Billing para recargar.";
      } else if (err.response?.status === 500 || serverError.includes("Connection")) {
        errMsg = "Error al conectar con la IA. Verifica la ANTHROPIC_API_KEY en el backend.";
      } else {
        errMsg = "Error al procesar tu consulta. Intenta nuevamente.";
      }
      setChats((prev) => prev.map((c) => {
        if (c.id !== chatActivo) return c;
        return { ...c, mensajes: [...nuevosMensajes, { role: "assistant", content: errMsg, isError: true }] };
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar historial */}
      <div
        className="hidden lg:flex flex-col border-r flex-shrink-0"
        style={{ width: 260, backgroundColor: "white", borderColor: "var(--border)" }}
      >
        <div className="p-4 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={nuevaConversacion}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Plus size={15} />
            Nueva conversación
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {chats.map((c) => (
            <div
              key={c.id}
              className="group flex items-center gap-2 px-3 py-2.5 rounded-lg mb-1 cursor-pointer transition-colors"
              style={{
                backgroundColor: chatActivo === c.id ? "var(--accent-light)" : "transparent",
                borderLeft: chatActivo === c.id ? "2px solid var(--accent)" : "2px solid transparent",
              }}
              onClick={() => setChatActivo(c.id)}
            >
              <MessageSquare size={13} style={{ color: chatActivo === c.id ? "var(--accent)" : "var(--text-muted)", flexShrink: 0 }} />
              <span
                className="text-xs flex-1 truncate"
                style={{ color: chatActivo === c.id ? "var(--accent)" : "var(--text-secondary)" }}
              >
                {c.titulo}
              </span>
              {chats.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); eliminarChat(c.id); }}
                  className="hidden group-hover:flex p-0.5 rounded hover:bg-gray-200"
                >
                  <Trash2 size={11} style={{ color: "var(--text-muted)" }} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Área de chat */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "var(--bg-page)" }}>
        {/* Header del chat */}
        <div className="px-6 py-4 bg-white border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: "var(--accent-light)" }}
          >
            <Shield size={16} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Asistente PESV — Claude</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Experto en Resolución 40595 de 2022 · TransCor S.A.S.</div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {mensajes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full pt-8">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{ backgroundColor: "var(--accent-light)" }}
              >
                <Shield size={32} style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Asistente PESV Digital
              </h2>
              <p className="text-sm text-center mb-8" style={{ color: "var(--text-muted)", maxWidth: 400 }}>
                Soy un experto en el Plan Estratégico de Seguridad Vial colombiano. Puedo ayudarte con la Resolución 40595, generar documentos, responder consultas normativas y más.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full" style={{ maxWidth: 560 }}>
                {SUGERENCIAS.map((s) => (
                  <button
                    key={s}
                    onClick={() => enviar(s)}
                    className="text-left p-3 rounded-xl border text-sm transition-all hover:border-blue-200 hover:bg-blue-50"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "white" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mensajes.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "var(--accent-light)" }}
                >
                  <Shield size={14} style={{ color: "var(--accent)" }} />
                </div>
              )}

              <div
                className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={{
                  backgroundColor: msg.role === "user" ? "var(--accent)" : msg.isError ? "var(--danger-bg)" : "white",
                  color: msg.role === "user" ? "white" : msg.isError ? "var(--danger)" : "var(--text-primary)",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  boxShadow: "var(--shadow)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <User size={14} color="white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start fade-in">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: "var(--accent-light)" }}>
                <Shield size={14} style={{ color: "var(--accent)" }} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white" style={{ borderRadius: "18px 18px 18px 4px", boxShadow: "var(--shadow)" }}>
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full pulse"
                      style={{ backgroundColor: "var(--accent)", animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 flex-shrink-0">
          <div
            className="flex items-end gap-3 p-3 rounded-2xl bg-white"
            style={{ boxShadow: "var(--shadow-hover)", border: "1px solid var(--border)" }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Consulta sobre el PESV, la Resolución 40595, o pide que genere un documento..."
              rows={1}
              style={{
                flex: 1, resize: "none", border: "none", outline: "none",
                fontSize: 14, lineHeight: 1.5, color: "var(--text-primary)",
                backgroundColor: "transparent", maxHeight: 120, overflowY: "auto",
              }}
            />
            <button
              onClick={() => enviar()}
              disabled={!input.trim() || loading}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all disabled:opacity-40"
              style={{ backgroundColor: "var(--accent)", flexShrink: 0 }}
            >
              <Send size={15} color="white" />
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Presiona Enter para enviar · Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
}
