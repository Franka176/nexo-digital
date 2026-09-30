# Nexo Digital

Landing page de portfolio para una agencia digital ficticia orientada a pequeños y medianos negocios. El proyecto presenta una identidad visual propia y ejemplos conceptuales de servicios y proyectos.

## Características

- Diseño responsive para mobile, tablet y desktop.
- Navegación móvil con estado activo y cierre mediante Escape.
- Filtros de proyectos y ventana de detalles accesible.
- Acordeón de preguntas frecuentes.
- Validación frontend del formulario, con errores asociados y estado de demostración.
- Aparición progresiva al hacer scroll y microinteracciones, con soporte para `prefers-reduced-motion`.
- HTML semántico, enlace para saltar al contenido, foco visible y controles etiquetados.

## Tecnologías

- HTML5
- CSS3
- JavaScript vanilla
- Git y GitHub como herramientas previstas para el control de versiones; este proyecto no tiene una URL de producción configurada.

No utiliza frameworks, librerías externas, paquetes ni proceso de compilación.

## Estructura

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── img/
│   └── projects/
│       └── .gitkeep
├── README.md
└── .gitignore
```

`img/projects/.gitkeep` conserva el directorio para futuras imágenes. Las composiciones actuales de los proyectos se construyen con CSS.

## Funcionalidades

- Los enlaces de navegación llevan a las secciones de la página; en mobile, el menú se abre y cierra con su botón, con Escape o al elegir un enlace.
- Los filtros muestran proyectos por categoría. Cada botón de proyecto abre un diálogo con sus detalles, que puede cerrarse con Escape, el botón o el backdrop.
- El FAQ permite abrir una respuesta a la vez.
- El formulario valida nombre, email, servicio y mensaje. Es solo una demostración frontend: no envía, guarda ni transmite información.
- Las animaciones de aparición se activan al entrar en viewport y dejan el contenido visible cuando `IntersectionObserver` no está disponible.

## Accesibilidad

La página usa landmarks y encabezados semánticos, skip link, labels asociados, estados ARIA para el menú, el FAQ y el formulario, y controles con foco visible. El diálogo nativo gestiona su modalidad y el retorno del foco al elemento que lo abrió. Las animaciones respetan la preferencia de movimiento reducido.

## Responsive

La composición adapta navegación, grillas, títulos, formulario y tarjetas según el ancho disponible. Los breakpoints principales son 850 px, 740 px, 620 px y 360 px; además se usan tamaños fluidos con `clamp()`.

## Estado del proyecto

Nexo Digital y los casos de proyecto son ficticios y se presentan únicamente como portfolio. No representan clientes, resultados comerciales ni servicios reales. El formulario no tiene backend y no recibe consultas. No hay un sitio publicado.

## Ejecución local

Abrí `index.html` directamente en un navegador moderno. No hace falta instalar dependencias ni levantar un servidor.
