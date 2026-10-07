# Invitación Regis: Puerto Escondido

Una carta interactiva para Regina: sobre cerrado → apertura → invitación → celebración con fuegos artificiales de corazones y confeti. Sitio estático con HTML, CSS y JavaScript vanilla; sin backend, dependencias ni compilación.

## Ejecutar localmente

Abre `index.html` en un navegador moderno. También puedes servir la carpeta con `python -m http.server 8000` y visitar `http://localhost:8000`. No necesitas instalar paquetes.

## Archivos y assets

- `index.html`: textos, estructura y accesibilidad.
- `styles.css`: colores en `:root`, presentación responsive y animación del sobre.
- `script.js`: estados, audio y Canvas; tiempos y colores en `CONFIG`.
- `assets/snoopy.jpg`: imagen principal. Para cambiarla, modifica el `src`, el `alt` y las dimensiones en `index.html`.
- `assets/snoopy_waving.jpg` y `assets/cat.jpg`: alternativas disponibles.
- `assets/music.mp3`: copia de “The Night Does Not Belong To God (Instrumental).mp3”. Para sustituir la pista, conserva este nombre o cambia el `src` del audio.

Todas las rutas son relativas. Los originales suministrados se conservan en la carpeta local, fuera del control de versiones; las copias utilizadas están en `assets/`.

## GitHub Pages

1. Sube los archivos y la carpeta `assets` a la rama `main`.
2. Ve a **Settings > Pages** del repositorio.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Selecciona **main** y **/(root)** y guarda.
5. Espera a que GitHub termine el despliegue; Pages mostrará el enlace.

Un repositorio privado necesita un plan de GitHub que permita Pages privados; si tu plan no lo permite, deberás decidir si hacer público el repositorio. El sitio publicado puede ser público aunque el repositorio sea privado.

## Audio y accesibilidad

Se intenta iniciar la música al cargar. Los navegadores pueden bloquear el audio con sonido hasta una interacción: en ese caso se inicia al abrir el sobre. La pista no se repite ni se reinicia al aceptar y termina naturalmente. Recargar reinicia la experiencia.

El sobre y la aceptación son botones nativos compatibles con Enter y Espacio. Hay foco visible, texto alternativo, desplazamiento natural en pantallas pequeñas y respeto por `prefers-reduced-motion`. La versión con movimiento reducido abre la carta inmediatamente y usa una única explosión breve con pocas partículas.

El Canvas limita DPR a 2, reduce partículas en móvil y detiene `requestAnimationFrame` al terminar. Los estados se representan con `data-state`: `closed`, `opening`, `invitation`, `accepted`. La aceptación es simbólica y local: no se registra ni envía información.
