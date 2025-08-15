$(document).ready(function() {
    // Mobile Menu Toggle
    $('.mobile-menu-btn').click(function() {
        $('nav ul').toggleClass('show');
    });

    // Hero Slider
    let currentSlide = 0;
    const slides = $('.hero-slider .slide');
    const dots = $('.slider-dots .dot');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.removeClass('active');
        dots.removeClass('active');
        slides.eq(index).addClass('active');
        dots.eq(index).addClass('active');
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }

    // Navigation buttons
    $('.next-slide').click(nextSlide);
    $('.prev-slide').click(prevSlide);

    // Dot navigation
    $('.dot').click(function() {
        const slideIndex = $(this).data('slide');
        showSlide(slideIndex);
        resetAutoSlide();
    });

    // Auto slide change every 6 seconds
    let slideInterval = setInterval(nextSlide, 6000);

    function resetAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    }

    // Pause auto slide on hover
    $('.hero').hover(
        function() {
            clearInterval(slideInterval);
        },
        function() {
            slideInterval = setInterval(nextSlide, 6000);
        }
    );

    // Keyboard navigation
    $(document).keydown(function(e) {
        if (e.keyCode === 37) { // Left arrow
            prevSlide();
            resetAutoSlide();
        } else if (e.keyCode === 39) { // Right arrow
            nextSlide();
            resetAutoSlide();
        }
    });



    // Menu Page Functionality
    if ($('.menu-tabs').length) {
        // Tab switching
        $('.tab-btn').click(function() {
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');
            
            const category = $(this).data('category');
            $('.menu-category').removeClass('active');
            $(`#${category}`).addClass('active');
        });



        // Menu item hover effects (enhanced interactivity)
        $('.menu-item').hover(
            function() {
                $(this).find('.item-image img').css('transform', 'scale(1.1)');
            },
            function() {
                $(this).find('.item-image img').css('transform', 'scale(1)');
            }
        );
    }

    // Input Validation Functions
    function validateName(name) {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name.trim());
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email.trim());
    }

    function validatePhone(phone) {
        // Updated regex to allow phone numbers starting with 0 (like UK numbers: 07123456789)
        const phoneRegex = /^[\+]?[0-9][\d]{0,3}[\s\-]?[\(]?[\d]{1,3}[\)]?[\s\-]?[\d]{1,4}[\s\-]?[\d]{1,4}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 15 && phoneRegex.test(phone);
    }

    function validateMessage(message) {
        return message.trim().length >= 10 && message.trim().length <= 1000;
    }

    function showError(field, message) {
        field.next('.error-message').text(message).show();
        field.addClass('error');
    }

    function hideError(field) {
        field.next('.error-message').hide();
        field.removeClass('error');
    }

    // Contact Form Validation
    if ($('#contactForm').length) {
        $('#contactForm').submit(function(e) {
            e.preventDefault();
            let isValid = true;

            // Validate name
            const nameField = $('#contact-name');
            const name = nameField.val().trim();
            if (name === '') {
                showError(nameField, 'Name is required');
                isValid = false;
            } else if (!validateName(name)) {
                showError(nameField, 'Please enter a valid name (2-50 characters, letters only)');
                isValid = false;
            } else {
                hideError(nameField);
            }

            // Validate email
            const emailField = $('#contact-email');
            const email = emailField.val().trim();
            if (email === '') {
                showError(emailField, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(emailField, 'Please enter a valid email address');
                isValid = false;
            } else {
                hideError(emailField);
            }

            // Validate message
            const messageField = $('#contact-message');
            const message = messageField.val().trim();
            if (message === '') {
                showError(messageField, 'Message is required');
                isValid = false;
            } else if (!validateMessage(message)) {
                showError(messageField, 'Message must be between 10-1000 characters');
                isValid = false;
            } else {
                hideError(messageField);
            }

            if (isValid) {
                // Store contact message in localStorage
                const contactData = {
                    name: name,
                    email: email,
                    subject: $('#contact-subject').val().trim(),
                    message: message,
                    timestamp: new Date().toISOString()
                };

                localStorage.setItem('desispiceContact', JSON.stringify(contactData));

                // Show success modal
                $('#contact-modal').fadeIn();
                $('#contactForm')[0].reset();
            }
        });

        // Real-time validation for contact form
        $('#contact-name').on('blur', function() {
            const name = $(this).val().trim();
            if (name !== '' && !validateName(name)) {
                showError($(this), 'Please enter a valid name (2-50 characters, letters only)');
            } else if (name !== '') {
                hideError($(this));
            }
        });

        $('#contact-email').on('blur', function() {
            const email = $(this).val().trim();
            if (email !== '' && !validateEmail(email)) {
                showError($(this), 'Please enter a valid email address');
            } else if (email !== '') {
                hideError($(this));
            }
        });

        $('#contact-message').on('input', function() {
            const message = $(this).val().trim();
            const charCount = message.length;
            if (charCount > 0 && charCount < 10) {
                showError($(this), `Message too short (${charCount}/10 minimum)`);
            } else if (charCount > 1000) {
                showError($(this), `Message too long (${charCount}/1000 maximum)`);
            } else if (charCount >= 10) {
                hideError($(this));
            }
        });
    }

    // Reservation Form Validation
    if ($('#reservation-form').length) {
        // Initialize datepicker
        $('#date').datepicker({
            minDate: 0,
            dateFormat: 'dd/mm/yy'
        });

        // Form validation
        $('#reservation-form').submit(function(e) {
            e.preventDefault();
            let isValid = true;

            // Validate name
            const nameField = $('#name');
            const name = nameField.val().trim();
            if (name === '') {
                showError(nameField, 'Name is required');
                isValid = false;
            } else if (!validateName(name)) {
                showError(nameField, 'Please enter a valid name (2-50 characters, letters only)');
                isValid = false;
            } else {
                hideError(nameField);
            }

            // Validate email
            const emailField = $('#email');
            const email = emailField.val().trim();
            if (email === '') {
                showError(emailField, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(emailField, 'Please enter a valid email address');
                isValid = false;
            } else {
                hideError(emailField);
            }

            // Validate phone
            const phoneField = $('#phone');
            const phone = phoneField.val().trim();
            if (phone === '') {
                showError(phoneField, 'Phone number is required');
                isValid = false;
            } else if (!validatePhone(phone)) {
                showError(phoneField, 'Please enter a valid phone number (10-15 digits)');
                isValid = false;
            } else {
                hideError(phoneField);
            }

            // Validate date
            const dateField = $('#date');
            if (dateField.val().trim() === '') {
                showError(dateField, 'Please select a date');
                isValid = false;
            } else {
                hideError(dateField);
            }

            // Validate time
            const timeField = $('#time');
            if (timeField.val() === '') {
                showError(timeField, 'Please select a time');
                isValid = false;
            } else {
                hideError(timeField);
            }

            // Validate guests
            const guestsField = $('#guests');
            if (guestsField.val() === '') {
                showError(guestsField, 'Please select number of guests');
                isValid = false;
            } else {
                hideError(guestsField);
            }

            if (isValid) {
                // Store reservation in localStorage
                const reservation = {
                    name: name,
                    email: email,
                    phone: phone,
                    date: $('#date').val(),
                    time: $('#time').val(),
                    guests: $('#guests').val(),
                    occasion: $('#occasion').val(),
                    requests: $('#special-requests').val()
                };

                localStorage.setItem('desispiceReservation', JSON.stringify(reservation));

                // Show confirmation modal
                $('#confirm-name').text(reservation.name);
                $('#confirm-date').text(reservation.date);
                $('#confirm-time').text(reservation.time);
                $('#confirm-guests').text(reservation.guests + (reservation.guests === '1' ? ' person' : ' people'));
                
                $('#confirmation-modal').fadeIn();
                $('#reservation-form')[0].reset();
            }
        });

        // Guest Counter Functionality
        $('#plus-guests').click(function() {
            const guestInput = $('#guests');
            let currentValue = parseInt(guestInput.val()) || 1;
            const maxValue = parseInt(guestInput.attr('max')) || 20;
            
            if (currentValue < maxValue) {
                guestInput.val(currentValue + 1);
                hideError(guestInput);
            }
        });

        $('#minus-guests').click(function() {
            const guestInput = $('#guests');
            let currentValue = parseInt(guestInput.val()) || 1;
            const minValue = parseInt(guestInput.attr('min')) || 1;
            
            if (currentValue > minValue) {
                guestInput.val(currentValue - 1);
                hideError(guestInput);
            }
        });
    }

    // Contact Form Validation
    if ($('#contactForm').length) {
        $('#contactForm').submit(function(e) {
            e.preventDefault();
            let isValid = true;

            // Validate name
            const nameField = $('#contact-name');
            const name = nameField.val().trim();
            if (name === '') {
                showError(nameField, 'Name is required');
                isValid = false;
            } else if (!validateName(name)) {
                showError(nameField, 'Please enter a valid name (minimum 2 characters, letters only)');
                isValid = false;
            } else {
                hideError(nameField);
            }

            // Validate email with comprehensive validation
            const emailField = $('#contact-email');
            const email = emailField.val().trim();
            if (email === '') {
                showError(emailField, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError(emailField, 'Please enter a valid email address (e.g., user@example.com)');
                isValid = false;
            } else {
                hideError(emailField);
            }

            // Validate message
            const messageField = $('#contact-message');
            const message = messageField.val().trim();
            if (message === '') {
                showError(messageField, 'Message is required');
                isValid = false;
            } else if (!validateMessage(message)) {
                showError(messageField, 'Message must be at least 10 characters long');
                isValid = false;
            } else {
                hideError(messageField);
            }

            if (isValid) {
                // Show success modal
                $('#contact-modal').fadeIn();
                $('#contactForm')[0].reset();
                // Clear any error states
                $('.form-group input, .form-group textarea').removeClass('error');
                $('.error-message').hide();
            }
        });

        // Contact modal close functionality
        $('#close-contact-modal, .close-modal').click(function() {
            $('#contact-modal').fadeOut();
        });
    }

    // Modal close functionality
    $('.close-modal, #close-confirmation').click(function() {
        $(this).closest('.modal').fadeOut();
    });

    // Close modal when clicking outside
    $(window).click(function(e) {
        if ($(e.target).hasClass('modal')) {
            $('.modal').fadeOut();
        }
    });

    // Smooth scrolling for anchor links
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        
        $('html, body').animate(
            {
                scrollTop: $($(this).attr('href')).offset().top - 80,
            },
            500,
            'linear'
        );
    });
});