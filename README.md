# Portafolio — Eduardo Vegas

Sitio personal. Next.js sobre Vercel, sin dependencias de interfaz: todo el
diseño y las interacciones están escritos a mano.

## La idea

El vidrio es jerarquía, no piel. Solo flotan como vidrio la barra, la tira de
métricas y las fichas de los proyectos; el contenido siempre es opaco. En una
paleta de un solo color, el acento es el brillo y no el tono.

## Cómo está armado

```
app/
  page.tsx              La página entera
  globals.css           Sistema de diseño: paletas, vidrio, responsive
  opengraph-image.tsx   La tarjeta de compartir, generada desde el código
  icon.tsx              El favicon, también generado
lib/
  content.ts            Todo el texto, las cifras y los proyectos
  theme.ts              Las seis paletas
components/site/
  navegacion.tsx        La barra con la gota que persigue al puntero
  lupa.tsx              La burbuja que amplía las capturas
  vidrio-liquido.tsx    Refracción real con mapas de desplazamiento
  caso-modal.tsx        El caso completo de un proyecto
  nota-modal.tsx        La ficha corta de una entrada del archivo
```

Para cambiar textos o cifras no hace falta tocar un componente: todo vive en
`lib/content.ts`.

## Detalles que quizá interesen

**Refracción, no desenfoque.** Un cristal no emborrona lo que hay detrás: lo
desplaza, y solo en el canto. Se genera un mapa de desplazamiento por elemento a
partir del campo de distancia de su forma, con perfil squircle, y se aplica con
`feDisplacementMap` dentro de `backdrop-filter`.

**Seguimiento viscoso.** La gota de la barra y la lupa no usan muelle: un muelle
rígido integrado paso a paso se vuelve inestable y tiembla. Usan suavizado
exponencial, que nunca oscila. La deformación nace de la separación respecto al
cursor —no de la velocidad—, así que un golpe corto y rápido apenas la estira,
como haría el agua.

**Sin librerías de UI.** Los diálogos son `<dialog>` nativo: foco atrapado,
Escape y `::backdrop` sin dependencias.

## Correr en local

```bash
npm install
npm run dev
```

Si al editar `globals.css` los cambios no aparecen, Turbopack está sirviendo el
CSS anterior: `npm run dev:limpio`.

## Paletas

Hay seis. Se cambia la activa en `lib/theme.ts`. En desarrollo aparece un
selector flotante para probarlas en vivo; en producción no.
