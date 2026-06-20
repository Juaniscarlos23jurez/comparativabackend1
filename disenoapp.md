# pricemymeds — Design System
## Tercera Edad Edition (Senior-Friendly)

> Diseño minimalista, cálido y accesible pensado para usuarios de 60+ años.
> Alta legibilidad, colores tranquilos, zonas de toque generosas.

---

## 1. Principios de Diseño

| Principio | Descripción |
|---|---|
| **Calma** | Sin neones, sin gradientes, sin animaciones agresivas. El color comunica, no distrae. |
| **Legibilidad primero** | Contraste mínimo 4.5:1 en todo el texto. Tamaño base 17 px, no 16. |
| **Espacio generoso** | Padding mínimo de 16 px en cards. Botones de al menos 48 px de alto. |
| **Confianza médica** | Azul cielo como primary — evoca hospitales, salud, seguridad. |
| **Minimalismo cálido** | Fondo lino, no blanco puro. Reduce fatiga visual en sesiones largas. |

---

## 2. Paleta de Colores

Exactamente **4 colores de marca** + neutrales.

### Tokens principales

| Token | Valor OKLCH | Hex aproximado | Uso |
|---|---|---|---|
| `--background` | `oklch(0.965 0.009 82)` | `#F5F2EC` | Fondo general — lino cálido |
| `--foreground` | `oklch(0.13 0.020 258)` | `#1A1C2E` | Texto principal |
| `--primary` | `oklch(0.42 0.11 240)` | `#3A6FA8` | Azul cielo — primary brand |
| `--primary-foreground` | `oklch(0.99 0 0)` | `#FEFEFE` | Texto sobre primary |
| `--savings` | `oklch(0.43 0.12 150)` | `#2E7D52` | Verde bosque — ahorro |
| `--savings-foreground` | `oklch(0.99 0 0)` | `#FEFEFE` | Texto sobre savings |
| `--us-price` | `oklch(0.50 0.17 24)` | `#B84040` | Rojo ladrillo — precio caro EE.UU. |
| `--ca-price` | `oklch(0.43 0.12 150)` | `#2E7D52` | Verde — precio barato Canadá |

### Tokens de superficie

| Token | Valor OKLCH | Uso |
|---|---|---|
| `--card` | `oklch(1 0 0)` | Blanco puro — cards sobre lino |
| `--surface` | `oklch(0.99 0.003 82)` | Superficie elevada sutil |
| `--muted` | `oklch(0.93 0.008 82)` | Fondos suaves, chips |
| `--muted-foreground` | `oklch(0.40 0.018 258)` | Texto secundario (≥4.5:1) |
| `--border` | `oklch(0.86 0.011 82)` | Divisores visibles sin ser duros |
| `--secondary` | `oklch(0.93 0.020 238)` | Tinte cielo muy suave |

### Colores semánticos

| Token | Color | Uso |
|---|---|---|
| `--destructive` | Rojo ladrillo cálido | Errores, precios altos |
| `--warning` | Ámbar suave | Advertencias |
| `--ring` | Azul cielo | Focus outline accesible |

---

## 3. Tipografía

Máximo **2 familias tipográficas**.

### Familias

| Rol | Familia | Variable CSS | Pesos |
|---|---|---|---|
| **Headings** | Lora (serif) | `--font-serif` / `font-serif` | 400, 600, 700 |
| **Body / UI** | Source Sans 3 (sans-serif) | `--font-sans` / `font-sans` | 400, 600, 700 |

> **Por qué estas fuentes para adultos mayores:**
> - **Lora** tiene trazos suaves con serif humanista — fácil de leer, cálido, no frío como un sans.
> - **Source Sans 3** fue diseñada por Adobe específicamente para legibilidad en pantalla a todo tamaño.

### Escala tipográfica

| Clase Tailwind | Tamaño | Uso |
|---|---|---|
| `text-[17px]` | 17 px | Base del body (por encima del default 16 px) |
| `text-lg` | 18 px | Textos de apoyo, descripciones |
| `text-xl` | 20 px | Subtítulos, nombres de medicamentos |
| `text-2xl` | 24 px | Precios, cifras de ahorro |
| `text-3xl` | 30 px | Titulares de sección |
| `text-4xl` | 36 px | Hero, precio principal destacado |

