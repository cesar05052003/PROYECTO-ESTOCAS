/**
 * Configuración de Cloudinary para PESV Digital
 *
 * Instrucciones:
 * 1. Crea una cuenta en https://cloudinary.com
 * 2. Ve a tu Dashboard y obtén:
 *    - Cloud Name
 *    - API Key
 *    - API Secret
 * 3. Reemplaza los valores a continuación
 */

export const CLOUDINARY_CONFIG = {
  // Tu Cloud Name de Cloudinary
  CLOUD_NAME: 'drqsa0alw',

  // Tu API Key de Cloudinary
  API_KEY: '895412767819854',

  // Tu API Secret de Cloudinary (NO compartas esto)
  API_SECRET: 'MANTÉN_ESTO_SEGURO_NO_COMPARTAS',

  // URLs de imágenes
  IMAGES: {
    // Hero Section - Imagen principal de seguridad vial optimizada en Cloudinary
    HERO_BACKGROUND: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/pesv/seguridad-vial-hero',
    
    // Alternativas de imágenes para el hero (URLs de Cloudinary):
    // - Carreteras premium: https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/pesv/carreteras-seguras
    // - Vehículos certificados: https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/pesv/vehiculos-seguridad
    // - Gestión de riesgos: https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_1920,h_1080,q_auto,f_auto/v1/pesv/gestion-riesgos

    // Logo de la empresa (opcional)
    LOGO: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_200,h_200,q_auto,f_auto/v1/pesv/logo',

    // Imágenes de niveles de madurez
    LEVEL_BASIC: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_400,h_300,q_auto,f_auto/v1/pesv/nivel-basico',
    LEVEL_STANDARD: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_400,h_300,q_auto,f_auto/v1/pesv/nivel-estandar',
    LEVEL_ADVANCED: 'https://res.cloudinary.com/drqsa0alw/image/upload/c_scale,w_400,h_300,q_auto,f_auto/v1/pesv/nivel-avanzado',
  }
};

/**
 * CÓMO USAR CLOUDINARY EN REACT:
 *
 * 1. Instalación:
 *    npm install cloudinary-react
 *
 * 2. Uso en componentes:
 *    import { CldImage } from 'next-cloudinary';
 *    import { CLOUDINARY_CONFIG } from './config/cloudinary';
 *
 *    <CldImage
 *      src={CLOUDINARY_CONFIG.IMAGES.HERO_BACKGROUND}
 *      alt="Hero Background"
 *      width={1600}
 *      height={900}
 *    />
 *
 * 3. Subir imágenes:
 *    - Ve a tu Dashboard de Cloudinary
 *    - Click en "Media Library"
 *    - Arrastra tus imágenes
 *    - Copia la URL pública
 *    - Actualiza CLOUDINARY_CONFIG.IMAGES
 */

/**
 * URLS RECOMENDADAS PARA PESV:
 *
 * Para obtener mejores resultados, sube imágenes con estos temas:
 * - Carreteras seguras
 * - Flotas de vehículos empresariales
 * - Seguridad vial y transporte
 * - Gestos de seguridad en el trabajo
 * - Reuniones de seguridad
 * - Dashboard de control
 *
 * Recomendaciones de tamaño:
 * - Hero: 1600x900px
 * - Cards: 400x300px
 * - Background: 1920x1080px
 */

export default CLOUDINARY_CONFIG;
