const prisma = require("../../config/db");
const bcrypt = require("bcryptjs");

const listar = async (req, res, next) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, nombre: true, email: true, rol: true, activo: true, createdAt: true },
    });
    res.json(usuarios);
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: "El email ya está registrado" });
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: bcrypt.hashSync(password, 10), rol: rol || "CONDUCTOR" },
    });
    const { password: _, ...sinPassword } = usuario;
    res.status(201).json(sinPassword);
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const { nombre, email, rol, activo, password } = req.body;
    const data = {};
    if (nombre) data.nombre = nombre;
    if (email) data.email = email;
    if (rol) data.rol = rol;
    if (activo !== undefined) data.activo = activo;
    if (password) data.password = bcrypt.hashSync(password, 10);
    const usuario = await prisma.usuario.update({ where: { id: req.params.id }, data });
    const { password: _, ...sinPassword } = usuario;
    res.json(sinPassword);
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
    await prisma.usuario.update({ where: { id: req.params.id }, data: { activo: false } });
    res.json({ ok: true });
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar, eliminar };
