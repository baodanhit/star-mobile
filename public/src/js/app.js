var app = angular.module("app-main", ['ngSanitize', 'ngRoute', 'ngAnimate']);

app.controller("appCtrl", ($scope, $rootScope, $http, $window) => {
    $rootScope.appName = 'StarMobile';
    $http.get("/api/products-by-cate")
        .then((res) => {
            $rootScope.appData = res.data.data;
            $scope.menu = $rootScope.appData.menu;
            $scope.products = $rootScope.appData.products;
            setTimeout($scope.productSwiper, 1000)
        })
        .catch((error) => {
            console.log(error);
            return {}
        })
    $rootScope.cart = [];
    $scope.productSwiper = function () {
        var mySwiper = new Swiper('.product-swiper', {
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
            slidesPerView: 6,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
                stopOnLastSlide: false,
            },
            spaceBetween: 2,
            centeredSlides: true,
            // Responsive breakpoints
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 2,
                },
                // when window width is >= 576px
                576: {
                    slidesPerView: 2,
                },
                // when window width is >= 768px
                768: {
                    slidesPerView: 4,
                },
                // when window width is >= 992px
                992: {
                    slidesPerView: 6,
                },
                // when window width is >= 1440px
                1440: {
                    slidesPerView: 8,
                }
            },
            zoom: true,
        });
    }
    $rootScope.$on("$routeChangeSuccess", function ($event, $currentRoute, $previousRoute) {
        if ($currentRoute !== undefined) {
            if ($currentRoute.loadedTemplateUrl == '/views/home.html') {
                setTimeout($scope.productSwiper, 1000);
            }
            else if ($currentRoute.loadedTemplateUrl == '/views/cart.html') {
                $('#searchBar').addClass('hiden-mobile');
            }
            if ($previousRoute && $previousRoute.loadedTemplateUrl == '/views/cart.html') {
                $('#searchBar').removeClass('hiden-mobile');
            }
        }
        $("html, body").animate({ scrollTop: 0 }, 0);
    })
    $rootScope.toCurrency = (number) => convertToCurrencyString(number);
    $rootScope.toUrlString = (str) => convertViToUrl(str);
    $scope.searchText = '';
    $scope.searchResults = [];
    $scope.search = () => {
        $scope.searchResults = [];
        if (!$scope.searchText || $scope.searchText == undefined) return
        $http.get('/api/search?name=' + $scope.searchText).then(res => {
            $scope.searchResults = res.data.products
        }, err => {
            $scope.searchResults = [];
        })

    }
    $scope.searchResultClick = (id) => {
        $scope.searchText = '';
        $scope.searchResults = [];
        $window.location.href = '#!product/' + id
    }
    $rootScope.calcTotal = () => {
        $rootScope.totalProducts = 0;
        $rootScope.totalAmount = 0;
        $rootScope.cart.forEach(item => {
            $rootScope.totalProducts += item.quantity;
            $rootScope.totalAmount += item.amount;
        })
        return
    };
    $scope.customerName = '';
    $scope.customerPhone = '';
    $scope.customerAddress = '';
});

