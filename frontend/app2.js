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
        $scope.isMoments = true;
        $scope.isProverka = false;
        $scope.limitNumber = 0;

        $scope.verPForBernulli = 0.7;
        $scope.countNumber = 50;
        $scope.lyambda = 5;
        $scope.MGeom = 20;
        $scope.DGeom = 15;
        $scope.nGeom = 10;
        $scope.degree = 0;
        $scope.xi2El = 0;
        $scope.xi2Array = [];
        $scope.lengthLimit = [];

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
            $scope.results.push("moments: ");
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
                    $scope.dataFornormir[findIndex].count = $scope.dataFornormir[findIndex].count + 1;
                }
                else{
                    $scope.dataFornormir.push({
                        count: 1,
                        number: result[i]
                    });
                }
            }
            console.log($scope.dataFornormir);
            for(var i = 0; i < $scope.dataFornormir.length; i++){
                $scope.data.push({x: $scope.dataFornormir[i].number, y: $scope.dataFornormir[i].count/N});
            }
            console.log($scope.data);
        };

        var getBernulliArray = function(numbers, q, p){
            var tempArray = [];
            for(var i = 0; i < numbers.length; i++){
                if(numbers[i].x === 0){
                    tempArray.push(q);
                }
                else{
                    tempArray.push(p);
                }
            }
            return tempArray;
        };

        var factorial = function(number){
            var temp = 1;
            for(var i = 2; i <= number; i++){
                temp = temp * i;
            }
            return temp;
        };

        var getPuassonArray = function(numbers, lyambda){
            var tempArray = [];
            for(var i = 0; i < numbers.length; i++){
                var fact = factorial(numbers[i].x);
                tempArray.push(((Math.pow(lyambda, numbers[i].x) * Math.exp(((-1)*lyambda)))/fact));
            }
            return tempArray;
        };

        var getBinKoeff = function(k, n){
            var c = factorial(n);
            c = c / (factorial(k) * factorial(n-k));
            return c;
        };

        var getHGeomArray = function(numbers, D, M, n, N){
            var tempArray = [];
            for(var i = 0; i < numbers.length; i++){
                var number = (getBinKoeff(numbers[i].x, D) * getBinKoeff(n - numbers[i].x, M - D));
                number = number / getBinKoeff(n, M);
                tempArray.push(number);
            }
            return tempArray;
        };

        var getFuncDefArray = function(type, normArray){
            var tempArr = [];
            switch(type){
                case 'bernulli':
                    tempArr = getBernulliArray(normArray, 1 - $scope.verPForBernulli, $scope.verPForBernulli);
                    break;
                case 'puasson':
                    tempArr = getPuassonArray(normArray, $scope.lyambda);
                    break;
                case 'hyperGeom':
                    tempArr = getHGeomArray(normArray, $scope.DGeom, $scope.MGeom, $scope.nGeom, $scope.countNumber);
                    break;
                default:
                    break;
            }
            return tempArr;
        };

        var proverka = function(normArray, N, type){
            var clon = _.clone(normArray);
            var funcDefArray = getFuncDefArray(type, clon);
            var xi2 = 0;
            for(var i = 0; i < normArray.length; i++){
                xi2 = xi2 + (((normArray[i].y*N - N*funcDefArray[i]) * (normArray[i].y*N - N*funcDefArray[i])) / N*funcDefArray[i]);
            }
            $scope.xi2El = xi2;
        };

        var proverka1 = function(normArray, N, limit, type){
            var clon = [];
            for(var i = 0; i < limit; i++){
                clon.push(normArray[i]);
            }
            var funcDefArray = getFuncDefArray(type, clon);
            var xi2 = 0;
            for(var i = 0; i < normArray.length; i++){
                xi2 = xi2 + (((normArray[i].y*N - N*funcDefArray[i]) * (normArray[i].y*N - N*funcDefArray[i])) / N*funcDefArray[i]);
            }
            $scope.xi2Array.push(xi2);
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
            if($scope.isMoments){
                moments($scope.results, $scope.degree);
            }
            if($scope.isProverka){
                proverka($scope.data, $scope.countNumber, 'bernulli');
            }
        };

        var puasson = function(lyambda, N){
            $scope.results = [];
            var epsPuasson = Math.exp(((-1)*lyambda));
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
            if($scope.isMoments){
                moments($scope.results, $scope.degree);
            }
            $scope.lengthLimit.push($scope.data.length);
        };

        var hyperGeom = function(M, D, n, N){
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
            if($scope.isMoments){
                moments($scope.results, $scope.degree);
            }
            if($scope.isProverka){
                proverka($scope.data, $scope.countNumber, 'hyperGeom');
            }
        };

        $scope.clickSubmit = function(){
            switch($scope.typeTask){
                case 'bernulli':
                    bernulli($scope.verPForBernulli, $scope.countNumber);
                    break;
                case 'puasson':
                    for(var i = 0; i < 100; i++){
                        puasson($scope.lyambda, $scope.countNumber);
                    }
                    var minEl = _.min($scope.lengthLimit);
                    for(var i = 0; i < 100; i++){
                        proverka1($scope.data, $scope.countNumber, minEl, 'puasson');
                    }
                    var sum=0;
                    console.log($scope.xi2Array);
                    for(var i = 0; i < 100; i++){
                        if($scope.xi2Array[i] < $scope.limitNumber){
                            sum = sum + 1;
                        }
                    }
                    console.log("HERE" + sum);
                    break;
                case 'hypergeom':
                    hyperGeom($scope.MGeom, $scope.DGeom, $scope.nGeom, $scope.countNumber);
                    break;
                default:
                    break;
            }
        };

    }]);