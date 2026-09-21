# Arquitectura

## Flujo de una acción

```text
Componente TSX → hook de la funcionalidad → DashboardService → DashboardConnector
                                                           ├── LocalDashboardConnector
                                                           └── HttpDashboardConnector
```

Por ejemplo, al completar una tarea:

1. `OnboardingCard` comunica el identificador de la tarea a la página.
2. `useDashboard` encola la operación para evitar que dos cambios se sobrescriban.
3. `DashboardService.toggleTask` verifica la tarea y construye un nuevo estado.
4. El conector guarda el estado completo.
5. Cuando termina el guardado, React muestra el nuevo contador. Si falla, conserva el último estado confirmado y muestra el error.

## Responsabilidades

| Capa                            | Responsabilidad                                               |
| ------------------------------- | ------------------------------------------------------------- |
| `app`                           | Construir la aplicación e inyectar servicios                  |
| `pages`                         | Coordinar tarjetas, diálogos y acciones de la página          |
| `components/ui`                 | Controles reutilizables y accesibilidad                       |
| `features/dashboard/components` | Renderizar datos recibidos mediante props                     |
| `features/dashboard/hooks`      | Gestionar ciclos de vida y estado de interacción              |
| `services`                      | Operaciones de negocio y validación de invariantes, sin React |
| `connectors`                    | Cargar y persistir datos mediante el contrato                 |
| `model`                         | Validación de entrada y tipos inferidos de Zod                |
| `data`                          | Datos del diseño de referencia para el conector local         |

## Tipos y estado

`dashboard.schema.ts` define los esquemas de datos, estado, preferencias, tareas y eventos. TypeScript infiere los tipos desde esos esquemas para mantener una sola definición. También se rechazan identificadores duplicados y tareas completadas que no existen.

`DashboardSnapshot` agrupa `data` (contenido) y `state` (cambios de sesión). El servicio valida las cargas y los estados resultantes antes de guardarlos.

- `useDashboard`: carga inicial, reintento, cola de guardado y errores.
- `useWorkTimer`: reloj monotónico, intervalo visible y guardado al pausar, reiniciar, ocultar la página y cada 15 segundos de actividad.
- `useCalendar`: mes seleccionado, días visibles y retorno a la referencia.
- `useToast`: notificaciones temporales.
- `DashboardPage`: diálogo activo y acordeón expandido.

Los formularios mantienen su borrador local. La página suministra los datos compartidos; no se utiliza un almacén global adicional para esta única pantalla.

## Estilos y recursos

`tokens.css` reúne fuente y variables, `dashboard.css` conserva la composición, `responsive.css` contiene los puntos de adaptación y `states.css` presenta carga y errores. `teacher-theme.css` aplica colores y recursos docentes sin cambiar la cuadrícula ni los puntos de adaptación. Se usa CSS normal para controlar la geometría de la referencia.

Los recursos docentes individuales están en `src/assets/usicamm/` y se sirven localmente. `teacher-theme.css` aplica la ilustración del perfil y el recurso de formación; los participantes de los recordatorios se representan con iconos. Los archivos y nombres internos del dashboard se conservan para mantener los contratos de componentes, servicios y conectores.

## Cómo ampliar el proyecto

- Añadir tarjetas en `features/dashboard/components`, con sus datos en el esquema y en el origen de datos.
- Añadir reglas de negocio en `services` y pruebas de su comportamiento.
- Implementar `DashboardConnector` para una nueva fuente y registrarla en `create-dashboard-connector.ts`.
- Añadir pantallas en `pages`. Actualmente hay una sola página y diálogos; no se incluye un router ni rutas vacías.
- Incorporar autenticación, base de datos y permisos de usuarios en el backend cuando se cree.
