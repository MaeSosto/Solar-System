function degToRad(d) {
   return d * Math.PI / 180;
}

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function emod(x, n) {
    return x >= 0 ? (x % n) : ((n - (-x % n)) % n);
}