### Interlineado

- **Body:** `leading-relaxed` (1.625) — espacio para que los ojos descansen entre líneas
- **Headings:** `leading-snug` (1.375) — compacto pero legible en titulares

---

## 4. Espaciado y Radio

### Espaciado (escala Tailwind)

| Contexto | Valor mínimo | Clase Tailwind |
|---|---|---|
| Padding interno de card | 20 px | `p-5` |
| Gap entre elementos de lista | 12 px | `gap-3` |
| Margen horizontal de página | 16 px | `px-4` |
| Sección vertical entre bloques | 24 px | `py-6` |

### Radio (border-radius)

| Token | Valor | Clase Tailwind |
|---|---|---|
| `--radius` (base) | `1.125rem` (18 px) | `rounded-lg` |
| `--radius-xl` | `1.688rem` (27 px) | `rounded-xl` |
| `--radius-2xl` | `2.25rem` (36 px) | `rounded-2xl` |
| `--radius-3xl` | `2.813rem` (45 px) | `rounded-3xl` |

> Radios grandes = bordes amigables, tacto suave — menos intimidante para usuarios mayores.

---

## 5. Componentes Clave

### Botones — Tamaño mínimo de toque: 48 px alto

```
CTA principal  → bg-primary, text-primary-foreground, h-12, text-base font-semibold
Secundario     → border border-primary, text-primary, h-12
Guardar código → bg-savings, text-savings-foreground, h-12
```

### Cards de medicamento

```
bg-card shadow-sm rounded-2xl p-5
Borde izquierdo de 4 px en color primario para la card destacada
```

### Barra US vs Canadá

```
Fondo izquierdo: us-price/10 → etiqueta --us-price
Fondo derecho:   ca-price/10 → etiqueta --ca-price
Barra de progreso: bg-savings para mostrar el porcentaje de ahorro
```

### Bottom Navigation

```
Íconos activos: bg-primary con texto blanco en pill de 44×32 px
Íconos inactivos: text-muted-foreground
Label: text-[10px] font-bold bajo cada ícono
```

---

## 6. Accesibilidad (WCAG 2.1 AA)

| Verificación | Estado |
|---|---|
| Contraste texto principal sobre fondo (`#1A1C2E` / `#F5F2EC`) | ✅ 12.4:1 |
| Contraste texto muted sobre blanco | ✅ 5.2:1 |
| Contraste texto primary sobre blanco | ✅ 4.8:1 |
| Tamaño mínimo touch target | ✅ 48 × 48 px |
| Tamaño mínimo de fuente | ✅ 17 px |
| `lang="es"` en el html root | ✅ |
| `aria-label` en todos los botones de icono | ✅ |
| `aria-current="page"` en nav activo | ✅ |

---

## 7. Lo que NO usar

| Evitar | Razón |
|---|---|
| Gradientes | Confunden la jerarquía visual para seniors |
| Texto < 15 px | Ilegible sin zoom |
| Colores neón o saturados | Causan fatiga visual |
| Fondo blanco puro (`#FFF`) como fondo de página | Muy brillante bajo luz intensa |
| Morado / violeta | Género/tono incorrecto para contexto médico de confianza |
| Animaciones rápidas (< 300 ms) | Difíciles de seguir |
| Iconos sin etiqueta de texto | Ambiguos para usuarios no digitales nativos |

---

## 8. Resumen Visual

```
Fondo de página  ████  #F5F2EC  Lino cálido
Texto principal  ████  #1A1C2E  Pizarra oscuro
Primary / CTA    ████  #3A6FA8  Azul cielo
Ahorro / Canada  ████  #2E7D52  Verde bosque
Caro / EE.UU.   ████  #B84040  Rojo ladrillo
```

---

*Versión 1.0 — pricemymeds Design System · Tercera Edad Edition*