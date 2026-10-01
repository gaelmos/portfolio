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
    const alturaRecorrible = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = alturaRecorrible > 0 ? window.scrollY / alturaRecorrible : 0;
    document.documentElement.style.setProperty('--progreso-scroll', progreso);

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
    formularioContacto.addEventListener('submit', async function(evento) {
        evento.preventDefault();

        const datosFormulario = new FormData(formularioContacto);
        const botonEnviar = formularioContacto.querySelector('button[type="submit"]');
        const estadoFormulario = document.getElementById('estado-formulario');
        const datosEnvio = {
            name: datosFormulario.get('nombre'),
            email: datosFormulario.get('email'),
            _subject: datosFormulario.get('asunto'),
            message: datosFormulario.get('mensaje')
        };

        botonEnviar.disabled = true;
        estadoFormulario.textContent = 'Enviando mensaje...';

        try {
            const respuesta = await fetch('https://formsubmit.co/ajax/gaelmos21@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosEnvio)
            });
            const resultado = await respuesta.json().catch(() => ({}));

            if (!respuesta.ok || resultado.success === false || resultado.success === 'false') {
                throw new Error(resultado.message || resultado.error || `El servicio respondió con el estado ${respuesta.status}.`);
            }

            estadoFormulario.textContent = '¡Mensaje enviado! Gracias por contactarme.';
            formularioContacto.reset();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            estadoFormulario.textContent = error instanceof TypeError
                ? 'No se pudo conectar con el servicio de correo. Revisá tu conexión e intentá de nuevo.'
                : `No se pudo enviar: ${error.message || 'ocurrió un error inesperado.'}`;
        } finally {
            botonEnviar.disabled = false;
        }
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

    function getCarouselGap() {
        return parseFloat(getComputedStyle(carousel).columnGap) || 0;
    }

    function getCarouselContentWidth() {
        const estilosCarrusel = getComputedStyle(carousel);
        const paddingHorizontal = parseFloat(estilosCarrusel.paddingLeft) + parseFloat(estilosCarrusel.paddingRight);
        return carousel.clientWidth - paddingHorizontal;
    }

    // Configurar el ancho de los slides
    function setupSlides() {
        const containerWidth = getCarouselContentWidth();
        const gap = getCarouselGap();
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
        const containerWidth = getCarouselContentWidth();
        const gap = getCarouselGap();
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
    const elementosRevelar = document.querySelectorAll(
        '.hero-copy, .hero-retrato, .tarjeta-info, .estadisticas, .cta-trabajemos, .columna-izquierda, .columna-derecha > *, .grid-servicios > *, .cta-servicios > *, .titulo-proyectos, .carousel-container, .contenedor-contacto > *'
    );

    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observerRevelado = new IntersectionObserver((entradas, observer) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                    observer.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

        elementosRevelar.forEach((elemento, indice) => {
            elemento.classList.add('revelar');
            elemento.style.setProperty('--revelar-demora', `${(indice % 5) * 70}ms`);
            observerRevelado.observe(elemento);
        });
    }

    const retrato = document.querySelector('.hero-retrato');
    const permiteParallax = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (retrato && permiteParallax && !reduceMovimiento) {
        retrato.addEventListener('pointermove', evento => {
            const limites = retrato.getBoundingClientRect();
            const desplazamientoX = (evento.clientX - limites.left) / limites.width - 0.5;
            const desplazamientoY = (evento.clientY - limites.top) / limites.height - 0.5;
            retrato.style.setProperty('--parallax-x', `${desplazamientoX * -10}px`);
            retrato.style.setProperty('--parallax-y', `${desplazamientoY * -10}px`);
        });

        retrato.addEventListener('pointerleave', () => {
            retrato.style.setProperty('--parallax-x', '0px');
            retrato.style.setProperty('--parallax-y', '0px');
        });
    }

    document.querySelectorAll('.enlace-proyecto').forEach(enlace => {
        const tituloProyecto = enlace.closest('.info-proyecto')?.querySelector('.titulo-proyecto')?.textContent.trim();
        if (tituloProyecto) {
            enlace.setAttribute('aria-label', `Ver proyecto ${tituloProyecto}`);
        }
    });

    initCarousel();
});