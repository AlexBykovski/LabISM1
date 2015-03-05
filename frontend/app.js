/*python -m SimpleHTTPServer 8000*/
var agfunderApp = angular.module('agfunderApp', ['n3-line-chart']);

agfunderApp.controller('AppCtrl', ['$scope',
    function ($scope) {
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

        $scope.linKonD = 3;
        $scope.linKonA = 3;
        $scope.linKonC = 3;
        $scope.linKonM = 3;
        $scope.linKonX0 = 3;
        $scope.countNumber = 5;
        $scope.results = [];

        var linKongr = function(){
            var xi1 = $scope.linKonX0;
            $scope.results = [];
            $scope.data = [];
            for(var i = 0; i < $scope.countNumber; i++){
                $scope.results.push(xi1);
                $scope.data.push({x: xi1});
                xi1 = ($scope.linKonD * xi1 * xi1 + $scope.linKonA * xi1 + $scope.linKonC) % $scope.linKonM;
                $scope.data[i].y = xi1;
            }
        };

        $scope.clickSubmit = function(){
            linKongr();
        };

    }]);