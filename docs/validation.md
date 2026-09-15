# Validación y límites

## Resultado local de la entrega · 15 de septiembre de 2026

TypeScript, ESLint, Prettier y la compilación terminaron correctamente. Pasaron **23 pruebas unitarias** y **20 pruebas de navegador** en Google Chrome sobre el build de producción. Se revisaron visualmente capturas de 1600, 768 y 390 px; la [captura de escritorio](preview.png) está incluida en el repositorio.

## Comprobaciones

| Comprobación           | Qué verifica                                                               |
| ---------------------- | -------------------------------------------------------------------------- |
| `npm run typecheck`    | Contratos TypeScript, props y TSX con modo estricto                        |
| `npm run lint`         | Reglas de TypeScript y React Hooks                                         |
| `npm test`             | Persistencia, migración, datos corruptos, servicio y contrato HTTP         |
| `npm run build`        | Compilación de la aplicación y recursos locales                            |
| `npm run test:e2e`     | Tareas, timer, calendario, diálogos, preferencias y responsive en Chromium |
| `npm run format:check` | Formato uniforme con Prettier                                              |

Las pruebas de navegador comprueban 13 anchos: **320, 375, 390, 560, 561, 768, 800, 1024, 1250, 1251, 1440, 1600 y 1824 px**. Verifican ausencia de desbordamiento horizontal de la página, contenido principal, navegación con teclado y límites del diálogo móvil. La navegación y el calendario pueden desplazarse dentro de su propio contenedor.

La revisión visual compara capturas de escritorio, tableta y móvil con la versión local anterior. Pasar las pruebas técnicas no equivale a una aprobación de diseño por parte del usuario.

## Fidelidad a la imagen

Se conservaron composición, cifras, nombres, textos y recursos suministrados, incluidos estos detalles:

- `Employe`, `Welcome in, Nixtio`, `Lora Piterson` y `Crextio` mantienen la escritura original.
- Septiembre de 2024 muestra `Mon 22` a `Sat 27`, aunque esos días y fechas no coinciden con el calendario real. La vista de referencia conserva la imagen; otros meses muestran su primera semana que comienza en lunes.
- `2/8` tareas completadas, cinco tareas visibles y `18%` son cifras independientes en la referencia. Completar una tarea cambia el contador; no recalcula el porcentaje estático.
- Las alturas del gráfico de progreso reproducen la geometría visual. La imagen solo aporta `6.1 h` semanales y el destacado `5h 23m`, no una serie completa de horas diarias.
- Los textos y métricas son datos de demostración de la referencia, no información actual de una empresa.

La navegación complementaria muestra detalles y accesos al contenido de esta pantalla. No se han inventado pantallas de negocio ni registros adicionales.

## Alcance técnico

El modo local funciona sin servicios externos: fuente e imagen se sirven desde la aplicación. El build de Vite requiere un servidor HTTP para cargar sus módulos.

El conector HTTP tiene pruebas con transporte simulado. La integración con una API real, autenticación, base de datos, sincronización multiusuario y despliegue no forman parte de esta entrega.

La publicación en GitHub se comprueba por el commit remoto. GitHub Actions se verifica por separado; ninguno de esos pasos publica un sitio web automáticamente.
