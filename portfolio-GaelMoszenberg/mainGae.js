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
        
        // Remover clase activa de todos los items
        itemsMenuServicio.forEach(i => i.classList.remove('activo'));
        detallesServicio.forEach(d => d.classList.remove('activo'));
        
        // Agregar clase activa al item seleccionado
        this.classList.add('activo');
        const detalleActivo = document.querySelector(`.servicio-detalle[data-servicio="${servicioSeleccionado}"]`);
        if (detalleActivo) {
            detalleActivo.classList.add('activo');
        }
    });
});

// Manejo del formulario de contacto
const formularioContacto = document.getElementById('formulario-contacto');

if (formularioContacto) {
    formularioContacto.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica
        if (!nombre || !email || !asunto || !mensaje) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        // Validar email
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }
        
        // Aquí normalmente enviarías los datos a un servidor
        console.log('Formulario enviado:', { nombre, email, asunto, mensaje });
        
        // Mostrar mensaje de éxito
        alert('¡Mensaje enviado con éxito! Te contactaré pronto.');
        
        // Limpiar formulario
        formularioContacto.reset();
    });
}

// Menú móvil
const botonMenuMovil = document.querySelector('.boton-menu-movil');
const menuNav = document.querySelector('.menu-nav');

if (botonMenuMovil) {
    botonMenuMovil.addEventListener('click', function() {
        menuNav.classList.toggle('activo');
        this.classList.toggle('activo');
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.enlace-nav').forEach(enlace => {
        enlace.addEventListener('click', function() {
            menuNav.classList.remove('activo');
            botonMenuMovil.classList.remove('activo');
        });
    });
}

// Efecto parallax suave en las tarjetas
document.querySelectorAll('.tarjeta-info, .tarjeta-proyecto').forEach(tarjeta => {
    tarjeta.addEventListener('mousemove', function(evento) {
        const rect = this.getBoundingClientRect();
        const x = evento.clientX - rect.left;
        const y = evento.clientY - rect.top;
        
        const centroX = rect.width / 2;
        const centroY = rect.height / 2;
        
        const rotacionX = (y - centroY) / 20;
        const rotacionY = (centroX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotacionX}deg) rotateY(${rotacionY}deg) translateY(-5px)`;
    });
    
    tarjeta.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Carrusel de proyectos
function initCarousel() {
    const carousel = document.querySelector('.carousel-proyectos');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const slides = carousel.querySelectorAll('.tarjeta-proyecto');
    let currentSlide = 0;
    const slidesToShow = window.innerWidth > 968 ? 3 : window.innerWidth > 640 ? 2 : 1;

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
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
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
    console.log('Portfolio cargado correctamente');
    
    // Agregar animación de entrada a las secciones
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('section').forEach(seccion => {
        seccion.style.opacity = '0';
        seccion.style.transform = 'translateY(30px)';
        seccion.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observador.observe(seccion);
    });

    // Inicializar el carrusel
    initCarousel();
});