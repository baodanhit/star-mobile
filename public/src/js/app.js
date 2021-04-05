var app = angular.module("app-main", ['ngRoute']);

app.controller("appCtrl", ($scope, $rootScope, $http) => {
    $rootScope.appName = 'StarCom';
    // data ~ window.data: response from server
    $rootScope.appData = Object.assign({}, window.data);
    $scope.menu = $rootScope.appData.menu;
    $scope.products = $rootScope.appData.products;
    $rootScope.$on("$routeChangeSuccess", function ($event, $currentRoute, $previousRoute) {
        if ($currentRoute.loadedTemplateUrl == '/views/home.html') {
            setTimeout(function () {
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
                    // // Disable preloading of all images
                    // preloadImages: false,
                    // // Enable lazy loading
                    // lazy: {
                    //     loadPrevNext: true,
                    // }
                });
            }, 1000);
        }
        else if ($currentRoute.loadedTemplateUrl == '/views/cart.html') {
            $('#searchBar').addClass('hiden-mobile');
        }
        if ($previousRoute.loadedTemplateUrl == '/views/cart.html') {
            $('#searchBar').removeClass('hiden-mobile');
            return
        }
    })
    $rootScope.toCurrency = (number) => convertToCurrencyString(number);

});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/search', {
            templateUrl: "/views/search.html",
            controller: 'searchCtrl'
        })
        .when('/hot-sale', {
            templateUrl: "/views/hot-sale.html",
        })
        .when('/cart', {
            templateUrl: "/views/cart.html",
            controller: 'cartCrtl'
        })
        .otherwise({
            templateUrl: "/views/home.html",
            controller: 'homeCtrl'
        });
});
app.controller('searchCtrl', function ($scope, $rootScope) {
    $('#searchBar input').focus();
})
app.controller('cartCrtl', function ($scope, $rootScope) {
    $rootScope.cartProducts = [];
    $rootScope.cartProducts[0] = $scope.products[0]['Điện thoại'][0];
    $rootScope.cartProducts[1] = $scope.products[0]['Điện thoại'][1];
    $rootScope.cartItems = $rootScope.cartProducts.map(p => ({ name: p.name, sku: p.sku, price: p.price, images: p.images, quantity: 1, sumMoney: convertToNumber(p.price) }));
    $scope.totalProducts = $rootScope.cartItems.length;
    $scope.totalAmount = 0;
    $scope.calcTotal = () => {
        $scope.totalProducts = 0;
        $scope.totalAmount = 0;
        $rootScope.cartItems.forEach(item => {
            $scope.totalProducts += item.quantity;
            $scope.totalAmount += item.sumMoney;
        })
    };
    // $('#delete-modal').hide();
})
app.controller('homeCtrl', function ($scope, $rootScope) {

})
app.controller('cartItemCtrl', function ($scope, $rootScope) {
    $scope.index = '';
    $scope.min = 1;
    $scope.max = 20;
    $scope.quantity = 1;
    $scope.sumMoney = convertToNumber($scope.item.price);
    $scope.increase = () => {
        if ($scope.quantity >= $scope.max) return
        $scope.quantity += 1;
        $scope.calc();
    }
    $scope.decrease = () => {
        if ($scope.quantity <= $scope.min) return
        $scope.quantity -= 1;
        $scope.calc();
    }
    $scope.calc = () => {
        $scope.sumMoney = $scope.quantity * convertToNumber($scope.item.price);
        $scope.update();
        $scope.calcTotal();
    }
    $scope.delete = () => {
        // let $modal = $('#delete-modal');
        // $modal.modal('show');
        // $modal.find('#modal-confirm').click(() => {
        //     $rootScope.cartItems.splice($scope.index, 1);
        //     $scope.calcTotal();
        //     $modal.modal('hide');
        // })
        $rootScope.cartItems.splice($scope.index, 1);
        $scope.calcTotal();
    }
    $scope.update = () => {
        $rootScope.cartItems[$scope.index].quantity = $scope.quantity;
        $rootScope.cartItems[$scope.index].sumMoney = $scope.sumMoney;
    }
})

// methods

let convertToNumber = (str) => parseInt(str.replace(/(đ|\.)/g, ''));
let convertToCurrencyString = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
