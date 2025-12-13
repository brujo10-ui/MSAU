# AGENTS.md — Reglas de Trabajo (MSAU Engine V10)

Este documento define las **reglas obligatorias** para agentes/colaboradores técnicos del proyecto MSAU Engine.
**Incumplir estas reglas = PR rechazado.**

Objetivo: blindar la arquitectura Event-Sourcing + Núcleo Puro + Fachada React.

---

## 0) Roles (Contexto operativo)

- **Arquitecto (Diseñador):** define estructura, contratos y decisiones finales.
- **Chari (Inspectora de Obra):** revisa calidad, coherencia arquitectónica y riesgos.
- **Comet (Coordinador Operativo):** canaliza tareas, integra cambios, mantiene sincronía.
- **Jules (Constructor):** implementa scaffolding e infraestructura, siguiendo este documento al 100%.

---

## 1) Ley de Fronteras (NÚCLEO PURO)

### Regla 1.1 — Importaciones prohibidas
Cualquier archivo en:

- `src/core/**`
- `src/architecture/**`

**NUNCA** puede importar:

- `react`, `react-dom`, `next/*`, `src/components/**`, `src/pages/**`, `src/app/**`
- UI libs / styling (tailwind, lucide-react, shadcn, etc.)

**Permitido:** TypeScript puro, utilidades propias, adaptadores declarados en `architecture`.

✅ Motivo: Núcleo testeable, portable y reemplazable (motor/LLM/UI pueden cambiar sin contaminar el dominio).

---

## 2) Ley de Inmutabilidad (EVENTS / EVENT STORE)

### Regla 2.1 — EventStore es append-only

- Los eventos se **append** (se añaden).
- Los eventos **NO se editan**, **NO se eliminan**, **NO se reescriben**.
- La historia es sagrada.

### Regla 2.2 — Eventos son inmutables

- Al publicar/guardar un evento, se considera "sellado".
- No se permite mutar `payload` después del `publish/append`.

✅ Motivo: Event Sourcing + Time Travel Debugging + auditoría semántica.

---

## 3) Ley de Fachada (UI ↔ Dominio)

### Regla 3.1 — UI solo habla con `useMSAU`

- Componentes en `src/components/**` o UI en general **solo** consumen:
  - `useMSAU()`
  - y su `vm` (ViewModel) + comandos (`teach`, `submitAnswer`, etc.)

### Regla 3.2 — Prohibido conectar componentes al EventBus

- Nadie en UI puede hacer `bus.subscribe(...)` ni `store.getAll()` directamente.
- Si UI necesita algo nuevo, se añade al **ViewModel** (reducer/selectores).

✅ Motivo: evitar acoplamiento + evitar "UI sabe demasiado".

---

## 4) Protocolo de Versiones (DEPENDENCIAS)

### Regla 4.1 — Respeto absoluto a `package.json`

- **Prohibido** actualizar librerías, versiones, locks, o añadir deps sin orden explícita del Arquitecto.
- Si una librería es necesaria, se solicita primero vía Comet.

✅ Motivo: evitar drift, romper builds, o introducir dependencias no auditadas.

---

## 5) Contratos: Eventos y Nombres (DISCIPLINA)

### Regla 5.1 — Event type = string estable

- Los nombres de eventos (`event.type`) deben ser consistentes.
- Si se renombra un evento, se documenta y se provee compatibilidad/migración (si aplica).

### Regla 5.2 — CorrelationId obligatorio para interacciones

- Toda acción tipo "teach/evaluate/repair" debe generar un `correlationId` único.
- Múltiples eventos pueden compartir el mismo `correlationId` (misma operación).

✅ Motivo: trazabilidad por operación, no solo por sesión.

---

## 6) Protocolo de PR / Cambios

### Regla 6.1 — PR pequeño, enfocado

- Un PR = una misión.
- Nada de "aproveché y también cambié..."

### Regla 6.2 — Comentarios y claridad

- Código limpio, nombres explícitos.
- Comentarios solo donde la intención no sea obvia.

### Regla 6.3 — No romper la build

- Todo archivo `.ts` debe compilar.
- Sin `any` masivo salvo scaffolding explícito y temporal.

---

## 7) Testing mínimo (cuando aplique)

### Regla 7.1 — Reducers puros, testeables

- `selectors.ts` / reducers deben ser funciones puras.
- No deben depender de tiempo real, random, ni singletons.

✅ Motivo: reproducibilidad y time-travel.

---

## 8) Carpeta objetivo para Jules (Misión V10)

### Tarea: "Implementar Scaffolding de Infraestructura V10"

**Input disponible:**

- `src/architecture/types.ts` (ya existe)
- especificación para `eventBus.ts` y `eventStore.ts` (aprobadas)

**Output esperado (compilable y limpio):**

- `src/architecture/eventBus.ts`
- `src/architecture/eventStore.ts`

### Criterios de aceptación:

- Sin dependencias externas
- Tipos exportados correctamente
- API mínima estable (`publish/subscribe`, `append/getAll`)
- Cumple Ley de Fronteras y Ley de Inmutabilidad

---

## 9) Regla adicional crítica (RECOMENDACIÓN INSPECTORA)

### 9.1 — No mezclar "dominio" con "infra"

- Dominio decide *qué significa* algo.
- Infra ejecuta *cómo se hace* (LLM call, audio, storage).
- Orchestrator coordina *cuándo*.

Si una función "hace demasiadas cosas", se separa.

---

## 10) Comunicación (para evitar caos)

- Si algo es ambiguo: preguntar primero (Comet canaliza).
- Si algo parece "romper fronteras": detenerse y reportar al Arquitecto.
- Preferimos **cambios pequeños y correctos** a "avances rápidos" que meten deuda.

---

**FIN.**
