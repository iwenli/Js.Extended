//网页获取用户经纬度
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (p) {
        sessionStorage['tx-coordinate'] = p.coords.latitude + ',' + p.coords.longitude;
        alert('获取到的经纬度：' + sessionStorage['tx-coordinate']);
    }, function (error) {//错误信息
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("用户拒绝对获取地理位置的请求。")
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("位置信息是不可用的。")
                break;
            case console.log.TIMEOUT:
                alert("请求用户地理位置超时。")
                break;
            case error.UNKNOWN_ERROR:
                console.log("未知错误。")
                break;
        }
    }, {
            enableHighAccuracy: true,  //高经度获取
            maximumAge: 30000,
            timeout: 20000
        });
}

//计算经纬度
//计算两个经纬度的距离
//调用北京-南京：Distance.getFlatternDistance(39.92,116.46,32.04,118.78)
var Distance = Distance || {};
Distance = (function () {
    var EARTH_RADIUS = 6378137.0;    //单位M
    var PI = Math.PI;

    var getRad = function (d) {
        return d * PI / 180.0;
    }

    /**
     * 计算大圆距离，近似距离
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */
    Distance.getGreatCircleDistance = function (lat1, lng1, lat2, lng2) {
        var radLat1 = getRad(lat1 * 1);
        var radLat2 = getRad(lat2 * 1);

        var a = radLat1 - radLat2;
        var b = getRad(lng1 * 1) - getRad(lng2 * 1);

        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000.0;

        return s;
    }

    /**
     * 近似椭球上两点之间的距离(类地球) 更精确
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */
    Distance.getFlatternDistance = function (lat1, lng1, lat2, lng2) {
        var f = getRad((lat1 * 1 + lat2 * 1) / 2);
        var g = getRad((lat1 * 1 - lat2 * 1) / 2);
        var l = getRad((lng1 * 1 - lng2 * 1) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;

        return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    }
    //将其定义方法以接口方式返回给外界引用
    return {
        getGreatCircleDistance: Distance.getGreatCircleDistance,
        getFlatternDistance: Distance.getFlatternDistance
    }

})();