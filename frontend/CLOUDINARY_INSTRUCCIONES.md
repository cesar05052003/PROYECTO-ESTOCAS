# 🎨 INSTRUCCIONES - Agrega tu imagen a PESV Digital

## ✅ Estado: Tu cuenta Cloudinary está configurada

Tu cuenta ya está lista. Solo necesitas subir una imagen bonita de seguridad vial.

---

## 📋 Tus credenciales de Cloudinary

```
Cloud Name: drqsa0alw
API Key: 895412767819854
URL Base: https://res.cloudinary.com/drqsa0alw/
```

---

## 🖼️ PASO 1: Prepara tu imagen

**Especificaciones recomendadas:**
- 📏 Tamaño: 1920 x 1080 px (Full HD)
- 📁 Formato: JPG (mejor calidad/peso) o PNG
- 🎨 Tema: Seguridad vial, carreteras, vehículos, riesgos viales
- 💾 Tamaño archivo: Menos de 2 MB

**Imágenes sugeridas (búscalas en unsplash.com o pixabay.com):**
- "road safety professional"
- "vehicle fleet management dashboard"
- "highway safety road"
- "traffic management center"
- "driving safety concept"
- "modern fleet vehicles"

---

## 🚀 PASO 2: Sube tu imagen a Cloudinary

1. **Abre Cloudinary:**
   - Ve a https://cloudinary.com
   - Inicia sesión con tu cuenta

2. **Ve a Media Library:**
   - En el panel lateral izquierdo
   - Click en "Media Library"

3. **Sube la imagen:**
   - Arrastra tu imagen a la pantalla
   - O click en "Upload files"
   - Espera a que cargue

4. **Obtén la URL:**
   - Click derecho sobre la imagen
   - Selecciona "Copy public URL"
   - O copia desde la ventana de detalles

---

## 📝 PASO 3: Actualiza el archivo de configuración

**Archivo:** `frontend/src/config/cloudinary.js`

Busca esta línea (alrededor de la línea 20):

```javascript
HERO_BACKGROUND: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/pesv/seguridad-vial-hero',
```

**Reemplázala con:**

```javascript
HERO_BACKGROUND: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/AQUI_VA_TU_PUBLIC_ID',
```

---

## 🔍 ¿Cómo encontrar tu PUBLIC_ID?

Cuando copias la URL de Cloudinary, normalmente es algo como:

```
https://res.cloudinary.com/drqsa0alw/image/upload/v1717108800/mi_imagen_abc123.jpg
```

El `PUBLIC_ID` es la parte después de `/upload/v1717108800/`:
- **PUBLIC_ID:** `mi_imagen_abc123`

Entonces tu URL final sería:

```javascript
HERO_BACKGROUND: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/mi_imagen_abc123',
```

---

## ✨ EJEMPLO COMPLETO

Si subes una imagen llamada `seguridad-vial-profesional`, la configuración quedaría:

```javascript
HERO_BACKGROUND: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/seguridad-vial-profesional',
```

---

## 🎯 PASO 4: Guarda y visualiza

1. **Guarda el archivo** `cloudinary.js`
2. **Recarga la página** del navegador (F5)
3. **¡Verás tu imagen en el hero section!**

---

## 💡 Optimizaciones incluidas

Las transformaciones automáticas te dan:

✅ **Tamaño perfecto** (1920x1080)
✅ **Compresión automática** (pierde calidad mínima)
✅ **Formato optimizado** (WebP para navegadores modernos)
✅ **Carga rápida** (CDN global de Cloudinary)

---

## 🆘 Solución de problemas

**¿La imagen no aparece?**
- Verifica que el PUBLIC_ID sea correcto
- Comprueba que la imagen exista en tu Media Library
- Recarga la página (Ctrl+F5)

**¿Imagen se ve pixelada?**
- Asegúrate de que sea 1920x1080 mínimo
- Las transformaciones de Cloudinary optimizarán automáticamente

**¿URL no funciona?**
- Copia nuevamente la URL desde Cloudinary
- Reemplaza solo la parte del PUBLIC_ID

---

## 📚 Más recursos

- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Sitios de imágenes gratis:** 
  - https://unsplash.com
  - https://pixabay.com
  - https://pexels.com

---

## ✉️ ¿Necesitas ayuda?

Si algo no funciona:
1. Verifica el archivo `cloudinary.js`
2. Abre la consola del navegador (F12)
3. Busca mensajes de error

¡Estamos listos! 🚀
