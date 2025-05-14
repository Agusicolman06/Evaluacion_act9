document.addEventListener('DOMContentLoaded', function() {
    // Modo claro/oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Cargar preferencia del usuario
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    // Escuchar cambios en el toggle
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Efectos de scroll
    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
            }
        });
    });
    
    // Galería de imágenes (para portfolio.html)
    if (document.querySelector('.gallery-img')) {
        const images = document.querySelectorAll('.gallery-img');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img src="" alt="Imagen ampliada">
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        
        images.forEach(img => {
            img.addEventListener('click', function() {
                lightbox.style.display = 'flex';
                lightboxImg.src = this.src;
            });
        });
        
        closeBtn.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });
        
        lightbox.addEventListener('click', function(e) {
            if (e.target !== lightboxImg) {
                lightbox.style.display = 'none';
            }
        });
    }
    
    // Validación de formulario (para contacto.html)
    if (document.getElementById('contactForm')) {
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre');
            const email = document.getElementById('email');
            const mensaje = document.getElementById('mensaje');
            let isValid = true;
            
            // Validar nombre
            if (nombre.value.trim() === '') {
                nombre.classList.add('is-invalid');
                isValid = false;
            } else {
                nombre.classList.remove('is-invalid');
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            } else {
                email.classList.remove('is-invalid');
            }
            
            // Validar mensaje
            if (mensaje.value.trim() === '') {
                mensaje.classList.add('is-invalid');
                isValid = false;
            } else {
                mensaje.classList.remove('is-invalid');
            }
            
            if (isValid) {
                // Aquí iría la lógica para enviar el formulario con AJAX
                alert('Formulario enviado correctamente. Nos pondremos en contacto pronto.');
                contactForm.reset();
            } else {
                alert('Por favor, complete todos los campos correctamente.');
            }
        });
    }
    
    // Geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('Ubicación del usuario:', position.coords.latitude, position.coords.longitude);
                // Aquí podrías usar una API para obtener la ciudad/país
            },
            function(error) {
                console.error('Error al obtener la ubicación:', error);
                // Fallback con IP-based
                fetch('https://ipapi.co/json/')
                    .then(response => response.json())
                    .then(data => {
                        console.log('Ubicación aproximada (IP):', data.city, data.country_name);
                    });
            }
        );
    }
});