# Perfil docente · Admisión USICAMM

## Alcance

La pantalla conserva las seis tarjetas, la cuadrícula, las proporciones, los controles y los puntos de adaptación del dashboard original. Se sustituyen los textos y datos de recursos humanos por un perfil docente en español y se aplica una paleta guinda, dorado y marfil. `teacher-theme.css` concentra los cambios visuales; `responsive.css` permanece sin modificaciones.

El perfil **Luis Herrera**, su folio **AB-DEMO**, cifras, avances, horas y actividades son ejemplos. La ilustración no identifica a una persona real. La agenda contiene recordatorios personales de ejemplo y no fechas oficiales del proceso. Marcar el checklist no registra una solicitud ni valida documentos ante USICAMM.

## Correspondencia de las tarjetas

| Tarjeta original | Contenido actual |
| --- | --- |
| Perfil de empleado | Perfil de docente aspirante, ilustración y folio de ejemplo |
| Progreso | Preparación y horas de estudio ilustrativas |
| Temporizador | Sesión de estudio con inicio, pausa y reinicio |
| Onboarding | Checklist personal de participación y avances por sección |
| Datos del empleado | Datos personales, formación, participación y ayuda |
| Calendario | Agenda personal con recordatorios de ejemplo |

El checklist, el porcentaje de actividades realizadas y el contador de pendientes se actualizan juntos. Las tres barras de perfil, documentos y preparación representan avances independientes de ejemplo; sus anchos mantienen la composición original y no son partes de un total.

## Recursos proporcionados por el usuario

La [carpeta MM Design](https://drive.google.com/drive/folders/1VQukMKuLs2aC20yH-ZKzgiU7qumweh6V) contiene los recursos usados localmente:

- [mmme.png](https://drive.google.com/file/d/1GDVvZ9lObYDUpFGn3cszPojnVXHnXcE0/view): ilustración del docente, guardada como `src/assets/usicamm/docente.png`.
- [male.png](https://drive.google.com/file/d/1lEXq5ewWPckErFVo_rstkTEHwGusaq5g/view): ilustración de un maletín, guardada como `src/assets/usicamm/formacion.png`.
- [Sección Admisión.svg](https://drive.google.com/file/d/1HVKuQtM4kFdBYZXlaJEVORRiOB8FSV_2/view): marca de la sección dentro del detalle del proceso.

La imagen `PERFILESS.png` suministrada se usa como referencia de identidad cromática. No se importan sus distribuciones de pantalla. La tipografía Outfit y su licencia se mantienen desde la versión anterior.

## Referencias de contenido

- [Portal oficial de USICAMM](https://usicamm.sep.gob.mx/): acceso a procesos, convocatorias, guías y contactos.
- [Curso de habilidades docentes y digitales para la Nueva Escuela Mexicana, admisión en educación básica 2026–2027](https://usicamm.sep.gob.mx/usicamm_dsk08/2026-2027/notificaciones/AD/cursos/AB/index.html): referencia para la denominación del curso; no se usan datos ni credenciales de participantes.

Las ligas de ayuda de la interfaz llevan al portal oficial. No se simulan conexiones con sus sistemas, resultados, registros, citas o acreditaciones.

## Compatibilidad

La arquitectura React, servicios y conectores permanece intacta. Se conservan las claves internas del contrato `DashboardData` para evitar una migración de API por un cambio de contenido; la interfaz muestra únicamente las etiquetas docentes.

El estado del perfil se guarda en `daspermind.usicamm.v1`. Las claves anteriores de la demostración de recursos humanos permanecen separadas y no se reinterpretan como actividades del docente.
