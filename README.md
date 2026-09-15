# Daspermind · Crextio dashboard

Réplica del dashboard de la imagen proporcionada, implementada en **React, TypeScript y TSX**. Conserva la composición, la tipografía, los colores, las imágenes y los datos visibles de la referencia. Funciona localmente y separa componentes, lógica de negocio y conectores.

![Vista de escritorio del dashboard React](docs/preview.png)

## Iniciar el proyecto

Requisitos: **Node.js 24 LTS** (ver `.nvmrc`) y npm. También admite Node 22.12 o superior de la rama 22.

```bash
npm ci
npm run dev
```

Abrir <http://127.0.0.1:5173>. No se necesitan cuentas, claves ni un servidor de API para el modo local.

Para compilar y revisar la versión de producción:

```bash
npm run build
npm run preview
```

Vite sirve los archivos compilados desde `dist/`. La aplicación se ejecuta mediante un servidor HTTP local; no abriendo `index.html` con doble clic.

## Funcionalidad

- Tarjetas de perfil, métricas, progreso, dispositivos y compensación.
- Temporizador con inicio, pausa, reinicio y guardado de tiempo.
- Tareas de onboarding seleccionables y notificaciones de pendientes.
- Calendario con cambio de mes, estado vacío y detalle de eventos.
- Acordeones, diálogos con control de foco y navegación por teclado.
- Preferencias de persistencia y reducción de movimiento; restauración del estado inicial.
- Diseño adaptable a móvil, tableta y escritorio. La navegación y el calendario tienen desplazamiento interno cuando lo necesitan.

## Estructura

```text
src/
├── app/                       # Composición y proveedores de servicios
├── pages/dashboard/           # Página que coordina el dashboard
├── components/
│   ├── layout/                # Cabecera y navegación
│   └── ui/                    # Iconos, botones, diálogo, toast y errores
├── features/dashboard/
│   ├── components/            # Tarjetas y contenido de los diálogos
│   ├── hooks/                 # Estado, temporizador y calendario
│   ├── model/                 # Esquemas Zod, tipos y navegación
│   └── data/                  # Datos de referencia y estado inicial
├── services/                  # Operaciones independientes de React
├── connectors/
│   ├── contracts/             # Interfaz de los conectores
│   ├── local/                 # Persistencia local y migración
│   └── http/                  # Cliente HTTP y adaptador para una API
├── config/                    # Configuración de entorno validada
├── hooks/                     # Hooks compartidos
├── lib/                       # Almacenamiento seguro y cálculo de tiempo
├── assets/                    # Fuente local, licencia e imagen original
└── styles/                    # Variables, componentes, responsive y estados
tests/e2e/                     # Pruebas de navegador con Playwright
docs/                          # Arquitectura, conectores y validación
.github/workflows/ci.yml        # Comprobaciones automáticas en GitHub
```

Los componentes no leen `localStorage` ni llaman a `fetch`. Usan hooks, los hooks llaman a servicios y los servicios trabajan con un contrato de conector. [Arquitectura detallada](docs/architecture.md).

## Datos y conectores

El modo predeterminado es `local`. Los datos de la imagen están en `reference-dashboard.ts`. Las tareas completadas, el tiempo y las preferencias se guardan en `localStorage` bajo `daspermind.dashboard.v1`.

Si el navegador bloquea el almacenamiento, la aplicación conserva los cambios durante la sesión en memoria. La migración desde el prototipo HTML funciona cuando su clave anterior está disponible en **el mismo origen del navegador**; puertos diferentes tienen almacenamiento separado.

Para configurar otro origen de datos, copiar `.env.example` a `.env.local`:

```dotenv
VITE_DATA_SOURCE=local
VITE_API_BASE_URL=/api
```

El adaptador HTTP está implementado y probado con respuestas simuladas. **Este repositorio no incluye un backend ni una conexión a datos reales.** Cambiar a `VITE_DATA_SOURCE=http` cuando exista una API que implemente el [contrato documentado](docs/connectors.md).

Las variables `VITE_*` son públicas en el navegador: no colocar claves privadas en ellas.

## Validación

```bash
npm run check            # TypeScript, ESLint, Vitest y build
npm run format:check     # Formato del código y documentación

# Pruebas de navegador sobre el build:
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright inicia un servidor de preview en el puerto `4184`. Para usar Google Chrome instalado:

```bash
PLAYWRIGHT_CHROMIUM_CHANNEL=chrome npm run test:e2e
```

GitHub Actions ejecuta las comprobaciones en cada push a `main` y en los pull requests. [Alcance de las pruebas](docs/validation.md).

## Referencia visual y recursos

La marca **Crextio**, los textos en inglés y las cifras proceden de la referencia; **Daspermind** es el nombre del proyecto y del repositorio. La navegación complementaria abre detalles locales del mismo dashboard.

La imagen suministrada se conserva como recurso local y se utiliza como sprite CSS para la fotografía, el dispositivo y los avatares. Outfit está incluida con su [licencia SIL Open Font License](src/assets/fonts/OFL-Outfit.txt). El dashboard no descarga fuentes o imágenes desde terceros durante su uso.

Algunas cifras y fechas del diseño no son coherentes entre sí; se preservan por fidelidad visual y se explican en [Validación y límites](docs/validation.md).
