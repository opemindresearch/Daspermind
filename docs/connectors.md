# Conectores de datos

## Contrato TypeScript

```ts
interface DashboardConnector {
  load(signal?: AbortSignal): Promise<DashboardSnapshot>;
  persistState(state: DashboardState, signal?: AbortSignal): Promise<void>;
  resetState(preferences: DashboardPreferences, signal?: AbortSignal): Promise<DashboardState>;
}
```

`ServicesProvider` construye el servicio con el conector seleccionado. También acepta servicios inyectados para sustituirlos sin cambiar los componentes.

## Conector local

Configuración predeterminada: `VITE_DATA_SOURCE=local`.

- Contenido: `src/features/dashboard/data/reference-dashboard.ts`.
- Estado persistente: `daspermind.usicamm.v1` en `localStorage`.
- Datos corruptos o versión desconocida: recupera el estado inicial.
- `rememberChanges: false`: conserva las interacciones de la sesión pero guarda los valores iniciales junto con las preferencias. Una recarga recupera la referencia.
- Almacenamiento bloqueado: funciona en memoria durante la sesión, sin persistencia tras recargar.
- Usa una clave independiente del dashboard anterior. No importa sus tareas ni accede a otros puertos, navegadores o dispositivos.

El estado no contiene información de autenticación. No se sincroniza entre usuarios ni entre pestañas abiertas.

## Conector HTTP

```dotenv
VITE_DATA_SOURCE=http
VITE_API_BASE_URL=/api
```

Reiniciar Vite después de cambiar el entorno; en producción se debe volver a compilar. Estas opciones seleccionan el adaptador, pero no crean un servidor API.

### Endpoints que debe implementar el servidor

| Método | Ruta con base `/api`         | Cuerpo                                    | Respuesta                        |
| ------ | ---------------------------- | ----------------------------------------- | -------------------------------- |
| GET    | `/api/dashboard`             | Ninguno                                   | `200` con `DashboardSnapshot`    |
| PUT    | `/api/dashboard/state`       | `DashboardState` completo                 | `204` sin cuerpo                 |
| POST   | `/api/dashboard/state/reset` | `{ "preferences": DashboardPreferences }` | `200` con el estado restablecido |

Las respuestas con contenido deben usar `Content-Type: application/json`. La estructura completa está definida en `dashboard.schema.ts`; los datos locales ofrecen un ejemplo válido.

Ejemplo de `DashboardState`:

```json
{
  "schemaVersion": 1,
  "completedTaskIds": ["convocatoria", "expediente"],
  "elapsedSeconds": 155,
  "preferences": {
    "rememberChanges": true,
    "reduceMotion": false
  }
}
```

El GET devuelve `data` y `state`. `data` contiene `greeting`, `company`, `employee`, `progress`, `onboarding` y `calendar`. Los identificadores completados deben existir en `data.onboarding.tasks`.

### Errores y sesiones

- El cliente usa un límite de 10 segundos y propaga la cancelación mediante `AbortSignal`.
- Las respuestas HTTP fallidas generan `HttpError` con su código de estado.
- Zod rechaza respuestas inválidas antes de que lleguen a la interfaz.
- La página permite reintentar una carga fallida. Una escritura fallida conserva el último estado confirmado y muestra un mensaje.
- El cliente usa `credentials: 'same-origin'`. Una sesión mediante cookies debe estar en el mismo origen o detrás de un proxy del servidor. Una URL externa no recibe automáticamente cookies de sesión.
- El backend debe aplicar autenticación, autorización y protección CSRF según su diseño. Ninguna clave privada debe estar en `VITE_*`.

El PUT envía el estado completo. La cola evita carreras dentro de esta instancia de la interfaz; no hay control de versiones entre usuarios o pestañas. Para un sistema colaborativo, ampliar el contrato con revisiones y resolución de conflictos en el servidor.

Un cierre abrupto puede perder el tiempo transcurrido desde el último guardado. Las peticiones al cerrar la pestaña no tienen garantía de entrega y no sustituyen un registro de tiempo del servidor.

### Estado de integración

Las pruebas cubren el cliente, las respuestas válidas e inválidas, los errores, la cancelación y el timeout mediante respuestas simuladas. No hay backend, base de datos ni proveedor externo conectados en este repositorio.
