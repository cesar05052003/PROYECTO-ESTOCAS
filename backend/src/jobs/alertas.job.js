const cron = require("node-cron");
const prisma = require("../config/db");

const verificarVencimientos = async () => {
  console.log("[Alertas] Verificando vencimientos...", new Date().toISOString());
  const hoy = new Date();

  try {
    // ─── Vehículos ────────────────────────────────────────
    const vehiculos = await prisma.vehiculo.findMany();

    for (const v of vehiculos) {
      const checkDoc = async (tipo, fecha, campo) => {
        const dias = Math.ceil((new Date(fecha) - hoy) / (1000 * 60 * 60 * 24));
        if (dias > 30) return;

        const tipoAlerta = dias <= 0 ? `${tipo}_VENCIDO` : `${tipo}_PROXIMO`;
        const mensajeBase = dias <= 0
          ? `Vehículo ${v.placa}: ${campo} VENCIDO hace ${Math.abs(dias)} días`
          : `Vehículo ${v.placa}: ${campo} vence en ${dias} días`;

        const existente = await prisma.alerta.findFirst({
          where: { entidadId: v.id, tipo: tipoAlerta, leida: false },
        });
        if (!existente) {
          await prisma.alerta.create({
            data: { tipo: tipoAlerta, mensaje: mensajeBase, entidadId: v.id, entidadTipo: "Vehiculo", diasRestantes: dias },
          });
        }
      };

      await checkDoc("SOAT", v.soatVencimiento, "SOAT");
      await checkDoc("TECNOMECANICA", v.tecnomecanicaVencimiento, "Revisión técnico-mecánica");
    }

    // ─── Conductores ─────────────────────────────────────
    const conductores = await prisma.conductor.findMany({ include: { usuario: { select: { nombre: true } } } });

    for (const c of conductores) {
      const dias = Math.ceil((new Date(c.licenciaVencimiento) - hoy) / (1000 * 60 * 60 * 24));
      if (dias > 30) continue;

      const tipoAlerta = dias <= 0 ? "LICENCIA_VENCIDA" : "LICENCIA_PROXIMA";
      const mensaje = dias <= 0
        ? `Conductor ${c.usuario.nombre}: Licencia VENCIDA hace ${Math.abs(dias)} días`
        : `Conductor ${c.usuario.nombre}: Licencia vence en ${dias} días`;

      const existente = await prisma.alerta.findFirst({
        where: { entidadId: c.id, tipo: tipoAlerta, leida: false },
      });
      if (!existente) {
        await prisma.alerta.create({
          data: { tipo: tipoAlerta, mensaje, entidadId: c.id, entidadTipo: "Conductor", diasRestantes: dias },
        });
      }
    }

    // ─── Incidentes sin investigar ─────────────────────────
    const hace7dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    const incidentesSinInvestigar = await prisma.incidente.findMany({
      where: { estado: "REPORTADO", createdAt: { lte: hace7dias } },
    });

    for (const inc of incidentesSinInvestigar) {
      const existente = await prisma.alerta.findFirst({
        where: { entidadId: inc.id, tipo: "INCIDENTE_SIN_INVESTIGAR", leida: false },
      });
      if (!existente) {
        await prisma.alerta.create({
          data: {
            tipo: "INCIDENTE_SIN_INVESTIGAR",
            mensaje: `Incidente del ${new Date(inc.fecha).toLocaleDateString("es-CO")} en ${inc.lugar} lleva más de 7 días sin investigación`,
            entidadId: inc.id, entidadTipo: "Incidente", diasRestantes: null,
          },
        });
      }
    }

    console.log("[Alertas] Verificación completada");
  } catch (err) {
    console.error("[Alertas] Error:", err.message);
  }
};

const iniciarJobAlertas = () => {
  // Ejecutar diariamente a las 6:00 AM
  cron.schedule("0 6 * * *", verificarVencimientos, { timezone: "America/Bogota" });
  console.log("[Alertas] Job programado: diariamente a las 6:00 AM (hora Bogotá)");
};

module.exports = { iniciarJobAlertas, verificarVencimientos };
