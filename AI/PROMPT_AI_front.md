# Prompt de Comportamiento para IA

Este documento define las reglas y expectativas para la IA asistente integrada en Antigravity, con foco en desarrollo frontend y pruebas.

## 1. Formato y estilo de codigo

- Usa tabulacion para formatear el codigo de forma consistente.
- Prioriza soluciones simples y legibles; el codigo debe ser auto-explicativo.
- Evita la duplicacion; reutiliza logica existente antes de crear nuevas funciones.
- **Refactorizacion y deuda tecnica**:
  - Refactoriza siempre que agregues funcionalidad en codigo existente para mantener coherencia
  - Elimina codigo muerto o duplicado inmediatamente
  - No dejes deuda tecnica acumulada; el codigo debe estar limpio y mantenible
  - Si detectas mal olor en el codigo (code smell), refactoriza aunque no estes tocando esa parte
- **Comentarios (proyecto academico - fin de curso)**:
  - **OBLIGATORIO**: Cada archivo debe tener un comentario inicial explicando su proposito y responsabilidad
  - **OBLIGATORIO**: Cada funcion/componente debe tener un comentario breve explicando:
    - Que hace (proposito)
    - Parametros principales (si no son obvios)
    - Valor de retorno (si aplica)
  - **OBLIGATORIO**: En exports, explica a donde va destinado y su proposito
  - Los comentarios deben ser **breves, funcionales y educativos** (estilo academico)
  - Todos los comentarios en ingles
  - Comenta decisiones de diseño importantes o logica no obvia
  - Usa nombres descriptivos, pero aun asi documenta el "por que"
  - no queremos inline styles css , todo en sus archivos o modules css correspondientes, ya que usamos css puro.

## 2. Gestion del entorno de desarrollo

- Al realizar cambios, reinicia el servidor de desarrollo para verificar los cambios en el navegador.
- Cierra instancias previas del dev server antes de iniciar uno nuevo.
- Escribe codigo que contemple los entornos de desarrollo, staging y produccion.
- Verifica que los cambios funcionen correctamente en el navegador y sean responsive.

## 3. Validacion y pruebas

- Asegurate de que los cambios realizados sean los solicitados o que esten plenamente comprendidos.
- No introduzcas nuevas tecnologias o patrones al corregir errores sin agotar primero las opciones actuales.
- Si introduces una nueva tecnologia, elimina la implementacion anterior para evitar logica duplicada.
- No limpies el localStorage/sessionStorage en tests sin confirmacion explicita.
- Al mockear datos, usa fixtures reutilizables en lugar de datos hardcodeados.
- Evita side effects en tests que afecten el estado global de la aplicacion.

## 4. Organizacion y mantenimiento

- Manten la base de codigo limpia y bien organizada.
- Evita escribir scripts directamente en entornos si solo se ejecutaran una vez.
- Documenta cada cambio relevante con comentarios claros y concisos.

## 5. Comportamiento de la IA

- Sugiere soluciones basadas en codigo existente antes de proponer nuevas implementaciones.
- Prioriza la seguridad, la estabilidad y la claridad del codigo.
- No realices acciones destructivas sin confirmacion explicita del usuario.
- Proporciona explicaciones breves y educativas al sugerir cambios o mejoras.

## 6. Registro y trazabilidad (obligatorio)

- Manten un registro vivo ai/context_front.md. En cada respuesta que implique decisiones, cambios o proximos pasos, anade una entrada con:
  - Fecha (ISO) y hora
  - Acciones realizadas
  - Decisiones tomadas y pendientes
  - Proximos pasos
  - Archivos tocados (ruta:linea si aplica)
  - Notas o riesgos
- Si el entorno no permite escribir archivos, incluye el bloque de actualizacion ai/context_front.md en la respuesta y solicita permiso para persistirlo.
- El objetivo es que otra IA o persona pueda continuar el trabajo con minima friccion.

## 7. Actualizar CHANGELOG

- Tras cada iteracion que cambia el comportamiento de la aplicacion deja constancia actualizando ai/changelog_front.md.
- Elimina del comportamiento las formas previas de funcionamiento de los elementos que se cambiaron para no causar confusion.

## 8. RESPETAR COHERENCIA DE TEMA E IDIOMAS

- En cada cambio que te solicite quiero que lo hagas teniendo en cuenta:
  - **Tema visual**: Manten coherencia con el sistema de temas (light/dark mode) existente en la aplicacion
  - **Internacionalizacion (i18n)**: Si la aplicacion soporta multiples idiomas, asegurate de que todos los textos nuevos esten traducidos y usen el sistema de traducciones existente
  - Verifica que los cambios se vean correctamente en ambos temas (claro y oscuro)

## 9. Componentes y UI

- Manten los componentes pequeños y con una única responsabilidad (Single Responsibility Principle).
- Separa la logica de negocio de la presentacion.
- Si el proyecto usa TypeScript, tipea todas las props de componentes.
- Asegura que los componentes sean accesibles (a11y): usa semantic HTML, aria-labels cuando sea necesario.
- **Rendimiento**: Prioriza la legibilidad sobre la optimizacion prematura
  - Mide primero con React DevTools Profiler antes de optimizar
  - Usa React.memo, useMemo, useCallback SOLO cuando el profiler muestre problemas de performance
  - No optimices sin datos que lo justifiquen
- Mantén consistencia en el naming: usa PascalCase para componentes, camelCase para funciones y variables.

## 10. Estado y gestion de datos

- **Criterios para elegir donde gestionar el estado**:
  - Estado local (useState): Para estado que solo usa un componente
  - Props: Para 1-2 niveles de profundidad en el arbol de componentes
  - Context API: Para 3+ niveles o datos compartidos por multiples componentes hermanos
  - Estado global (Redux/Zustand): Solo para estado verdaderamente global (auth, theme, user preferences)
- Documenta el flujo de datos entre componentes cuando sea complejo.
- Mantén la inmutabilidad del estado; nunca mutes el estado directamente.
- Separa el estado de UI (modales abiertos, tabs activos) del estado de datos de aplicacion (usuarios, productos).
- Usa custom hooks para encapsular logica reutilizable de estado.
