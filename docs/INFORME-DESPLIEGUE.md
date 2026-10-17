# Informe de despliegue — Qtech.es

Fecha: 2026-10-17

## 1. Resumen: ¿necesito un servidor Node?

**No.** Qtech es una **web estática**: HTML, CSS y JavaScript que se ejecutan en el
navegador del visitante. No hay backend, ni base de datos, ni lógica de servidor.
`site.js` viaja al navegador como cualquier otro archivo.

Por tanto:

| ¿Necesito... ? | Respuesta |
|----------------|-----------|
| ¿Contratar un servidor con Node? | **No** para este proyecto. |
| ¿Un servidor propio (VPS)? | **No**. Basta un hosting estático. |
| ¿Base de datos? | **No**. |
| ¿Un servidor para desarrollo local? | Sí, pero es gratis y solo para ti mientras programas. |

**Cuándo sí necesitarías Node:** solo si en el futuro quieres guardar formularios en
una base de datos, tener usuarios con login, un panel de administración, una API propia
o renderizado en servidor. Para esta web informativa, nada de eso hace falta.

## 2. Dos "servidores" distintos (no los confundas)

1. **Servidor de desarrollo (local, solo tú).**
   Sirve para ver la web mientras programas. Los módulos ES (`import`/`export`)
   **no funcionan abriendo el `.html` directamente desde el disco**, hay que servirlo
   por HTTP. Opciones gratuitas:
   - **Live Server** de VS Code (botón "Go Live").
   - `python3 -m http.server` dentro de `public/`.
   - `npx serve public` si tienes Node instalado (aquí sí se usa Node, pero solo como
     herramienta local, no en producción).

   Este servidor **no se despliega**: es solo para trabajar.

2. **Servidor de producción (para el público).**
   Lo pone el **hosting estático**. No lo administras tú: subes los archivos y la
   plataforma se encarga del servidor, HTTPS, CDN, etc.

## 3. Qué se despliega

Solo el contenido de la carpeta **`public/`**. Es decir, en el hosting configurarás:

```
Directorio de publicación (publish directory): public
Comando de build: (ninguno)
```

No hay paso de compilación: los archivos se suben tal cual.

## 4. Dónde desplegar (hostings estáticos recomendados)

Todos ofrecen **HTTPS gratis**, **CDN** y **dominio propio** en sus planes gratuitos:

| Plataforma | Ventajas | Ideal si... |
|-----------|----------|-------------|
| **Netlify** | Arrastrar y soltar la carpeta o conectar el repo Git; formularios integrados; redirecciones | Quieres la forma más rápida y "todo en uno" |
| **Cloudflare Pages** | CDN muy rápido, sin límites de ancho de banda en el plan free | Quieres rendimiento y precios agresivos |
| **Vercel** | Muy buena DX con Git; despliegues automáticos | Ya usas Git y quieres automatizar |
| **GitHub Pages** | Gratis y sencillo si el código ya está en GitHub | Solo necesitas algo básico y ya usas GitHub |
| **Firebase Hosting** | Buen plan gratuito, integración con Google | Estás en el ecosistema Google |
| **Render / Surge** | Alternativas sencillas | Quieres otra opción |

**Recomendación:** si el repositorio ya está en GitHub, empieza por **Netlify** o
**Cloudflare Pages** conectando el repo. Cada vez que hagas `git push`, se
redespliega solo. Si prefieres lo más simple para empezar, **Netlify** con arrastrar
y soltar la carpeta `public/`.

### Pasos típicos (ejemplo con Netlify)

1. Crear cuenta en netlify.com (puedes entrar con GitHub).
2. "Add new site" → "Import an existing project" → elegir el repositorio.
3. Configurar:
   - **Base directory**: (raíz del repo)
   - **Build command**: dejar vacío
   - **Publish directory**: `public`
4. Deploy. Te da una URL tipo `https://algo.netlify.app`.
5. (Opcional) Añadir dominio propio en "Domain management".

### Pasos típicos (ejemplo con GitHub Pages)

1. Subir el repo a GitHub.
2. Settings → Pages → Source: rama y carpeta (`/public` o mover el contenido a la raíz).
   - Nota: GitHub Pages sirve desde la raíz del repo o desde `/docs`, no desde una
     subcarpeta arbitraria como `public/` sin configurar un workflow. Alternativas:
     mover el contenido a la raíz, usar `/docs`, o usar una GitHub Action.
3. Activar y esperar a que publique.

> Nota práctica: los proyectos modernos que tienen la web en `public/` suelen usar
> **Netlify/Vercel/Cloudflare Pages** porque permiten elegir `public` como directorio
> de publicación sin mover nada.

## 5. Dominio y DNS

- Compra el dominio donde prefieras (Cloudflare Registrar, Namecheap, IONOS...).
- Apunta el DNS al hosting:
  - Netlify/Vercel: añadir el dominio en la plataforma y copiar los registros
    (CNAME/A) que te indique.
  - Cloudflare: si usas Cloudflare Pages, el dominio se gestiona desde el propio panel.
- El certificado HTTPS lo emite la plataforma automáticamente (Let's Encrypt o propio).

## 6. Sobre el formulario de contacto

Ahora mismo el formulario **no envía nada a un servidor**: al pulsar "Enviar" abre el
cliente de correo del visitante con `mailto:`. Eso funciona sin backend, pero depende
de que el usuario tenga un cliente de correo configurado.

Si quieres recibir los mensajes sin depender del correo del visitante, tienes dos
caminos **sin contratar Node**:

1. **Servicio de formularios estático** (lo más recomendable):
   - **Netlify Forms** (si usas Netlify): sin código, solo añadir un atributo.
   - **Formspree**, **Web3Forms**, **FormSubmit**, **Getform**: pegas una URL de
     endpoint y ellos te reenvían los mensajes por email.
   - Ventaja: cero backend, cero mantenimiento.

2. **Backend propio con Node** (solo si de verdad lo necesitas):
   - Requiere un servidor (VPS, Render, Railway, Fly.io...) y código Node.
   - Útil si quieres guardar en base de datos, panel de admin, etc.
   - Para esta web, **no es necesario**.

## 7. Checklist de puesta en producción

- [ ] Servir/desplegar únicamente el contenido de `public/`.
- [ ] Comprobar que las rutas del sitio usan `#/...` (hash): no hacen falta reglas de
      "rewrite" en el hosting.
- [ ] Verificar que `.css` y `.js` se sirven con `text/css` y `text/javascript`
      (los hostings estáticos lo hacen por defecto).
- [ ] Comprobar HTTPS activo y dominio apuntando.
- [ ] Probar en móvil y cambiar el tema del sistema (claro/oscuro).
- [ ] (Opcional) Activar el servicio de formularios y sustituir el `mailto:`.
- [ ] Añadir el dominio final en los datos estructurados (`lib/seo.js` usa
      `location.origin`, así que se actualiza solo).

## 8. Resumen de costes

| Concepto | Coste |
|----------|-------|
| Hosting estático (Netlify/Cloudflare/Vercel/GitHub Pages) | **0 €** en plan gratuito |
| HTTPS y CDN | Incluido |
| Dominio propio | ~10-15 €/año (opcional; el subdominio gratuito también sirve) |
| Servidor Node | **No necesario** |
| Servicio de formularios | Gratis en planes básicos |

**Conclusión:** no necesitas contratar un servidor Node ni un VPS. Con un hosting
estático gratuito (y, si quieres, un dominio propio) tienes la web publicada, con
HTTPS y CDN, por 0 € al mes.
