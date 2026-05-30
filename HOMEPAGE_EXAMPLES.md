# 🎨 Homepage PESV - Ejemplos de Customización

## 📚 Ejemplos de Código

Aquí encontrarás ejemplos prácticos para extender y personalizar tu Homepage.

---

## 1. Agregar nueva sección

### Ejemplo: Sección de Testimonios

```jsx
// components/layout/Testimonials.jsx
import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Juan Pérez',
      company: 'TransCor S.A.S.',
      text: 'PESV Digital nos ayudó a implementar el programa en solo 3 meses.',
      rating: 5
    },
    {
      name: 'María García',
      company: 'Logística Colombia',
      text: 'La plataforma es intuitiva y el soporte excelente.',
      rating: 5
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">
          Lo que dicen nuestros clientes
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="p-8 bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Usar en Homepage:

```jsx
// En Homepage.jsx
import Testimonials from '../components/layout/Testimonials';

export default function Homepage() {
  return (
    <div>
      {/* ... otras secciones ... */}
      <Testimonials />
      {/* ... */}
    </div>
  );
}
```

---

## 2. Agregar formulario de contacto

### Ejemplo: ContactForm

```jsx
// components/ContactForm.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí integraría tu servicio de email
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Contáctanos</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-slate-600">info@pesvdigital.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Teléfono</p>
                  <p className="text-slate-600">+57 (300) 555-1234</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Ubicación</p>
                  <p className="text-slate-600">Medellín, Colombia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Tu email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none"
              required
            />
            <textarea
              name="message"
              placeholder="Tu mensaje"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
            {submitted && (
              <p className="text-green-600 text-center">¡Mensaje enviado exitosamente!</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
```

---

## 3. Cambiar tema de colores

### Crear tema oscuro

```jsx
// Agregar a index.css

@media (prefers-color-scheme: dark) {
  :root {
    --bg-page: #0F172A;
    --bg-card: #1E293B;
    --text-primary: #F1F5F9;
    --text-secondary: #CBD5E1;
  }
}
```

### Uso:

```jsx
// En Homepage.jsx o cualquier componente
const [darkMode, setDarkMode] = useState(false);

<button onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
</button>
```

---

## 4. Agregar newsletter signup

```jsx
// components/NewsletterSignup.jsx
import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Integrar con servicio de email (Mailchimp, Brevo, etc)
    console.log('Suscripción:', email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Mantente informado
        </h2>
        <p className="text-blue-100 mb-8">
          Recibe actualizaciones sobre PESV, seguridad vial y mejores prácticas
        </p>
        
        {subscribed ? (
          <div className="text-white">
            <p className="text-lg font-semibold">¡Gracias por suscribirte! 🎉</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              Suscribir
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
```

---

## 5. Integrar Analytics

```jsx
// En Homepage.jsx
import { useEffect } from 'react';

export default function Homepage() {
  useEffect(() => {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: '/',
        page_title: 'PESV Digital - Homepage'
      });
    }

    // Rastrear clics en botones
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        if (window.gtag) {
          window.gtag('event', 'button_click', {
            button_text: button.textContent
          });
        }
      });
    });
  }, []);

  return (
    // ... componentes ...
  );
}
```

---

## 6. Crear sección de precios

```jsx
// components/Pricing.jsx
const plans = [
  {
    name: 'Básico',
    price: '$99',
    period: '/mes',
    features: [
      'Hasta 5 usuarios',
      'Módulos básicos',
      'Soporte email',
      'Reportes mensuales'
    ]
  },
  {
    name: 'Profesional',
    price: '$299',
    period: '/mes',
    featured: true,
    features: [
      'Hasta 50 usuarios',
      'Todos los módulos',
      'Soporte prioritario',
      'Reportes personalizados',
      'API acceso'
    ]
  },
  {
    name: 'Empresarial',
    price: 'Custom',
    period: 'Contactar',
    features: [
      'Usuarios ilimitados',
      'Customización completa',
      'Soporte 24/7',
      'Consultoría incluida',
      'Integraciones custom'
    ]
  }
];

export default function Pricing() {
  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Planes y Precios
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-8 ${
                plan.featured
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white scale-105 shadow-2xl'
                  : 'bg-white border border-slate-200 shadow-lg'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={plan.featured ? 'text-blue-100' : 'text-slate-600'}>
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm"> {plan.period}</span>
              </p>
              
              <ul className="space-y-4 mt-8">
                {plan.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-center gap-3">
                    <span className="text-lg">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full mt-8 py-3 font-semibold rounded-lg transition-all ${
                  plan.featured
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Comenzar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 🚀 Tips de Optimización

### 1. Lazy Loading de imágenes

```jsx
<img 
  src={CLOUDINARY_CONFIG.IMAGES.HERO_BACKGROUND}
  loading="lazy"
  alt="Hero Background"
/>
```

### 2. Optimización de rendimiento

```jsx
import { lazy, Suspense } from 'react';

const Testimonials = lazy(() => import('./Testimonials'));

<Suspense fallback={<div>Cargando...</div>}>
  <Testimonials />
</Suspense>
```

### 3. Meta tags para SEO

```jsx
// En Homepage.jsx
import { Helmet } from 'react-helmet';

<Helmet>
  <title>PESV Digital - Resolución 40595 de 2022</title>
  <meta name="description" content="Plataforma digital para implementar Planes Estratégicos de Seguridad Vial" />
  <meta property="og:title" content="PESV Digital" />
  <meta property="og:description" content="..." />
</Helmet>
```

---

## 📞 ¿Preguntas?

Revisa la documentación principal:
- `HOMEPAGE_GUIDE.md` - Guía completa
- `HOMEPAGE_SETUP.md` - Instalación

¡Feliz coding! 🚀
