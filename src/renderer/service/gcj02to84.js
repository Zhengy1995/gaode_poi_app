const PI = 3.1415926535897932384626
const A = 6378245.0 // 长半轴
const EE = 0.00669342162296594323 // 椭球的偏心率

let x, y, xTemp, yTemp, ret, dLat, dLon, radLat, magic, sqrtMagic

class CoordinateTransform {
  static gcj02to84 (pointx, pointy) {
    xTemp = pointx * 1
    yTemp = pointy * 1
    x = xTemp - 105.0
    y = yTemp - 35.0
    ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret = ret + (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret = ret + (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
    ret = ret + (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
    dLat = ret
    ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret = ret + (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret = ret + (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
    ret = ret + (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
    dLon = ret
    radLat = yTemp / 180.0 * PI
    magic = Math.sin(radLat)
    magic = 1 - EE * magic * magic
    sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI)
    dLon = (dLon * 180.0) / (A / sqrtMagic * Math.cos(radLat) * PI)
    x = yTemp + dLat
    y = xTemp + dLon
    return `${(xTemp * 2 - y).toFixed(8)},${(yTemp * 2 - x).toFixed(8)}`
  }
}

export default CoordinateTransform
