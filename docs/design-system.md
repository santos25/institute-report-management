# Sistema de diseño — Instituto Angelitos Alegres

Tokens de color definidos una sola vez en `app/globals.css` (`@theme` de Tailwind 4 y variables CSS). Los componentes shadcn (`Button`, `Card`, `Input`, etc.) usan las variables semánticas (`primary`, `secondary`, `accent`…).

## Paleta de marca

| Token | Hex | Rol | Texto |
| --- | --- | --- | --- |
| `azul-500` | `#2563A8` | Primario (Azul Angelito) | Blanco |
| `sol-500` | `#FFC93C` | Acento (Amarillo Sol) | Solo texto oscuro (`tinta`) |
| `coral-500` | `#FF8A65` | Secundario / detalles cálidos | Solo texto oscuro |
| `lila-500` | `#6B4FD8` | Variedad | Blanco |
| `hoja-500` | `#3DB48B` | Decorativo; token `--success` | Solo `tinta` (nunca blanco) |
| `whatsapp` | `#25D366` | Botón de WhatsApp | Texto oscuro (`tinta`) |
| `crema` / `crema-100` | `#FFF9F0` | Fondo de página | — |
| `tinta` / `tinta-700` | `#24304A` | Texto principal | — |

Cada color de marca (salvo WhatsApp y Crema) tiene escala `50–900`. Utilidades Tailwind: `bg-azul-500`, `text-sol-700`, `border-coral-200`, `bg-crema`, `text-tinta`.

## Mapeo shadcn

| Variable | Token de marca | Uso |
| --- | --- | --- |
| `--background` | `crema` | Fondo de la app |
| `--foreground` | `tinta` | Texto de cuerpo |
| `--card` | blanco | Tarjetas y superficies de formularios |
| `--primary` | `azul-500` | Botones principales, enlaces fuertes |
| `--primary-foreground` | blanco | Texto sobre primario |
| `--secondary` | `coral-100` | Superficies secundarias (el coral-500 es demasiado intenso para botones de planillas) |
| `--secondary-foreground` | `tinta` | Texto sobre secundario |
| `--accent` | `sol-100` | Hover y acentos de UI |
| `--accent-foreground` | `tinta` | Texto sobre acento |
| `--muted` | `crema-200` | Fondos suaves, tablas |
| `--muted-foreground` | `tinta-600` | Texto secundario (AA sobre crema y blanco) |
| `--border` / `--input` | `tinta-200` | Bordes |
| `--ring` | `azul-500` | Foco |
| `--destructive` | `#B91C1C` | Error (blanco encima) |
| `--success` | `hoja-500` | Éxito / desempeño superior (texto `tinta`) |
| `--warning` | `sol-500` | Advertencia / desempeño básico (texto `tinta`) |
| `--info` | `azul-500` | Información / desempeño alto (blanco encima) |
| `--chart-1`…`5` | azul, sol, coral, lila, hoja | Gráficas |

Para un botón o badge **con el color lleno** de marca, usar las utilidades directas (`bg-sol-500 text-tinta`, `bg-coral-500 text-tinta`, `bg-lila-500 text-white`, `bg-whatsapp text-whatsapp-foreground`), no el `variant` semántico.

## Tokens de estado

Derivados de la paleta, con contraste AA. Se usan en las insignias de desempeño (`calculateDS` en `lib/utils.ts`) y en acciones con semántica de estado. No hay modo oscuro activo.

| Token | Fuente | Foreground | Ratio | Uso |
| --- | --- | --- | --- | --- |
| `--destructive` | `#B91C1C` | blanco | 6.47:1 | Error; desempeño **BJ** (1.0–2.9) |
| `--warning` | `sol-500` | `tinta` | 8.56:1 | Advertencia; desempeño **B** (3.0–3.9) |
| `--info` | `azul-500` | blanco | 6.12:1 | Información; desempeño **A** (4.0–4.5) |
| `--success` | `hoja-500` | `tinta` | 5.07:1 | Éxito; desempeño **S** (4.6–5.0) |

Utilidades: `bg-success text-success-foreground`, `bg-warning text-warning-foreground`, `bg-info text-info-foreground`, `bg-destructive text-destructive-foreground`.

## Reglas de uso

1. **Texto de cuerpo** siempre `tinta` (o `tinta-600` para secundario) sobre `crema` o blanco. Contraste ≥ 4.5:1 (WCAG AA).
2. **Azul Angelito y Lila**: texto blanco. No poner `sol` ni `coral` como texto pequeño sobre estos fondos.
3. **Amarillo Sol y Coral**: solo texto oscuro (`tinta`). Nunca blanco.
4. **Verde Hoja**: solo decoración (formas, iconos de fondo) en la landing. No texto blanco encima de `hoja-500`. Como token `--success`, usar `tinta`.
5. **WhatsApp**: `bg-whatsapp` + `text-tinta` (el blanco sobre `#25D366` no cumple AA).
6. No usar paletas genéricas de Tailwind (`gray-*`, `slate-*`, `blue-*`, `green-*`, `red-*`, `yellow-*`, `bg-white`, etc.) en **todo el aplicativo** (landing, planillas, boletines y el resto). Usar tokens de marca (`azul`, `sol`, `coral`, `lila`, `hoja`, `tinta`, `crema`) o variables shadcn (`background`, `foreground`, `muted`, `border`, `primary`, `card`, `success`, `warning`, `info`, `destructive`).
7. Tipografía: **Fredoka** (`font-display`) en títulos (landing y páginas internas); **Nunito** (`font-sans`) en cuerpo.
8. **Estados:** `destructive` = error (BJ); `warning` = advertencia (B); `info` = información (A); `success` = éxito (S). El modo oscuro no está activo (no hay `ThemeProvider`); no usar clases `dark:`.

## Pares de contraste (AA 4.5:1)

Medidos sobre el hex de marca:

| Par | Ratio | AA |
| --- | --- | --- |
| Blanco sobre `azul-500` | 6.12:1 | Sí |
| Blanco sobre `azul-600` | 8.17:1 | Sí |
| `tinta` sobre `sol-500` | 8.56:1 | Sí |
| `tinta` sobre `coral-500` | 5.68:1 | Sí |
| Blanco sobre `lila-500` | 5.62:1 | Sí |
| `tinta` sobre `crema` | 12.56:1 | Sí |
| `tinta-600` sobre `crema` | 8.41:1 | Sí |
| `tinta-500` sobre `crema` | 5.55:1 | Sí |
| `tinta` sobre `whatsapp` | 6.63:1 | Sí |
| Blanco sobre `whatsapp` | 1.98:1 | **No** |
| Blanco sobre `hoja-500` | 2.59:1 | **No** |
| `tinta` sobre `hoja-500` (`success`) | 5.07:1 | Sí |
| Blanco sobre `--destructive` (`#B91C1C`) | 6.47:1 | Sí |

`hoja-500` sigue siendo solo decorativo en la landing. Como token semántico `--success` (insignias S, acciones de éxito) se usa con `tinta`, nunca con blanco. `--warning` reutiliza `tinta` sobre `sol-500`; `--info` reutiliza blanco sobre `azul-500`.

## Movimiento

Las animaciones de la landing usan `motion-safe:` y la clase `.reveal`. Si el usuario tiene `prefers-reduced-motion: reduce`, las animaciones se desactivan en `globals.css`.
