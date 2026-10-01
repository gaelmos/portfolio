// Variables globales
let seccionActual = 'inicio';
let animacionEstadisticasEjecutada = false;

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', function(evento) {
        evento.preventDefault();
        const idSeccion = this.getAttribute('href');
        const seccion = document.querySelector(idSeccion);
        
        if (seccion) {
            seccion.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Actualizar navegación activa al hacer scroll
window.addEventListener('scroll', function() {
    const secciones = document.querySelectorAll('section[id]');
    const posicionScroll = window.scrollY + 150;
    
    secciones.forEach(seccion => {
        const alturaSeccion = seccion.offsetHeight;
        const offsetSeccion = seccion.offsetTop;
        const idSeccion = seccion.getAttribute('id');
        
        if (posicionScroll >= offsetSeccion && posicionScroll < offsetSeccion + alturaSeccion) {
            document.querySelectorAll('.enlace-nav').forEach(enlace => {
                enlace.classList.remove('activo');
            });
            
            const enlaceActivo = document.querySelector(`.enlace-nav[href="#${idSeccion}"]`);
            if (enlaceActivo) {
                enlaceActivo.classList.add('activo');
            }
            
            seccionActual = idSeccion;
        }
    });
    
    // Animar estadísticas cuando sean visibles
    const seccionEstadisticas = document.querySelector('.estadisticas');
    if (seccionEstadisticas && !animacionEstadisticasEjecutada) {
        const rectEstadisticas = seccionEstadisticas.getBoundingClientRect();
        if (rectEstadisticas.top < window.innerHeight && rectEstadisticas.bottom > 0) {
            animarEstadisticas();
            animacionEstadisticasEjecutada = true;
        }
    }
});

// Animar contadores de estadísticas
function animarEstadisticas() {
    const numerosEstadisticas = document.querySelectorAll('.numero-estadistica');
    
    numerosEstadisticas.forEach(numero => {
        const objetivo = parseInt(numero.getAttribute('data-objetivo'));
        const duracion = 3000; // 2 segundos
        const incremento = objetivo / (duracion / 30); // 60 FPS
        let valorActual = 0;
        
        const actualizarContador = () => {
            valorActual += incremento;
            if (valorActual < objetivo) {
                numero.textContent = Math.floor(valorActual);
                requestAnimationFrame(actualizarContador);
            } else {
                numero.textContent = objetivo + (objetivo === 5 || objetivo === 10 ? '+' : ''); // Añadir '+' a ciertos valores
            }
        };
        
        actualizarContador();
    });
}

// Cambiar servicios
const itemsMenuServicio = document.querySelectorAll('.item-menu-servicio');
const detallesServicio = document.querySelectorAll('.servicio-detalle');

itemsMenuServicio.forEach(item => {
    item.addEventListener('click', function() {
        const servicioSeleccionado = this.getAttribute('data-servicio');
        
        itemsMenuServicio.forEach(tab => {
            const seleccionado = tab === this;
            tab.classList.toggle('activo', seleccionado);
            tab.setAttribute('aria-selected', seleccionado);
            tab.setAttribute('tabindex', seleccionado ? '0' : '-1');
        });

        detallesServicio.forEach(detalle => {
            const seleccionado = detalle.getAttribute('data-servicio') === servicioSeleccionado;
            detalle.classList.toggle('activo', seleccionado);
            detalle.hidden = !seleccionado;
        });

        const detalleActivo = document.querySelector(`.servicio-detalle[data-servicio="${servicioSeleccionado}"]`);
        if (detalleActivo) {
            detalleActivo.classList.add('activo');
        }
    });

    item.addEventListener('keydown', function(evento) {
        const indiceActual = Array.from(itemsMenuServicio).indexOf(this);
        let indiceSiguiente;

        if (evento.key === 'ArrowDown' || evento.key === 'ArrowRight') {
            indiceSiguiente = (indiceActual + 1) % itemsMenuServicio.length;
        } else if (evento.key === 'ArrowUp' || evento.key === 'ArrowLeft') {
            indiceSiguiente = (indiceActual - 1 + itemsMenuServicio.length) % itemsMenuServicio.length;
        } else if (evento.key === 'Home') {
            indiceSiguiente = 0;
        } else if (evento.key === 'End') {
            indiceSiguiente = itemsMenuServicio.length - 1;
        } else {
            return;
        }

        evento.preventDefault();
        itemsMenuServicio[indiceSiguiente].focus();
        itemsMenuServicio[indiceSiguiente].click();
    });
});

// Manejo del formulario de contacto
const formularioContacto = document.getElementById('formulario-contacto');

if (formularioContacto) {
    formularioContacto.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        const datosFormulario = new FormData(formularioContacto);
        const nombre = datosFormulario.get('nombre').trim();
        const email = datosFormulario.get('email').trim();
        const asunto = datosFormulario.get('asunto').trim();
        const mensaje = datosFormulario.get('mensaje').trim();
        const cuerpo = `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`;
        const enlaceCorreo = `mailto:gaelmos21@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

        document.getElementById('estado-formulario').textContent = 'Se abrirá tu aplicación de correo para que revises y envíes el mensaje.';
        window.location.href = enlaceCorreo;
    });
}

// Menú móvil
const botonMenuMovil = document.querySelector('.boton-menu-movil');
const menuNav = document.querySelector('.menu-nav');

if (botonMenuMovil) {
    botonMenuMovil.addEventListener('click', function() {
        const menuAbierto = menuNav.classList.toggle('activo');
        this.classList.toggle('activo', menuAbierto);
        this.setAttribute('aria-expanded', menuAbierto);
        this.setAttribute('aria-label', menuAbierto ? 'Cerrar menú' : 'Abrir menú');
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.enlace-nav').forEach(enlace => {
        enlace.addEventListener('click', function() {
            menuNav.classList.remove('activo');
            botonMenuMovil.classList.remove('activo');
            botonMenuMovil.setAttribute('aria-expanded', 'false');
            botonMenuMovil.setAttribute('aria-label', 'Abrir menú');
        });
    });

    document.addEventListener('keydown', function(evento) {
        if (evento.key === 'Escape' && menuNav.classList.contains('activo')) {
            menuNav.classList.remove('activo');
            botonMenuMovil.classList.remove('activo');
            botonMenuMovil.setAttribute('aria-expanded', 'false');
            botonMenuMovil.setAttribute('aria-label', 'Abrir menú');
            botonMenuMovil.focus();
        }
    });
}

// Carrusel de proyectos
function initCarousel() {
    const carousel = document.querySelector('.carousel-proyectos');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const slides = carousel.querySelectorAll('.tarjeta-proyecto');
    let currentSlide = 0;
    let slidesToShow = getSlidesToShow();

    function getSlidesToShow() {
        return window.innerWidth > 968 ? 3 : window.innerWidth > 640 ? 2 : 1;
    }

    // Configurar el ancho de los slides
    function setupSlides() {
        const containerWidth = carousel.clientWidth;
        const gap = 32; // 2rem en pixeles
        const totalGaps = slidesToShow - 1;
        const totalGapWidth = gap * totalGaps;
        const slideWidth = (containerWidth - totalGapWidth) / slidesToShow;
        
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}px`;
            slide.style.maxWidth = `${slideWidth}px`;
        });
    }

    // Crear puntos de navegación
    function createDots() {
        dotsContainer.innerHTML = '';
        const numDots = Math.ceil(slides.length / slidesToShow);
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Ver grupo ${i + 1} de proyectos`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Actualizar la posición del carrusel
    function updateCarousel() {
        const containerWidth = carousel.clientWidth;
        const gap = 32; // 2rem en pixeles
        const totalGaps = slidesToShow - 1;
        const totalGapWidth = gap * totalGaps;
        const slideWidth = (containerWidth - totalGapWidth) / slidesToShow;
        const offset = -currentSlide * (slideWidth + gap) * slidesToShow;
        carousel.style.transform = `translateX(${offset}px)`;
        
        // Actualizar dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
            dot.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
        });

        const primerSlideVisible = currentSlide * slidesToShow;
        slides.forEach((slide, index) => {
            const visible = index >= primerSlideVisible && index < primerSlideVisible + slidesToShow;
            slide.setAttribute('aria-hidden', !visible);
            slide.toggleAttribute('inert', !visible);
        });

        // Actualizar estado de los botones
        const maxSlide = Math.ceil(slides.length / slidesToShow) - 1;
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === maxSlide;
    }

    // Ir a un slide específico
    function goToSlide(index) {
        const maxSlide = Math.ceil(slides.length / slidesToShow) - 1;
        currentSlide = Math.max(0, Math.min(index, maxSlide));
        updateCarousel();
    }

    // Event listeners para los botones
    prevButton.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });

    nextButton.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });

    // Responsive
    window.addEventListener('resize', () => {
        slidesToShow = getSlidesToShow();
        currentSlide = Math.min(currentSlide, Math.ceil(slides.length / slidesToShow) - 1);
        setupSlides();
        createDots();
        updateCarousel();
    });

    // Inicialización
    setupSlides();
    createDots();
    updateCarousel();
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.enlace-proyecto').forEach(enlace => {
        const tituloProyecto = enlace.closest('.info-proyecto')?.querySelector('.titulo-proyecto')?.textContent.trim();
        if (tituloProyecto) {
            enlace.setAttribute('aria-label', `Ver proyecto ${tituloProyecto}`);
        }
    });

    initCarousel();
});