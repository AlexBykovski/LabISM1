var f = function(a){
    return Math.exp(-a * a / 2);
    //return Math.exp(a);
};

var base_simpson_KF = function(a, b)
{
    return (b - a) * (f(a) + f(b) + 4*f((a+b)/2)) / 6;
};


// Составная КФ (строится по некоторой базовой)
var integral = function(a, b)
{
    var N = 1000;
    var h = (b - a)/N;
    var sum = 0;
    for(var i = 1; i <= N; i = i + 1) {
        sum = sum + base_simpson_KF(a + (i - 1) * h, a + i * h);
    }
    return sum;
};

//exact