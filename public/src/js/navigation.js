$(function () {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        var mobileNav = document.querySelectorAll('.mobile');
        mobileNav.forEach(e => {
            e.classList.add('d-block');
        })
    } else {
        // false for not mobile device

    }
    //hide nav open btn when the nav is open, adding/removing open classes to nav and content
    var navOpenBtn = document.querySelector('.nav-open-btn');
    var navCloseBtn = document.querySelector('.nav__close');
    var nav = document.querySelector('.side-nav');
    var pageContent = document.querySelector('.page__content');
    var navList = document.querySelector('.nav__list');
    var menuTogglers = document.querySelectorAll('.nav__toggler');
    var app = document.querySelector('#app');

    //open nav
    navOpenBtn.addEventListener('click', function () {
        navOpenBtn.classList.add('js-hidden');

        nav.classList.add('js-opened');

        pageContent.classList.add('js-opened');
    });

    //close nav
    navCloseBtn.addEventListener('click', function () {
        navOpenBtn.classList.remove('js-hidden');

        nav.classList.remove('js-opened');

        pageContent.classList.remove('js-opened');
    });

    //closing navigation if click outside it
    app.addEventListener('click', function (e) {

        var evTarget = e.target;

        var isClickOnToggler = Array.from(menuTogglers).includes(evTarget);
        if (isClickOnToggler) {
            if (evTarget.classList.contains('toggled')) {
                evTarget.classList.remove('toggled');
            }
            else {
                evTarget.classList.add('toggled');
            }
        }

        if ((evTarget !== nav) && (nav.classList.contains('js-opened')) && (evTarget !== navOpenBtn) && (evTarget.parentNode !== navOpenBtn) && (!isClickOnToggler)) {

            navOpenBtn.classList.remove('js-hidden');

            nav.classList.remove('js-opened');

            pageContent.classList.remove('js-opened');
        }
        return
    });

    //adding default classes
    nav.classList.add('nav--offcanvas-1');
    pageContent.classList.add('page__content--offcanvas-1');
})