app.config(function ($routeProvider, $locationProvider) {
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
            controller: 'cartCtrl'
        })
        .when('/checkout', {
            templateUrl: "/views/checkout.html",
            controller: 'checkoutCtrl'
        })
        .when('/checkout-success', {
            templateUrl: "/views/checkout-success.html",
            controller: 'checkoutSuccessCtrl'
        })
        .when('/category/:category/:page', {
            templateUrl: "/views/products-by-category.html",
            controller: 'categoryCtrl'
        })
        .when('/category/:category', {
            templateUrl: "/views/products-by-category.html",
            controller: 'categoryCtrl'
        })
        .when('/product/:id', {
            templateUrl: "/views/product.html",
            controller: 'productCtrl'
        })
        .otherwise({
            templateUrl: "/views/home.html",
            controller: 'homeCtrl'
        });
});
app.controller('searchCtrl', function ($scope, $rootScope) {
    $('#searchBar input').focus();
});
app.controller('categoryCtrl', function ($scope, $rootScope, $window, $location, $routeParams, $http) {
    $scope.categoryStr = $routeParams.category;
    $scope.page = $routeParams.page || 1;
    $scope.translation = {
        'dien-thoai': 'Điện thoại di động',
        'laptop': 'Máy tính xách tay',
        'may-tinh-bang': 'Máy tính bảng',
        'phu-kien': 'Phụ kiện'
    };
    $scope.paginationFn = () => {
        $scope.begin = $scope.currentPage - 3;
        $scope.end = + $scope.currentPage + 2;
        if ($scope.begin < 2) {
            $scope.begin = 2;
            $scope.end = 7;
        }
        if ($scope.end >= $scope.totalPages) {
            $scope.end = $scope.totalPages - 1;
            $scope.begin = $scope.end - 5;
        }
    }
    $scope.getQueryUrl = () => {
        $scope.qr = $location.search();
        let res = ''
        for (const [key, value] of Object.entries($scope.qr)) {
            res += `${key}=${value}`
        }
        return res
    }

    $http.get(`/api/category/${$scope.categoryStr}/${$scope.page}?${$scope.getQueryUrl()}`).then(res => {
        $scope.count = res.data.count;
        $scope.categoryProducts = res.data.products;
        $scope.currentPage = + res.data.currentPage;
        $scope.totalPages = + res.data.totalPages;
        $scope.paginationFn();
    })
    $scope.newPage = (page) => {
        if (page > $scope.totalPages || page < 1) return;
        $window.location.href = `#!category/${$scope.categoryStr}/${page}`;
        $("html, body").animate({ scrollTop: 0 }, 0);
    }
});
app.controller('homeCtrl', function ($scope, $rootScope) {

});
app.controller('cartCtrl', function ($scope, $rootScope) {
    if (!$rootScope.cart || $rootScope.cart.length == 0) {
        $rootScope.cart = JSON.parse(sessionStorage.getItem('cart'));
    }
    $rootScope.totalProducts = 0;
    $rootScope.totalAmount = 0;
});

