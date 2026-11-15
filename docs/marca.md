# Marca Matchpoint

Guía corta para que la app y la web (`matchpoint-web`) se vean y se comporten igual.
Matchpoint son torneos de vóley playa: deporte, energía y competencia, con la estética
de un **marcador en vivo**. Producto de Miralab.

Código fuente de los tokens: `lib/theme/tokens.ts` (espaciado, radios, tipos, movimiento),
`constants/Colors.ts` (neutros) y `lib/theme/colors.ts` (acentos por tema).
En la web: variables CSS en `matchpoint-web/app/globals.css`.

---

## 1. Tipografía

Dos familias de Google Fonts, ambas con licencia libre (SIL Open Font License).

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| Display | **Barlow Condensed** | 500–800, itálica y recta | Títulos de pantalla, nombres de torneo, botones, números de marcador |
| Texto | **Inter** | 400, 500, 600, 700, 800 | Todo lo demás: listas, formularios, ayudas |

Reglas:

- **Marcador y números**: Barlow Condensed ExtraBold recta, siempre con cifras tabulares
  (`fontVariant: ['tabular-nums']` / `font-variant-numeric: tabular-nums`) para que los
  dígitos no bailen cuando cambia el puntaje.
- **Títulos**: Barlow Condensed itálica, en mayúsculas. La itálica es la "voz deportiva".
- **Botones**: Barlow Condensed Bold recta, mayúsculas, con algo de tracking (0,6–0,8).
- **Texto corrido**: Inter Regular 15/22. Nunca en mayúsculas ni en itálica.
- **Etiquetas de sección**: Inter Bold 11, mayúsculas, tracking 1,2.

En la app, `components/ui/Text.tsx` reemplaza a `Text`/`TextInput` de React Native y aplica
la familia según el estilo: itálica → Barlow Condensed; resto → Inter con el peso pedido.
Un `fontFamily` explícito siempre gana. En la web se cargan con `next/font/google`.

Escala (app, px):

| Token | Tamaño | Familia |
|---|---|---|
| `displayXl` | 40 | Barlow Condensed ExtraBold Italic |
| `displayLg` | 30 | Barlow Condensed ExtraBold Italic |
| `displayMd` | 22 | Barlow Condensed Bold Italic |
| `title` | 17 | Inter Bold |
| `body` | 15 | Inter Regular |
| `caption` | 12 | Inter Medium |
| `label` | 11 | Inter Bold, mayúsculas |

---

## 2. Color

Fondo oscuro único ("cancha de noche") y dos acentos con nombre propio.

| Token | Valor | Uso |
|---|---|---|
| `background` | `#121214` | Fondo de todas las pantallas |
| `surface` | `#1C1C21` | Tarjetas, barras |
| `surfaceLight` | `#2A2A31` | Elevado, seleccionado, skeleton |
| `border` | `#2E2E36` | Bordes finos y divisores |
| `text` | `#F4F4F5` | Texto principal |
| `textSecondary` | `#A1A1AA` | Texto secundario |
| `textMuted` | `#71717A` | Ayudas, deshabilitado |
| **Punto** (`yellow`) | `#FBBF24` | Acento principal: botón primario, pestaña activa, equipo A |
| **Saque** (`violet`) | `#8B5CF6` | Acento secundario: divisiones, equipo B |
| `live` | `#EF4444` | Indicador "en vivo" |
| `success` | `#22C55E` | Confirmaciones |
| `danger` | `#E11D48` | Acciones destructivas |

Reglas:

- Sobre amarillo, texto oscuro (`#111113`). Sobre violeta, texto blanco.
- El tema por defecto ("Matchpoint") usa Punto + Saque. Los otros temas solo cambian los
  dos acentos; los neutros son siempre los mismos.
- Un solo acento fuerte por bloque. Si todo brilla, nada destaca.
- Sin degradados de fondo: el color hace el trabajo.

---

## 3. Espaciado y radios

Escala de 4 puntos: `4 · 8 · 12 · 16 · 24 · 32 · 48`.

- Margen lateral de pantalla: **20**.
- Entre tarjetas: 16. Dentro de una tarjeta: 16–18.
- Entre secciones: 24–32. Preferir aire antes que bordes.

Radios: `sm 8` (chips) · `md 12` (botones, filas) · `lg 16` (tarjetas) · `xl 24` · `pill`
(control segmentado, botón flotante).

Áreas táctiles: mínimo 44×44.

---

## 4. Iconografía

Un solo set: **Ionicons** (en la app con `@expo/vector-icons`, en la web con
`react-icons/io5`). Componente de la app: `components/ui/Icon.tsx`.

- **Contorno** (`-outline`) por defecto. **Relleno** solo para el estado activo o
  seleccionado (por ejemplo, la pestaña actual).
- Tamaños: 16 (en línea con texto), 20 (filas), 24 (barra de pestañas, acciones).
- El color sigue al texto que acompaña; el acento solo para lo accionable o lo activo.
- Dos glifos deportivos que Ionicons no tiene (`volleyball`, `wind`) están dibujados en
  `Icon.tsx` con el mismo trazo redondeado (adaptados de Lucide, licencia ISC).
- Nada de letras como íconos (ej. "WL"): usar un ícono (`hourglass-outline` para lista de espera).

---

## 5. Movimiento

Corto, funcional y opcional.

| Token | Duración | Uso |
|---|---|---|
| `press` | 120 ms | Al apretar: escala 0,97 |
| `fast` | 160 ms | Cambios de estado chicos |
| `base` | 220 ms | Entrada de tarjetas y estados vacíos: fundido + subida de 8 px |
| `slow` | 320 ms | Cambio de mes, punto en el marcador |

- Curva: `ease-out` cúbica.
- Listas: entrada escalonada de 40 ms por elemento, con tope de 240 ms.
- Carga: skeleton con pulso suave (no spinners en pantallas completas).
- Si el sistema pide reducir movimiento (`useReducedMotion` / `prefers-reduced-motion`),
  todo queda estático.

---

## 6. Principios de UX

1. **El marcador manda.** En un partido, el puntaje es lo más grande de la pantalla y se
   lee de un vistazo, a pleno sol.
2. **Un toque, una acción.** Cada pantalla tiene una acción principal clara (amarilla);
   lo demás es secundario o va al menú.
3. **Siempre sabés en qué estado estás.** Fechas, división, en vivo, próximo o terminado se
   muestran como chips, no escondidos en texto.
4. **Nada vacío sin salida.** Todo estado vacío o de error explica qué pasa y ofrece una
   acción (crear torneo, reintentar).
5. **Simple antes que completo.** No sumar funciones para llenar espacio: el aire también
   es diseño.

Palabras: se dice **marcador en vivo** (nunca "transmisión") y **Pronósticos** (no "apuestas").
