# Propuesta: caso Red Automotriz

## Diagnostico

El portafolio ya tiene una identidad clara: editorial, sobria y tecnica. La
materialidad vive en el vidrio de navegacion, metricas, dock y modal; el
contenido principal funciona como documento. Esa regla le da seriedad al sitio
porque evita que cada bloque compita por atencion.

En Red Automotriz el trabajo que falta no es agregar espectaculo, sino terminar
la evidencia. Las capturas nuevas cierran tres huecos narrativos:

- `red-vehiculo-listo.png`: prueba la salida automatica hacia el cliente.
- `red-fidelizacion.png`: prueba la tarjeta y el sistema de retorno.
- `red-encuesta.png`: prueba el seguimiento postservicio.

## Decision recomendada

No agregaria animaciones nuevas dentro del caso en esta etapa.

El modal ya tiene entrada de burbuja, el vidrio responde al puntero y la
navegacion tiene una gota con muelle. Si el caso tambien empieza a animarse de
forma protagonista, la pagina puede dejar de sentirse precisa y empezar a leerse
como demo visual. Red Automotriz debe sentirse como prueba de sistema entregado:
imagenes bien encuadradas, texto directo y scroll estable.

## Microanimaciones opcionales

Si luego quieres probar movimiento, lo haria solo con una de estas opciones:

1. Revelado suave de capturas dentro del modal: opacity de 0 a 1 y subida de
   8px cuando cada captura entra por primera vez en viewport.
2. Realce minimo del marco de captura al hover: el borde sube de intensidad y la
   sombra se asienta, sin escalar la imagen.
3. Indicador lateral discreto de progreso dentro del modal: una linea fina que
   acompane el scroll del caso, mas documental que decorativa.

La primera opcion es la mas alineada si se decide animar. Aun asi, la dejaria
para despues de cerrar todos los casos, para que el sistema de movimiento salga
de una regla general y no de una ocurrencia en un proyecto.

## Alcance de esta rama

- Las capturas nuevas quedan integradas en los apartados correctos.
- El componente de captura acepta dimensiones reales para evitar saltos y
  proporciones falsas.
- No se agregan nuevas animaciones al UI visible.