app.controller('cartItemCtrl', function ($scope, $rootScope) {
    $scope.index = '';
    $scope.min = 1;
    $scope.max = 20;
    $scope.quantity = 1;
    $scope.item.amount = $scope.item.price * $scope.quantity;
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
        $scope.item.amount = $scope.quantity * $scope.item.price;
        $scope.update();
        $rootScope.calcTotal();
    }
    $scope.delete = (id) => {
        $('#delete-modal')
            .modal('show')
            .on('click', '#modal-confirm', function (e) {
                function checkID(item) {
                    return item._id == id;
                }
                const index = $rootScope.cart.findIndex(checkID);
                if (index != -1) {
                    setTimeout(function () {
                        $scope.deleted = $rootScope.cart.splice(index, 1);
                        $('#delete-modal').modal('hide');
                        if (typeof (Storage) !== "undefined") {
                            // Store
                            sessionStorage.setItem("cart", JSON.stringify($rootScope.cart));
                        }
                        $scope.$apply();
                    }, 0)
                }
            });
    }
    $scope.update = () => {
        $rootScope.cart[$scope.index].quantity = $scope.quantity;
        $rootScope.cart[$scope.index].amount = $scope.item.amount;
    }
});
app.controller('checkoutCtrl', function ($scope, $rootScope, $window) {
    $rootScope.calcTotal();
    $scope.customerName = '';
    $scope.customerPhone = '';
    $scope.customerAddress = '';
    $scope.leave = () => {
        sessionStorage.setItem("customer", JSON.stringify({
            name: $scope.customerName,
            phone: $scope.customerPhone,
            address: $scope.customerAddress
        }));
        $window.location.href = '#!checkout-success'
    }

})
app.controller('checkoutSuccessCtrl', function ($scope, $rootScope, $http) {
    $rootScope.calcTotal();
    $scope.customerInfo = JSON.parse(sessionStorage.getItem("customer"));
    $scope.customerInfo.phone = $scope.customerInfo.phone.toString().padStart(10, '0');
    let data = {
        date: new Date(),
        total: $rootScope.totalProducts,
        amount: $rootScope.totalAmount,
        customer: {
            name: $scope.customerInfo.name,
            phone: $scope.customerInfo.phone,
            address: $scope.customerInfo.address,
        },
        products: $rootScope.cart,
        status: 'Chưa xử lý'
    }
    $http.post('/api/order', data).then(res => {
        if (res.data.id) {
            $scope.id = res.data.id;
        }
    });
    sessionStorage.clear();
})
app.controller('productCtrl', function ($scope, $rootScope, $routeParams, $route, $http) {
    $scope.id = $routeParams.id;
    $scope.activeColor = '';
    $http
        .get("/api/product/" + $scope.id)
        .then((res) => {
            // handle success
            $scope.product = res.data.product;
            $scope.activeColor = Object.keys($scope.product.colors)[0] || 'default';
            $scope.activePrice = $scope.product.colors[$scope.activeColor] || $scope.product.price['special'];
            $('#product-view').ready(initSwiper);
            $(document).ready(function () {
                $('.preview-content p').last().hide();
                $('.preview-content h2').last().hide();
                $('.preview-content a').attr('href', '#').addClass('text-black');
                if (!$scope.product.detailInfo || jQuery.isEmptyObject($scope.product.detailInfo)) {
                    $('#product-detail').hide();
                    $('#product-preview').removeClass('col-md-8').addClass('col-md-12');
                }

                if (!$scope.product.preview) {
                    $('#product-detail').removeClass('col-md-4').addClass('col-md-12');
                    $('#product-preview').hide();
                }
                else {
                    readMoreCtrl();
                }
                $('.product-option-color').first().addClass('selected');
                $('.product-option-color').click(function () {
                    $('.product-option-color').removeClass('selected');
                    $(this).addClass('selected');
                    $scope.activePrice = parseInt($(this).data('price'));
                    $scope.activeColor = $(this).data('color');
                    $('.price-special span').text($scope.toCurrency($scope.activePrice));
                })
            });
        })
        .catch((error) => {
            // handle error
            console.log(error);
            return {}
        });
    $scope.addToCart = (product = $scope.product) => {
        // kiểm tra sản phẩm đã có trong giỏ hàng ?
        let index = $rootScope.cart.findIndex(item => item._id == product._id);
        if ((index != -1) && ($scope.activeColor == $rootScope.cart[index].color)) {
            //số lượng +1
            $rootScope.cart[index].quantity += 1;
        }
        else {
            // tạo item mới
            let item = Object.assign({ quantity: 1 }, {
                _id: product._id,
                name: product.name,
                price: $scope.activePrice,
                color: $scope.activeColor,
                thumbImage: product.images[0] || ''
            });
            $rootScope.cart.push(item);
        }
        if (typeof (Storage) !== "undefined") {
            // Store
            sessionStorage.setItem("cart", JSON.stringify($rootScope.cart));
        }
        // hiển thị thông báo
        $('#liveToast').toast('show');
    }
    function initSwiper() {
        var galleryThumbs = new Swiper('#gallery-thumbs', {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            loop: true,
            loopedSlides: 5, //looped slides should be the same
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
        });
        var galleryTop = new Swiper('#gallery-top', {
            spaceBetween: 10,
            loop: true,
            loopedSlides: 5, //looped slides should be the same
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: {
                swiper: galleryThumbs,
            },
        });
    }
    let readMoreCtrl = () => {
        $('.btn-show-more').click(function () {
            $('.preview-content').toggleClass('show-more');
            if ($('.preview-content').hasClass('show-more')) {
                $(this).text('Xem thêm');
            }
            else {
                $(this).text('Ẩn bớt nội dung');
            }
        });
    };
});
app.filter('objLimitTo', [function () {
    return function (obj, limit) {
        var keys = Object.keys(obj);
        if (keys.length < 1) return [];

        var ret = new Object();
        var count = 0;
        angular.forEach(keys, function (key, arrayIndex) {
            if (count >= limit) return false;
            ret[key] = obj[key];
            count++;
        });
        return ret;
    };
}]);
app.filter('range', function () {
    return function (input, begin, end) {
        begin = parseInt(begin);
        end = parseInt(end);
        for (var i = begin; i <= end; i++) {
            input.push(i);
        }
        return input;
    };
});
app.filter('toCurrency', function () {
    return function (input) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(input);
    };
});

app.filter('srcProcess', function () {
    return function (input) {
        if (input.startsWith('http')) return input
        return '/src/images/products/' + input
    };
});

// methods

let convertToNumber = (str) => parseInt(str.replace(/(đ|\.)/g, ''));
let convertToCurrencyString = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
let convertViToUrl = (str) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    str = str.replace(/\s/g, '-');
    return str;
}
