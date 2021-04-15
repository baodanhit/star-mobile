$(window).on('load', function () {

    var $navOpenBtn = $('.nav-open-btn');
    var $navCloseBtn = $('.nav__close');
    var $nav = $('.side-nav');
    var $pageContent = $('.page__content');

    //open nav
    $navOpenBtn.click(function () {
        $navOpenBtn.addClass('js-hidden');

        $nav.addClass('js-opened');

        $pageContent.addClass('js-opened');
    });

    //close nav
    $navCloseBtn.click(function () {
        $navOpenBtn.removeClass('js-hidden');

        $nav.removeClass('js-opened');

        $pageContent.removeClass('js-opened');
    });
    $('.nav__toggler').click(function (e) {
        if ($(this).hasClass('toggled')) {
            $(this).removeClass('toggled')
            return
        }
        $(this).addClass('toggled')
        e.preventDefault();
    })

    //adding default classes
    $nav.addClass('nav--offcanvas-1');
    $pageContent.addClass('page__content--offcanvas-1');
})
