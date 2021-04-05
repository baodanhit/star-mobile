window.onload = function () {
    var mySwiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,

        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
        slidesPerView: 4,
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
            stopOnLastSlide: false,
        },
        spaceBetween: 5,
        centeredSlides: true,
        // Responsive breakpoints
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
            },
            // when window width is >= 576px
            576: {
                slidesPerView: 2,
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 3,
            },
            // when window width is >= 992px
            992: {
                slidesPerView: 4,
            },
            // when window width is >= 1440px
            1440: {
                slidesPerView: 5,
            }
        },
        zoom: true,
        // Disable preloading of all images
        // preloadImages: false,
        // // Enable lazy loading
        // lazy: {
        //     loadPrevNext: true,
        //     loadPrevNextAmount: 3
        // }
    });
}