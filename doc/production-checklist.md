# Checklist de Producción — KairoTask

Pasos necesarios para llevar KairoTask a producción después del desarrollo local.

---

## 1. Dominio Personalizado

- [ ] Comprar dominio (ej. `kairotask.app`, `kairotask.com`)
- [ ] Configurar dominio en **Vercel** → Project Settings → Domains
- [ ] Configurar dominio en **Supabase** → Authentication → Settings → Site URL (<-- ESTO es lo que define los links en los emails)
- [ ] Agregar **Redirect URLs** en Supabase → Authentication → Settings:
  - `https://tudominio.app/login`
  - `http://localhost:3000/login` (para desarrollo local)
- [ ] Actualizar `NEXT_PUBLIC_SITE_URL` en variables de entorno de Vercel (`https://tudominio.app`)

## 2. Variables de Entorno

Crear en Vercel → Project Settings → Environment Variables:

| Variable | Valor | Origen |
|----------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard → Project Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase Dashboard → Project Settings → API → service_role key (solo server-side) |
| `NEXT_PUBLIC_SITE_URL` | `https://tudominio.app` | La URL de producción — usada en metadatos, sitemap, y redirects de auth |

## 3. SMTP / Correos Transaccionales

Actualmente los correos de autenticación (confirmación, reset password, invite) los envía Supabase con su relay por defecto, que tiene un límite de ~4 emails/hora.

### Opción A: BillionMail (recomendado en la arquitectura)

1. Registrarse en [BillionMail](https://billionmail.com)
2. Obtener credenciales SMTP
3. Configurar en Supabase Dashboard → **Authentication** → **Settings** → **SMTP Settings**:
   - SMTP Host: (proporcionado por BillionMail)
   - SMTP Port: 587
   - SMTP User: (tu usuario)
   - SMTP Password: (tu contraseña)
   - Sender email: `no-reply@tudominio.app`
   - Sender name: `KairoTask`

### Opción B: Resend / SendGrid / cualquier SMTP

Mismo proceso que BillionMail — cualquier proveedor SMTP compatible funciona.

## 4. Plantillas de Email Personalizadas

En Supabase Dashboard → **Authentication** → **Email Templates**, personalizar el HTML de cada plantilla:

| Template | Variables disponibles |
|----------|----------------------|
| Confirm Signup | `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}` |
| Invite User | `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}` |
| Magic Link | `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}` |
| Reset Password | `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .Email }}` |
| Change Email | `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`, `{{ .NewEmail }}` |

Las plantillas aceptan HTML completo con CSS inline. Recomendación:
- Logo de KairoTask en la cabecera
- Colores: fondo oscuro (#020617), texto claro (#F8FAFC), accent verde (#22C55E)
- Fuente monoespaciada para código/variables

## 5. PWA (Progressive Web App)

Ya existe la guía completa en `doc/pwa.md`. Pasos restantes:

- [ ] Generar iconos `192x192` y `512x512` del logo de KairoTask
- [ ] Colocar en `public/icons/`
- [ ] Verificar que `public/manifest.json` existe con los metadatos correctos
- [ ] Verificar `next.config.ts` tiene el plugin `@ducanh2912/next-pwa` habilitado

El plugin de PWA ya está en `package.json` en la rama `feature/core-fixes`, pendiente de merge a main.

## 6. Seguridad

- [ ] **RLS:** Verificar que todas las tablas tienen Row Level Security habilitado (migraciones 001-005)
- [ ] **Headers de seguridad:** Ya configurados en `next.config.ts` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS)
- [ ] **Rate Limiting:** Considerar implementar en API routes si se añaden en el futuro
- [ ] **Supabase RLS Policies:** Revisar que las políticas cubren SELECT, INSERT, UPDATE, DELETE según corresponda

## 7. Base de Datos

- [ ] Ejecutar migraciones pendientes en Supabase Dashboard → SQL Editor
- [ ] Verificar que las tablas están agregadas a la **publicación Realtime** en Supabase Dashboard → Database → Replication
- [ ] Habilitar las tablas: `tasks`, `project_members`, `task_comments`, `activity_log`

## 8. Build y Deploy

```bash
# Build local para verificar errores
pnpm build

# Deploy en Vercel
vercel --prod
```

## 9. Post-Deploy

- [ ] Verificar que el login/registro funciona con correo real
- [ ] Verificar que los emails de confirmación llegan y tienen el branding correcto
- [ ] Verificar que Realtime funciona (Kanban en vivo, comentarios en vivo)
- [ ] Verificar que los links de Términos y Privacidad son accesibles
- [ ] Probar PWA: la página debe mostrar el banner "Instalar aplicación"
- [ ] Monitorear logs en Vercel Dashboard y Supabase Dashboard
