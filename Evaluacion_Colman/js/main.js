document.addEventListener('DOMContentLoaded', function() {
    // Tema
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Cargar config
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    // Toggle tema
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Init tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Scroll fx
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
    
    // Lightbox
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
    
    // Form handler
    if (document.getElementById('contactForm')) {
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre');
            const email = document.getElementById('email');
            const mensaje = document.getElementById('mensaje');
            let isValid = true;
            
            // Nombre
            if (nombre.value.trim() === '') {
                nombre.classList.add('is-invalid');
                isValid = false;
            } else {
                nombre.classList.remove('is-invalid');
            }
            
            // Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            } else {
                email.classList.remove('is-invalid');
            }
            
            // Mensaje
            if (mensaje.value.trim() === '') {
                mensaje.classList.add('is-invalid');
                isValid = false;
            } else {
                mensaje.classList.remove('is-invalid');
            }
            
            if (isValid) {
                const formData = new FormData(contactForm);
                const formResponse = document.getElementById('formResponse');
                
                // Loading
                formResponse.innerHTML = '<div class="alert alert-info">Enviando mensaje...</div>';
                
                fetch('php/contacto.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        formResponse.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
                        contactForm.reset();
                    } else {
                        formResponse.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    formResponse.innerHTML = '<div class="alert alert-danger">Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.</div>';
                });
            } else {
                document.getElementById('formResponse').innerHTML = '<div class="alert alert-warning">Por favor, complete todos los campos correctamente.</div>';
            }
        });
    }
    
    // Geo
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('Ubicación del usuario:', position.coords.latitude, position.coords.longitude);
                // TODO: API geo
            },
            function(error) {
                console.error('Error al obtener la ubicación:', error);
                // IP fallback
                fetch('https://ipapi.co/json/')
                    .then(response => response.json())
                    .then(data => {
                        console.log('Ubicación aproximada (IP):', data.city, data.country_name);
                    });
            }
        );
    }
});