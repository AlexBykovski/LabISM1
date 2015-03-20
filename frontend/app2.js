/*python -m SimpleHTTPServer 8000*/
var app2 = angular.module('app2', ['n3-line-chart']);

app2.controller('AppCtrl', ['$scope',
    function ($scope) {
        $scope.typeTask = 'bernulli';
        $scope.data = [
            /*{x: 0, y: 0},
             {x: 1, y: 0.993}*/
        ];

        $scope.dataFornormir = [];

        $scope.isBernulli = true;
        $scope.isPuasson = false;
        $scope.isHGeom = false;

        $scope.verPForBernulli = 0.7;
        $scope.countNumber = 50;
        $scope.lyambda = 5;
        $scope.MGeom = 20;
        $scope.DGeom = 15;
        $scope.nGeom = 10;
        $scope.degree = 0;

        $scope.options = {
            series: [
                {
                    y: "y",
                    label: "The best column series ever",
                    color: "#2ca02c",
                    type: "column",
                    axis: "y",
                    id: "series_0"
                }
            ],
            stacks: [],
            axes: {x: {type: "linear", key: "x"}, y: {type: "linear", min: 0, max:1}},
            lineMode: "linear",
            tension: 0.7,
            tooltip: {mode: "scrubber"},
            drawLegend: true,
            drawDots: true,
            columnsHGap: 5
        };


        $scope.degree = 5;

        $scope.results = [];

        $scope.changeTask = function(type){
            console.log($scope.typeTask);
            switch(type){
                case 'bernulli':
                    $scope.isBernulli = true;
                    $scope.isPuasson = false;
                    $scope.isHGeom = false;
                    break;
                case 'puasson':
                    $scope.isBernulli = false;
                    $scope.isPuasson = true;
                    $scope.isHGeom = false;
                    break;
                case 'hypergeom':
                    $scope.isBernulli = false;
                    $scope.isPuasson = false;
                    $scope.isHGeom = true;
                    break;
                default:
                    break;
            }
            $scope.typeTask = type;
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

        var normirovka = function(result){
            $scope.dataFornormir = [];
            $scope.data = [];
            var N = result.length;
            for(var i = 0; i < N; i++){
                var c = 0;
                var findItem = _.find($scope.dataFornormir, function(item){ return item.number === result[i]; });
                if(findItem){
                    var findIndex = 0;
                    _.find($scope.dataFornormir, function(item, index){ if(item.number === result[i]){findIndex = index}; return false; });
                    console.log(findIndex);
                    $scope.dataFornormir[findIndex].count = $scope.dataFornormir[findIndex].count + 1;
                }
                else{
                    $scope.dataFornormir.push({
                        count: 1,
                        number: result[i]
                    });
                }
            }
            for(var i = 0; i < $scope.dataFornormir.length; i++){
                $scope.data.push({x: $scope.dataFornormir[i].number, y: $scope.dataFornormir[i].count/N});
            }
        };

        var bernulli = function(p, N){
            $scope.results = [];
            for(var i = 0; i < N; i++){
                var number = Math.random();
                if(number > p){
                    $scope.results.push(0);
                }
                else{
                    $scope.results.push(1);
                }
            }
            normirovka($scope.results);
        };

        var puasson = function(lyambda, N){
            $scope.results = [];
            var epsPuasson = Math.exp(((-1)*lyambda));
            console.log(epsPuasson);
            for(var i = 0; i < N; i++){
                var temp = Math.random();
                var number = 1;
                while(temp > epsPuasson){
                    temp = temp * Math.random();
                    ++number;
                }
                $scope.results.push(number);
            }
            normirovka($scope.results);
        };

        var hyperGeom = function(M, D, n, N){
            console.log(N);
            $scope.results = [];
            var allArray = [];
            for(var i = 0; i < D; i++){
                allArray.push(1);
            }

            for(var i = D; i < M; i++){
                allArray.push(0);
            }

            for(var i = 0; i < N; i++){
                var shuffleArray = _.shuffle(allArray);
                var nArr = [];
                for(var j = 0; j < n; j++){
                    nArr.push(shuffleArray[j]);
                }

                var number = 0;
                for(var j = 0; j < n; j++){
                    if(nArr[j] === 1){
                        ++number;
                    }
                }
                $scope.results.push(number);
            }
            normirovka($scope.results);
        };

        $scope.clickSubmit = function(){
            switch($scope.typeTask){
                case 'bernulli':
                    bernulli($scope.verPForBernulli, $scope.countNumber);
                    break;
                case 'puasson':
                    puasson($scope.lyambda, $scope.countNumber);
                    break;
                case 'hypergeom':
                    hyperGeom($scope.MGeom, $scope.DGeom, $scope.nGeom, $scope.countNumber);
                    break;
                default:
                    break;
            }
        };

    }]);