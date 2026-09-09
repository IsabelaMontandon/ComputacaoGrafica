var m3 = {

    identity: function() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    },

    multiply: function(a, b) {

        var a00 = a[0];
        var a01 = a[3];
        var a02 = a[6];

        var a10 = a[1];
        var a11 = a[4];
        var a12 = a[7];

        var a20 = a[2];
        var a21 = a[5];
        var a22 = a[8];

        var b00 = b[0];
        var b01 = b[3];
        var b02 = b[6];

        var b10 = b[1];
        var b11 = b[4];
        var b12 = b[7];

        var b20 = b[2];
        var b21 = b[5];
        var b22 = b[8];

        return [
            a00*b00 + a01*b10 + a02*b20,
            a10*b00 + a11*b10 + a12*b20,
            a20*b00 + a21*b10 + a22*b20,

            a00*b01 + a01*b11 + a02*b21,
            a10*b01 + a11*b11 + a12*b21,
            a20*b01 + a21*b11 + a22*b21,

            a00*b02 + a01*b12 + a02*b22,
            a10*b02 + a11*b12 + a12*b22,
            a20*b02 + a21*b12 + a22*b22
        ];
    },

    translation: function(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ];
    },

    scaling: function(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ];
    },

    rotation: function(angle) {

        var c = Math.cos(angle);
        var s = Math.sin(angle);

        return [
            c, s, 0,
            -s, c, 0,
            0, 0, 1
        ];
    },

    translate: function(m, tx, ty) {
        var t = m3.translation(tx, ty);
        return m3.multiply(t, m);
    },

    scale: function(m, sx, sy) {
        var s = m3.scaling(sx, sy);
        return m3.multiply(s, m);
    },

    rotate: function(m, angle) {
        var r = m3.rotation(angle);
        return m3.multiply(r, m);
    }

};