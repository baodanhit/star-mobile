var app = angular.module("myApp", ['ngSanitize', 'ngRoute', 'ngAnimate', 'ui.tinymce', 'thatisuday.dropzone']);
app.config(function ($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
        .when('/edit/:id', {
            templateUrl: "/views/admin/edit.html",
            controller: 'editCtrl'
        })
        .when('/new', {
            templateUrl: "/views/admin/new-product.html",
            controller: 'newCtrl'
        })
        .when('/product/:id', {
            templateUrl: "/views/admin/product.html",
            controller: 'productCtrl'
        })
        .when('/products', {
            templateUrl: "/views/admin/products.html",
            controller: 'productsCtrl'
        })
        .when('/products/:page', {
            templateUrl: "/views/admin/products.html",
            controller: 'productsCtrl'
        })
        .when('/orders', {
            templateUrl: "/views/admin/orders.html",
            controller: 'ordersCtrl'
        })
        .when('/orders/:page', {
            templateUrl: "/views/admin/orders.html",
            controller: 'ordersCtrl'
        })
        .when('/order/:id', {
            templateUrl: "/views/admin/order.html",
            controller: 'orderCtrl'
        })
        .when('/edit-order/:id', {
            templateUrl: "/views/admin/edit-order.html",
            controller: 'editOrderCtrl'
        })
        .otherwise({
            templateUrl: "/views/admin/home.html",
            controller: 'homeCtrl'
        });
});
app.controller("appCtrl", function ($scope, $rootScope, $location, $http) {
    $http.get('/admin/products').then(res => {
        $rootScope.products = res.data.products;

    });
    $rootScope.activePage = 'Dashboard';
    Dropzone.autoDiscover = false;
    $scope.dzOptions = {
        url: '/admin/product-images',
        paramName: 'photo',
        maxFilesize: '20',
        acceptedFiles: 'image/jpeg, images/jpg, image/png',
        uploadMultiple: true
    };


    //Handle events for dropzone
    //Visit http://www.dropzonejs.com/#events for more events
    $scope.dzCallbacks = {
        'addedfile': function (file) {
            console.log(file);
            $scope.newFile = file;
        },
        'success': function (file, xhr) {
            console.log(file, xhr);
        },
    };


    //Apply methods for dropzone
    //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
    $scope.dzMethods = {};
    $scope.removeNewFile = function () {
        $scope.dzMethods.removeFile($scope.newFile); //We got $scope.newFile from 'addedfile' event callback
    }
});
app.controller("homeCtrl", function ($scope, $rootScope, $location, $http) {

    $rootScope.activePage = 'Home';
});
app.controller("productsCtrl", function ($scope, $rootScope, $window, $routeParams, $http) {
    $rootScope.activePage = 'Sản phẩm';
    $(function () {
        $("html, body").animate({ scrollTop: 0 }, 0);
    });
    $scope.currentPage = $routeParams.page || 1;
    $scope.paginationFn = () => {
        $scope.begin = $scope.currentPage - 3;
        $scope.end = + $scope.currentPage + 3;
        if ($scope.begin < 2) {
            $scope.begin = 2;
            $scope.end = 7;
        }
        if ($scope.end >= $scope.totalPages) {
            $scope.end = $scope.totalPages - 1;
            $scope.begin = $scope.end - 5;
        }
    }
    $http.get('/admin/products/' + $scope.currentPage).then(res => {
        $scope.count = res.data.count;
        $scope.products = res.data.products;
        $scope.currentPage = + res.data.currentPage;
        $scope.totalPages = + res.data.totalPages;
        $scope.paginationFn();
    })
    $scope.newPage = (page) => {
        if (page > $scope.totalPages || page < 1) return;
        $window.location.href = '#!products/' + page;
    }
    $scope.editable = () => {
        $('#dataTable').removeEditable();
        $('#dataTable').setEditable({
            $addButton: $('button[name="btnAdd"]'),
            $doneButton: $('button[name="btnDone"]'),
            newPageEdit: true,
            editNewPage: function (id = -1) {
                window.location = "#!/edit/" + id;
            },
            addNewPage: function () {
                window.location = "#!/new"
            },
            onDelete: function (id) {
                $http.delete('/admin/product/' + id).then(res => {
                    $scope.count -= 1;
                })
            }
        });
        $('#btnEditable').hide();
        $('#btnDoneEdit').show();
    }
    $scope.done = () => {
        $('#dataTable').removeEditable();
        $('#btnEditable').show();
        $('#btnDoneEdit').hide();
    }

})
app.controller("ordersCtrl", function ($scope, $rootScope, $window, $routeParams, $http) {
    $rootScope.activePage = 'Đơn hàng';
    $(function () {
        $("html, body").animate({ scrollTop: 0 }, 0);
    });
    $scope.currentPage = $routeParams.page || 1;
    $scope.paginationFn = () => {
        $scope.begin = $scope.currentPage - 3;
        $scope.end = + $scope.currentPage + 3;
        if ($scope.begin < 2) {
            $scope.begin = 2;
            $scope.end = 7;
        }
        if ($scope.end >= $scope.totalPages) {
            $scope.end = $scope.totalPages - 1;
            $scope.begin = $scope.end - 5;
        }
    }
    $http.get('/admin/orders/' + $scope.currentPage).then(res => {
        $scope.count = res.data.count;
        $scope.orders = res.data.orders;
        $scope.currentPage = + res.data.currentPage;
        $scope.totalPages = + res.data.totalPages;
        $scope.paginationFn();
    })
    $scope.newPage = (page) => {
        if (page > $scope.totalPages || page < 1) return;
        $window.location.href = '#!orders/' + page;
    }
    $scope.editable = () => {
        $('#dataTable').removeEditable();
        $('#dataTable').setEditable({
            $doneButton: $('button[name="btnDone"]'),
            newPageEdit: true,
            editNewPage: function (id = -1) {
                window.location = "#!/edit-order/" + id;
            },
            onDelete: function (id) {
                $http.delete('/admin/order/' + id).then(res => {
                    $scope.count -= 1;
                })
            }
        });
        $('#btnEditable').hide();
        $('#btnDoneEdit').show();
    }
    $scope.done = () => {
        $('#dataTable').removeEditable();
        $('#btnEditable').show();
        $('#btnDoneEdit').hide();
    }

})
app.controller("editCtrl", function ($scope, $rootScope, $window, $route, $routeParams, $http) {
    $rootScope.activePage = 'Sửa sản phẩm';
    Dropzone.autoDiscover = false;
    $scope.product = {};
    $scope.id = $routeParams.id;
    $http.get('/admin/product/' + $scope.id).then(res => {
        $scope.product = res.data.product;
        $scope.name = $scope.product.name;
        $scope.category = $scope.product.category;
        $scope.type = $scope.product.type;
        $scope.oldPrice = $scope.product.price.old;
        $scope.specialPrice = $scope.product.price.special;
        $scope.preview = $scope.product.preview;
        $scope.images = $scope.product.images;
    }, err => {
        return $window.location.href = '#!products'
    })

    $scope.addRow = (type) => {
        let placeholders = ['', ''];
        if (type == 'color') {
            placeholders[0] = 'Màu sắc';
            placeholders[1] = 'Giá';
        }
        else if (type == 'detail') {
            placeholders[0] = 'Cấu hình';
            placeholders[1] = 'Mô tả';
        }
        let rowInput = `<div class="row mb-1 px-4 ${type}-input-group">
                            <input type="text" class="form-control ${type}-input-key col mr-2" placeholder="${placeholders[0]}" required>
                            <input type="number" class="form-control ${type}-input-value col" placeholder="${placeholders[1]}" required>
                            <button type="button" class="btn btn-light" onclick="removeRow(this)" tabindex="-1">
                                <i class="fas fa-window-close"></i>
                            </button>
                        </div>`;
        $('#' + type).append(rowInput);

    }
    $scope.save = () => {
        let colors = {};
        let detailInfo = {};
        let $colors = $('.color-input-group');
        let $detail = $('.detail-input-group');
        $colors.each((index, element) => {
            let key = $(element).find('.color-input-key').val().trim();
            let value = $(element).find('.color-input-value').val().trim();
            colors[key] = value;
        })
        $detail.each((index, element) => {
            let key = $(element).find('.detail-input-key').val().trim();
            let value = $(element).find('.detail-input-value').val().trim();
            detailInfo[key] = value;
        })
        let data = {
            name: $scope.name.trim(),
            category: $scope.category,
            type: $scope.type,
            price: { old: $scope.oldPrice, special: $scope.specialPrice },
            colors,
            detailInfo,
            preview: $scope.preview,
            images: $scope.images
        }
        $http.put('/admin/product/' + $scope.id, JSON.stringify(data)).then(function (res) {
            $scope.status = res.status;
            if ($scope.status == 200) {
                $scope.message = 'Đã sửa thành công';
            }
            else {
                $scope.message = 'Đã xảy ra lỗi';
            }
            $('#liveToast').toast('show');
        })
    }
    $scope.removeImg = (index = -1) => {
        if (index == -1) return
        $scope.images.splice(index, 1);
    }
    $scope.reset = () => {
        $route.reload();
    }
    $scope.tinymceOptions = {
        height: $(window).height(),
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media paste imagetools wordcount'
        ],
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-size:14px }'
    };

});
app.controller("editOrderCtrl", function ($scope, $rootScope, $window, $route, $routeParams, $http) {
    $rootScope.activePage = 'Sửa đơn hàng';
    $scope.id = $routeParams.id;
    $http.get('/admin/order/' + $scope.id).then(res => {
        $scope.order = res.data.order;
        $scope.name = '';
        $scope.phone = '';
        $scope.address = '';
        $scope.status = '';

    }, err => {
        return $window.location.href = '#!orders'
    })

    $scope.save = () => {
        let data = {
            customer: {
                name: $scope.name || $scope.order.customer.name,
                phone: $scope.phone.toString().padStart(10, '0') || $scope.order.customer.phone,
                address: $scope.address || $scope.order.customer.address,
            },
            // status: $scope.status
        }
        $http.put('/admin/order/' + $scope.id, JSON.stringify(data)).then(function (res) {
            $scope.status = res.status;
            if ($scope.status == 200) {
                $scope.message = 'Đã sửa thành công';
            }
            else {
                $scope.message = 'Đã xảy ra lỗi';
            }
            $('#liveToast').toast('show');
        })
    }
    $scope.reset = () => {
        $route.reload();
    }
});
app.controller("newCtrl", function ($scope, $rootScope, $route, $http) {
    $rootScope.activePage = 'New Product';
    $scope.product = {};
    $scope.name = '';
    $scope.category = '';
    $scope.type = '';
    $scope.oldPrice = '';
    $scope.specialPrice = '';
    $scope.preview = '';
    $scope.addRow = (type) => {
        let placeholders = ['', ''];
        if (type == 'color') {
            placeholders[0] = 'Màu sắc';
            placeholders[1] = 'Giá';
        }
        else if (type == 'detail') {
            placeholders[0] = 'Cấu hình';
            placeholders[1] = 'Mô tả';
        }
        let rowInput = `<div class="row mb-1 px-4 ${type}-input-group">
                            <input type="text" class="form-control ${type}-input-key col mr-2" placeholder="${placeholders[0]}" required>
                            <input type="number" class="form-control ${type}-input-value col" placeholder="${placeholders[1]}" required>
                            <button type="button" class="btn btn-light" onclick="removeRow(this)">
                                <i class="fas fa-window-close"></i>
                            </button>
                        </div>`
        $('#' + type).append(rowInput);
    }

    $scope.save = () => {
        let colors = {};
        let detailInfo = {};
        let $colors = $('.color-input-group');
        let $detail = $('.detail-input-group');
        $colors.each((index, element) => {
            let key = $(element).find('.color-input-key').val().trim();
            let value = $(element).find('.color-input-value').val().trim();
            colors[key] = value;
        })
        $detail.each((index, element) => {
            let key = $(element).find('.detail-input-key').val().trim();
            let value = $(element).find('.detail-input-value').val().trim();
            detailInfo[key] = value;
        })
        let data = {
            name: $scope.name.trim(),
            category: $scope.category,
            type: $scope.type,
            price: { old: $scope.oldPrice, special: $scope.specialPrice },
            colors,
            detailInfo,
            preview: $scope.preview
        }
        $http.post('/admin/product/', JSON.stringify(data)).then(function (res) {
            $scope.status = res.status;
            if ($scope.status == 200) {
                $scope.message = 'Đã thêm thành công';
                $scope.productId = res.data.id;
            }
            else {
                $scope.message = 'Đã xảy ra lỗi';
            }
            $('#createForm')[0].reset();
            $('#liveToast').toast('show');
        })
    }
    $scope.reset = () => {
        $route.reload();
    }
    $scope.tinymceOptions = {
        height: $(window).height(),
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media paste imagetools wordcount'
        ],
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-size:14px }'
    };

});
app.controller("productCtrl", function ($scope, $rootScope, $routeParams, $window, $http) {
    $rootScope.activePage = 'Product';
    $scope.product = {};
    $scope.id = $routeParams.id;
    $http.get('/admin/product/' + $scope.id).then(res => {
        $scope.product = res.data.product;
        $scope.name = $scope.product.name;
        $scope.category = $scope.product.category;
        $scope.type = $scope.product.type;
        $scope.price = $scope.product.price;
        $scope.colors = $scope.product.colors;
        $scope.detailInfo = $scope.product.detailInfo;
        $scope.preview = $scope.product.preview;
        $scope.images = $scope.product.images;
    })
    $scope.delete = () => {
        $http.delete('/admin/product/' + $scope.id).then(res => {
            $scope.status = res.status;
            if ($scope.status == 200) {
                $scope.message = 'Đã xóa thành công';
                $window.location.href = '#!products'
            }
            else {
                $scope.message = 'Đã xảy ra lỗi';
            }
            $('#liveToast').toast('show');
        })
    }
});
app.controller("orderCtrl", function ($scope, $rootScope, $routeParams, $window, $http) {
    $rootScope.activePage = 'Đơn hàng';
    $scope.id = $routeParams.id;
    $http.get('/admin/order/' + $scope.id).then(res => {
        $scope.order = res.data.order;
    })
    $scope.delete = () => {
        $http.delete('/admin/order/' + $scope.id).then(res => {
            $scope.status = res.status;
            if ($scope.status == 200) {
                $scope.message = 'Đã xóa thành công';
                $window.location.href = '#!orders';
            }
            else {
                $scope.message = 'Đã xảy ra lỗi';
            }
            $('#liveToast').toast('show');
        })
    }
});
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
let removeRow = (element) => {
    var $row = $(element).parents('div.row');
    $row.remove();
}