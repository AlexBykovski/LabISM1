/*python -m SimpleHTTPServer 8000*/
var app4 = angular.module('app4', ['n3-line-chart']);

app4.controller('AppCtrl', ['$scope',
    function ($scope) {
        $scope.typeTask = 'norm';
        $scope.data = [
            /*{x: 0, y: 0},
             {x: 1, y: 0.993}*/
        ];

        $scope.dataFornormir = [];

        $scope.isNorm = true;
        $scope.isLaplas = false;
        $scope.isVeibul = false;
        $scope.isMoments = true;
        $scope.isProverka = false;
        $scope.isProverkaKolmog = true;
        $scope.limitNumber = 0;

        $scope.countNumber = 1000;
        $scope.lyambda = 5;
        $scope.cVeibul = 2;
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
            axes: {x: {type: "linear", key: "x"}, y: {type: "linear", min: 0, max: 400}},
            lineMode: "linear",
            tension: 0.7,
            tooltip: {mode: "scrubber"},
            drawLegend: true,
            drawDots: true,
            columnsHGap: 5
        };


        $scope.degree = 5;

        $scope.results = [];

        $scope.changeTask = function (type) {
            console.log($scope.typeTask);
            switch (type) {
                case 'norm':
                    $scope.isNorm = true;
                    $scope.isLaplas = false;
                    $scope.isVeibul = false;
                    break;
                case 'laplas':
                    $scope.isNorm = false;
                    $scope.isLaplas = true;
                    $scope.isVeibul = false;
                    break;
                case 'veibul':
                    $scope.isNorm = false;
                    $scope.isLaplas = false;
                    $scope.isVeibul = true;
                    break;
                default:
                    break;
            }
            $scope.typeTask = type;
        };


        var nachMoment = function (gener, degree) {
            var result = 0;
            for (var i = 0; i < $scope.countNumber; ++i) {
                result = result + Math.pow(gener[i], degree) / $scope.countNumber;
            }
            return result;
        };

        var centrMoment = function (gener, degree) {
            var nach = nachMoment(gener, 1);
            var result = 0;
            for (var i = 0; i < $scope.countNumber; ++i) {
                result = result + Math.pow(gener[i] - nach, degree) / $scope.countNumber;
            }
            return result;
        };

        var moments = function (gener, degree) {
            $scope.results.push("moments: ");
            $scope.results.push(nachMoment(gener, degree).toFixed(5));
            $scope.results.push(centrMoment(gener, degree).toFixed(5));
        };

        /*var normirovka = function (result) {
            $scope.dataFornormir = [];
            $scope.data = [];
            var N = result.length;
            for (var i = 0; i < N; i++) {
                var c = 0;
                var findItem = _.find($scope.dataFornormir, function (item) {
                    return item.number === result[i];
                });
                if (findItem) {
                    var findIndex = 0;
                    _.find($scope.dataFornormir, function (item, index) {
                        if (item.number === result[i]) {
                            findIndex = index
                        }
                        ;
                        return false;
                    });
                    $scope.dataFornormir[findIndex].count = $scope.dataFornormir[findIndex].count + 1;
                }
                else {
                    $scope.dataFornormir.push({
                        count: 1,
                        number: result[i]
                    });
                }
            }
            //console.log($scope.dataFornormir);
            for (var i = 0; i < $scope.dataFornormir.length; i++) {
                $scope.data.push({x: $scope.dataFornormir[i].number, y: $scope.dataFornormir[i].count / N});
            }
            //console.log($scope.data);
        };*/

        var getNormalArray = function (numbers) {
            var tempArray = [];
            var first = _.min($scope.results);
            var n = Math.floor($scope.results.length/100);
            var step = (Math.abs(_.min($scope.results)) + Math.abs(_.max($scope.results))) / n;
            var last = first + step;
            for (var i = 0; i < numbers.length; i++) {
                tempArray.push((integral(first, last))/Math.sqrt(2 * Math.PI));
                first += step;
                last += step;
            }
            return tempArray;
        };

        var getLaplasFuncRaspr = function (number, lyambda) {
            if(number < 0){
                return Math.exp(number * lyambda)/2;
            }
            return (1 - Math.exp(number * -lyambda)/2);
        };

        var getLaplasArray = function (numbers, lyambda) {
            var tempArray = [];
            var first = _.min($scope.results);
            var n = Math.floor($scope.results.length/100);
            var step = (Math.abs(_.min($scope.results)) + Math.abs(_.max($scope.results))) / n;
            var last = first + step;
            for (var i = 0; i < numbers.length; i++) {
                tempArray.push(getLaplasFuncRaspr(last, lyambda) - getLaplasFuncRaspr(first, lyambda));
                first += step;
                last += step;
            }
            return tempArray;
        };

        /*var getBinKoeff = function (k, n) {
            var c = factorial(n);
            c = c / (factorial(k) * factorial(n - k));
            return c;
        };*/

        var getVeibulArray = function (normArray, lyambda, c) {
            var tempArray = [];
            var first = _.min($scope.results);
            var n = Math.floor($scope.results.length/100);
            var step = (Math.abs(_.min($scope.results)) + Math.abs(_.max($scope.results))) / n;
            var last = first + step;
            for (var i = 0; i < normArray.length; i++) {
                tempArray.push((1-Math.exp(-lyambda * Math.pow(last, c))) - (1-Math.exp(-lyambda * Math.pow(first, c))));
                first += step;
                last += step;
            }
            return tempArray;
        };

        var getFuncDefArray = function (type, normArray) {
            var tempArr = [];
            switch (type) {
                case 'normal':
                    tempArr = getNormalArray(normArray);
                    break;
                case 'laplas':
                    tempArr = getLaplasArray(normArray, $scope.lyambda);
                    break;
                case 'veibul':
                    tempArr = getVeibulArray(normArray, $scope.lyambda, $scope.cVeibul);
                    break;
                default:
                    break;
            }
            return tempArr;
        };

        var proverka = function (normArray, N, type) {
            var clon = _.clone(normArray);
            var funcDefArray = getFuncDefArray(type, clon);
            var xi2 = 0;
            for (var i = 0; i < normArray.length; i++) {
                xi2 = xi2 + (((normArray[i].y - N * funcDefArray[i]) * (normArray[i].y/N - funcDefArray[i])) / funcDefArray[i]);
            }
            $scope.xi2El = xi2;
            console.log("count of free | " + normArray.length);
            console.log("xi2 | " + $scope.xi2El);
        };

        var getValueNormalFunc = function(number){
            return (integral(-20, number))/Math.sqrt(2 * Math.PI);
        };

        var getValueLaplasFunc = function(number, lyambda){
            if(number < 0){
                return Math.exp(number * lyambda)/2;
            }
            return (1 - Math.exp(number * -lyambda)/2);
        };

        var getValueVeibulFunc = function(number, lyambda, c){
            return (1-Math.exp(-lyambda * Math.pow(number, c)));
        };

        var getValueDistrFunc = function(number, type){
            switch (type) {
                case 'normal':
                    return getValueNormalFunc(number);
                case 'laplas':
                    return getValueLaplasFunc(number, $scope.lyambda);
                case 'veibul':
                    return getValueVeibulFunc(number, $scope.lyambda, $scope.cVeibul);
                default:
                    return 0;
            }
        };

        var proverkaKolmog = function(numbers, N, type){
            var k = new Kolmogorov();
            var d = 0;
            numbers = _.sortBy(numbers, function(num){ return num; });
            for (var i = 0; i < N; i++) {
                var fExpected = getValueDistrFunc(numbers[i], type);
                var fActual1 = i / N;
                var fActual2 = (i + 1) / N;
                var max = _.max([Math.abs(fExpected - fActual1), Math.abs(fActual2 - fExpected)]);
                if (max > d) {
                    d = max;
                }
            }
            console.log("kolmog sup | " + d);
            var ks = Math.sqrt(N) * d;
            //var ks = Math.sqrt(N) * d;
            console.log("kolmog p-value | " + (1 - k.distr(ks)));
        };

        var calculateGraf = function(){
            $scope.data = [];
            var min = _.min($scope.results);
            var max = _.max($scope.results);
            var n = Math.floor($scope.results.length/100);
            var step = (Math.abs(min) + Math.abs(max)) / n;
            //console.log("max " + max);
            var countMas = _.range(-1, -1 * (n+1), -1);
            //console.log(countMas);
            for(var i = 0; i < $scope.results.length; i++) {
                var numInterval = Math.floor(($scope.results[i] - min) / step);
                if (numInterval >= n) {
                    numInterval = n - 1;
            }
                if(countMas[numInterval] < 0){
                    countMas[numInterval] = 1;
                }
                else{
                    ++countMas[numInterval];
                }
            }
            for(var i = 0; i < n; i++){
                $scope.data.push({
                    x: (min + i * step + step/2),
                    y: countMas[i]
                });
            }
        };

        var normal = function (N) {
            $scope.results = [];
            var bsvArraySum = 0;
            for (var i = 0; i < N; i++) {
                bsvArraySum = 0;
                for (var j = 0; j < 12; j++) {
                    bsvArraySum += Math.random();
                }
                //console.log()
                $scope.results.push(bsvArraySum - 6);
            }
            calculateGraf();
            if($scope.isProverka){
                proverka($scope.data, $scope.countNumber, 'normal');
            }
            if($scope.isProverkaKolmog){
                proverkaKolmog($scope.results, $scope.countNumber, 'normal');
            }
            if($scope.isMoments){
             moments($scope.results, $scope.degree);
             }
        };

        var laplas = function (lyambda, N) {
            $scope.results = [];
            for (var i = 0; i < N; i++) {
                var numberRandom = Math.random();
                if (numberRandom < 0.5) {
                    $scope.results.push((1 / lyambda) * Math.log(2 * numberRandom));
                }
                else {
                    $scope.results.push((-1) * (1 / lyambda) * Math.log(2 * (1 - numberRandom)));
                }
            }
            calculateGraf();
             //normirovka($scope.results);
            if($scope.isProverka){
                proverka($scope.data, $scope.countNumber, 'laplas');
            }
            if($scope.isProverkaKolmog){
                proverkaKolmog($scope.results, $scope.countNumber, 'laplas');
            }
             if($scope.isMoments){
             moments($scope.results, $scope.degree);
             }
        };

        var veibul = function (lyambda, c, N) {
            $scope.results = [];
            for(var i = 0; i < N; i++){
                var number = Math.random();
                $scope.results.push(Math.pow(((-1) * (1 / lyambda) * Math.log(number)), 1/c));
            }
            calculateGraf();
            //console.log($scope.results);
           // normirovka($scope.results);
            if ($scope.isProverka) {
                proverka($scope.data, $scope.countNumber, 'veibul');
            }
            if($scope.isProverkaKolmog){
                proverkaKolmog($scope.results, $scope.countNumber, 'veibul');
            }
            if ($scope.isMoments) {
                moments($scope.results, $scope.degree);
            }
        };

        $scope.clickSubmit = function () {
            switch ($scope.typeTask) {
                case 'norm':
                    normal($scope.countNumber);
                    break;
                case 'laplas':
                    laplas($scope.lyambda, $scope.countNumber);
                    break;
                case 'veibul':
                    veibul($scope.lyambda, $scope.cVeibul, $scope.countNumber);
                    break;
                default:
                    break;
            }
        };

        //var k = new Kolmogorov();
        //console.log(k.distr(1));

    }]);