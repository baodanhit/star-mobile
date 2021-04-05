myApp.filter('range', function () {

    return function (input, total) {

        total = parseInt(total);

        for (var i = 0; i < total; i++) {

            input.push(i);

        }

        return input;

    };

});
// usage 
{/* <div ng-repeat="n in [] | range:100"> 

do something 

</div> */}