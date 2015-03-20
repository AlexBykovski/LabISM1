/*python -m SimpleHTTPServer 8000*/
var agfunderApp = angular.module('agfunderApp', ['n3-line-chart']);

agfunderApp.controller('AppCtrl', ['$scope',
    function ($scope) {
        $scope.isFirst = true;
        $scope.typeTask = 'linkon';
        $scope.data = [
            /*{x: 0, y: 0},
            {x: 1, y: 0.993},
            {x: 2, y: 1.947},
            {x: 3, y: 2.823},
            {x: 4, y: 3.587},
            {x: 5, y: 4.207},
            {x: 6, y: 4.66},
            {x: 7, y: 4.927},
            {x: 8, y: 4.998},
            {x: 9, y: 4.869},
            {x: 10, y: 4.546},
            {x: 11, y: 4.042},
            {x: 12, y: 3.377},
            {x: 13, y: 2.578}*/
        ];


        $scope.options = {series: [
            {y: 'y', label: 'One', striped: true}
        ], lineMode: 'cardinal', tooltip: {mode: 'scrubber'}};

        $scope.linKonD = 22;
        $scope.linKonA = 12;
        $scope.linKonC = 25;
        $scope.linKonM = 121;
        $scope.linKonX0 = 1;
        $scope.countNumber = 10000;

        $scope.linKonD2 = 22;
        $scope.linKonA2 = 12;
        $scope.linKonC2 = 25;
        $scope.linKonX02 = 1;
        $scope.maclarenK = 1000;
        $scope.degree = 5;

        $scope.results = [];

        $scope.changeTask = function(type){
            console.log($scope.typeTask);
            $scope.typeTask = type;
        };

        var linKongrFirst = function(){
            var xi1 = $scope.linKonX0;
            $scope.results = [];
            $scope.data = [];
            for(var i = 0; i < $scope.countNumber; i++){
                $scope.results.push(xi1);
                $scope.data.push({x: xi1});
                xi1 = ($scope.linKonD * xi1 * xi1 + $scope.linKonA * xi1 + $scope.linKonC) % $scope.linKonM;
                $scope.data[i].y = xi1;
            }
            console.log("////////////////X////////////////");
            var resX = "";
            for(var i = 0; i < $scope.countNumber; i++){
                resX = resX + $scope.data[i].x + "\n";
            }
            console.log(resX);
            var resY = "";
            console.log("////////////////Y////////////////")
            for(var i = 0; i < $scope.countNumber; i++){
                resY = resY + $scope.data[i].y + "\n";
            }
            console.log(resY);
        };

        var linKongr = function(d, a, c, x0, m, count){
            var xi1 = x0;
            var results = [];
            for(var i = 0; i < count; i++){
                results.push(xi1);
                xi1 = (d * xi1 * xi1 + a * xi1 + c) % m;
            }
            return results;
        };

        var maclaren = function(){
            var rez1 = linKongr($scope.linKonD, $scope.linKonA, $scope.linKonC, $scope.linKonX0,$scope.linKonM,
                $scope.countNumber);
            var rez2 = linKongr($scope.linKonD2, $scope.linKonA2, $scope.linKonC2, $scope.linKonX02,$scope.linKonM,
                $scope.countNumber);
            var v = [];
            for (var i = 0; i < $scope.maclarenK; ++i) {
                v.push(rez1[i]);
            }

            $scope.results = [];
            $scope.data = [];
            for (var i = 0; i < $scope.countNumber; ++i) {
                var k = ( $scope.maclarenK * rez2[i] / $scope.linKonM);
                $scope.results.push(v[parseInt(k, 10)]);
                v[parseInt(k, 10)] = rez1[i];
            }
            for(var i = 0; i < $scope.results.length - 1;++i){
                $scope.data.push({x: $scope.results[i], y: $scope.results[i+1]});
            }

            console.log("////////////////X////////////////");
            var resX = "";
            for(var i = 0; i < $scope.data.length; i++){
                resX = resX + $scope.data[i].x + "\n";
            }
            console.log(resX);
            var resY = "";
            console.log("////////////////Y////////////////")
            for(var i = 0; i < $scope.data.length; i++){
                resY = resY + $scope.data[i].y + "\n";
            }
            console.log(resY);

        };

        var nachMoment = function(gener, degree) {
            var result = 0;
            for (var i = 0; i < $scope.countNumber; ++i) {
                result = result + Math.pow(gener[i], degree) / $scope.countNumber;
            }
            return result;
        };

        var centrMoment = function(gener, degree) {
            var nach = nachMoment(gener, 1);
            var result = 0;
            for (var i = 0; i < $scope.countNumber; ++i) {
                result = result + Math.pow(gener[i] - nach, degree) / $scope.countNumber;
            }
            return result;
        };

        var moments = function(gener, degree){
            $scope.results = [];
            $scope.results.push(nachMoment(gener, degree).toFixed(5));
            $scope.results.push(centrMoment(gener, degree).toFixed(5));
        };

        $scope.clickSubmit = function(){
            switch($scope.typeTask){
                case 'linkon':
                    linKongrFirst();
                    break;
                case 'maclaren':
                    maclaren();
                    break;
                case 'momenty':
                    var res = linKongr($scope.linKonD, $scope.linKonA, $scope.linKonC, $scope.linKonX0,$scope.linKonM,
                        $scope.countNumber);
                    moments(res, $scope.degree);
                    break;
                case 'scatter':
                   // maclaren();
                    break;
                default:
                    break;
            }
        };

    }]);