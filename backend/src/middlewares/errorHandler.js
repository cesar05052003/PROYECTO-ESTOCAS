const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message, err.cause?.message || "", err.stack?.split("\n")[1] || "");

  if (err.name === "ZodError") {
    return res.status(400).json({ error: "Datos inválidos", detalles: err.errors });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ error: "Ya existe un registro con ese valor único" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Registro no encontrado" });
  }

  const status = err.status || err.statusCode || 500;
  let message = err.message || "Error interno del servidor";
  if (message.includes("credit balance") || message.includes("balance is too low")) {
    message = "credit balance too low";
  }
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
