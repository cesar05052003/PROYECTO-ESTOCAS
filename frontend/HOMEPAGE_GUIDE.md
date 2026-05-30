# 🎨 PESV Digital - Guía de Homepage

## 📋 Contenido

- [Introducción](#introducción)
- [Estructura de Archivos](#estructura-de-archivos)
- [Cloudinary - Configuración de Imágenes](#cloudinary---configuración-de-imágenes)
- [Personalización](#personalización)
- [Animaciones y Efectos](#animaciones-y-efectos)
- [Responsive Design](#responsive-design)

---

## Introducción

La página principal (Homepage) de PESV Digital es un landing page moderno, profesional y responsive que presenta la plataforma de forma atractiva.

**Características principales:**
- ✨ Diseño moderno y corporativo
- 📱 Totalmente responsive (móvil, tablet, desktop)
- 🎬 Animaciones suaves y profesionales
- 🎨 Sistema de colores azul-blanco elegante
- ⚡ Rendimiento optimizado
- 🔐 Integración con autenticación

---

## Estructura de Archivos

```
frontend/
├── src/
│   ├── pages/
│   │   └── Homepage.jsx                 # Componente principal
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.jsx               # Barra de navegación
│   │       └── Footer.jsx               # Pie de página
│   ├── config/
│   │   └── cloudinary.js                # Configuración de imágenes
│   └── index.css                        # Estilos globales
```

---

## Cloudinary - Configuración de Imágenes

### ¿Qué es Cloudinary?

Cloudinary es un servicio cloud para gestionar imágenes. Permite subir, optimizar y servir imágenes de forma rápida y eficiente.

### ✅ Tu cuenta Cloudinary está lista

**Credenciales configuradas:**
- Cloud Name: `drqsa0alw`
- API Key: `895412767819854`
- URL de la imagen actualizada con transformaciones automáticas

### 📸 Pasos para subir tu imagen de seguridad vial:

1. **Ve a tu Dashboard de Cloudinary**
   - Inicia sesión en https://cloudinary.com
   - Ve a tu dashboard

2. **Sube tu imagen**
   - Click en "Media Library" (Biblioteca de Medios)
   - Arrastra tu imagen bonita de seguridad vial
   - Recomendaciones:
     * Tamaño: 1920x1080 px (Full HD)
     * Formato: JPG o PNG
     * Tema: Seguridad vial, carreteras, vehículos, gestión de riesgos
     * Sugerencias de búsqueda: 
       - "road safety professional"
       - "vehicle fleet management"
       - "highway safety"
       - "traffic risk management"

3. **Obtén la URL de tu imagen**
   - Click derecho en la imagen
   - Selecciona "Copy public URL"
   - O copia la URL que aparece en la ventana de detalles

4. **Actualiza el archivo de configuración**

**Archivo:** `frontend/src/config/cloudinary.js`

Reemplaza la URL en `HERO_BACKGROUND`:

```javascript
HERO_BACKGROUND: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/pesv/TU_PUBLIC_ID_AQUI',
```

Donde `TU_PUBLIC_ID_AQUI` es el nombre/ID de tu imagen en Cloudinary.

### 📌 Ejemplo completo:

Si subes una imagen llamada `seguridad-vial-hero`, la URL sería:

```javascript
HERO_BACKGROUND: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/seguridad-vial-hero',
```

### ✨ Transformaciones Cloudinary incluidas:

- `c_scale,w_1920,h_1080` - Escala la imagen a 1920x1080 px
- `q_auto` - Comprime automáticamente manteniendo calidad
- `f_auto` - Selecciona el mejor formato (WebP para navegadores modernos)

### Usar imágenes en componentes React:

```javascript
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

<img 
  src={CLOUDINARY_CONFIG.IMAGES.HERO_BACKGROUND} 
  alt="Seguridad Vial" 
  className="w-full h-full object-cover"
/>
```

---

## Personalización

### 1. Cambiar Colores

**Archivo:** `frontend/src/index.css`

Los colores principales están definidos en las variables CSS:

```css
:root {
  --accent: #1B6CA8;              /* Azul principal */
  --accent-hover: #155A8F;        /* Azul hover */
  --accent-light: #E8F1F9;        /* Azul claro */
}
```

Para cambiar a otros colores, modifica estos valores.

**Ejemplos:**
- Verde: `#10B981` / `#059669` / `#ECFDF5`
- Rojo: `#EF4444` / `#DC2626` / `#FEE2E2`
- Púrpura: `#8B5CF6` / `#7C3AED` / `#F3E8FF`

### 2. Cambiar Logo

El logo está en `Navbar.jsx`:

```jsx
// Busca esta línea:
<Shield className="w-6 h-6 text-white" />

// Reemplázalo con tu logo:
<img src={LOGO_URL} alt="Logo" className="w-6 h-6" />
```

### 3. Cambiar Textos

Los textos principales están en `Homepage.jsx`. Busca y modifica:

```javascript
// Título principal
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
  Planes Estratégicos de <span>Seguridad Vial</span>
</h1>

// Descripciones
<p className="text-lg sm:text-xl text-gray-200 mb-8">
  Tu nuevo texto aquí
</p>
```

### 4. Agregar nuevas secciones

Crea un componente React nuevo en `components/`:

```jsx
// components/layout/NewSection.jsx
export default function NewSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Tu contenido aquí */}
      </div>
    </section>
  );
}

// Luego importa en Homepage.jsx
import NewSection from '../components/layout/NewSection';

// Y úsalo en el JSX
<NewSection />
```

---

## Animaciones y Efectos

### Animaciones disponibles:

```css
.animate-fadeIn          /* Aparece con fade */
.animate-slideUp         /* Sube y aparece */
.animate-slideDown       /* Baja y aparece */
.animate-slideInLeft     /* Entra desde izquierda */
.animate-slideInRight    /* Entra desde derecha */
.animate-bounce          /* Rebota continuamente */
.animate-glow            /* Efecto de brillo */
```

### Ejemplo de uso:

```jsx
<div className="animate-fadeIn">
  <h2>Este título desaparece con fade</h2>
</div>

<div className="animate-slideUp">
  <p>Este párrafo sube mientras aparece</p>
</div>
```

### Agregar animación al scroll:

```jsx
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    }
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

<div className={isVisible ? 'animate-slideUp' : 'opacity-0'}>
  Aparece cuando scrolleas
</div>
```

---

## Responsive Design

### Breakpoints de Tailwind:

```css
sm  @media (min-width: 640px)
md  @media (min-width: 768px)
lg  @media (min-width: 1024px)
xl  @media (min-width: 1280px)
2xl @media (min-width: 1536px)
```

### Ejemplo de uso:

```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Título responsive
</h1>

<div className="grid md:grid-cols-2 lg:grid-cols-3">
  {/* Colunas responsive */}
</div>
```

### Testear responsiveness:

1. Abre DevTools (F12)
2. Click en el ícono de dispositivo (o Ctrl+Shift+M)
3. Cambia el tamaño del viewport
4. Verifica que todo se vea bien

---

## 🚀 Pasos siguientes

1. **Subir imágenes a Cloudinary**
   - Reemplaza las URLs placeholder en `cloudinary.js`

2. **Personalizar colores**
   - Actualiza `index.css` según tu branding

3. **Cambiar textos**
   - Modifica los títulos y descripciones en `Homepage.jsx`

4. **Agregar contacto**
   - Integra un formulario de contacto
   - Conecta con tu email service

5. **Testing**
   - Prueba en móvil, tablet y desktop
   - Verifica todas las animaciones
   - Prueba los botones de navegación

---

## 📞 Soporte

Para más información:
- Cloudinary: https://cloudinary.com/documentation
- Tailwind CSS: https://tailwindcss.com/docs
- React: https://react.dev
- Lucide Icons: https://lucide.dev

---

**¡Listo!** Tu Homepage PESV Digital está configurada y lista para personalizar. 🎉
