# 🏠 Homepage PESV Digital - Guía Rápida de Instalación

## ✅ Requisitos Previos

- Node.js 16+ instalado
- npm o yarn
- Git
- Cuenta en Cloudinary (para imágenes)

## 📦 Instalación

### 1. Ir al directorio del frontend

```bash
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El sitio estará disponible en: `http://localhost:5173`

## 🎨 Archivos Creados

| Archivo | Descripción |
|---------|------------|
| `src/pages/Homepage.jsx` | Página principal del sitio |
| `src/components/layout/Navbar.jsx` | Barra de navegación |
| `src/components/layout/Footer.jsx` | Pie de página |
| `src/config/cloudinary.js` | Configuración de imágenes |
| `HOMEPAGE_GUIDE.md` | Guía de personalización |

## 🚀 Iniciar el Desarrollo

```bash
# Desde la carpeta raíz del proyecto
cd frontend
npm run dev

# El navegador debería abrirse automáticamente en http://localhost:5173
```

## 🎯 Características Implementadas

✨ **Header/Navbar**
- Logo moderno con icono de escudo
- Botones de "Iniciar Sesión" y "Registrarse"
- Efectos hover elegantes
- Menú responsive para móvil

📱 **Hero Section**
- Imagen de fondo profesional
- Overlay gradiente oscuro
- Título y subtítulo con efectos
- Botones de CTA (Call to Action)
- Indicador de scroll animado

📊 **Sección de Niveles**
- 3 tarjetas profesionales
- Gradientes personalizados
- Animaciones al hover
- Listados de características
- Botones de acción

🔧 **Componentes Clave**
- 6 tarjetas con componentes del PESV
- Iconos modernos de Lucide
- Grid responsive
- Efectos hover suaves

📧 **Footer**
- Información de contacto
- Enlaces rápidos
- Redes sociales
- Copyright automático

## 🎨 Personalización Rápida

### Cambiar colores principales

Edita `src/index.css`:

```css
:root {
  --accent: #1B6CA8;              /* Cambiar azul principal */
  --accent-hover: #155A8F;
  --accent-light: #E8F1F9;
}
```

### Cambiar textos

Edita `src/pages/Homepage.jsx` y busca las etiquetas `<h1>`, `<h2>`, `<p>` para cambiar contenido.

### Agregar imágenes de Cloudinary

1. Sube imágenes a Cloudinary
2. Edita `src/config/cloudinary.js`
3. Reemplaza las URLs

## 📱 Responsive Design

La página es completamente responsive:

- ✅ Móvil (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Ultra-wide (1920px+)

## 🔗 Navegación

- `/` → Homepage
- `/login` → Página de login
- `/dashboard` → Dashboard (requiere autenticación)

## 📚 Tecnologías Usadas

- **React 18** - Framework
- **Tailwind CSS 3** - Estilos
- **Lucide React** - Iconos
- **React Router 6** - Navegación
- **Vite** - Build tool

## 🎬 Animaciones

Animaciones incluidas:
- Fade in/out
- Slide up/down
- Bounce
- Glow effect
- Scroll animations

## 🚨 Solución de Problemas

### El sitio no carga

```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Imágenes no se cargan

- Verifica URLs en `src/config/cloudinary.js`
- Asegúrate de que Cloudinary esté configurado
- Comprueba la consola del navegador (F12)

### Estilos no se ven bien

- Asegúrate de que Tailwind está compilado
- Reinicia el servidor: `npm run dev`
- Limpiar caché del navegador: Ctrl+Shift+Delete

## 📞 Soporte

Para más información, consulta:
- `HOMEPAGE_GUIDE.md` - Guía completa de personalización
- [Documentación React](https://react.dev)
- [Documentación Tailwind](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

## ✨ ¿Listo para empezar?

```bash
cd frontend
npm install
npm run dev
```

¡Tu Homepage PESV Digital está listo! 🎉
