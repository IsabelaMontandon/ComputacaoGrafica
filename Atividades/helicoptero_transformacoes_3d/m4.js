var m4 = {
    identity: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    multiply: function(a, b) {
        var a00 = a[0], a01 = a[4], a02 = a[8], a03 = a[12];
        var a10 = a[1], a11 = a[5], a12 = a[9], a13 = a[13];
        var a20 = a[2], a21 = a[6], a22 = a[10], a23 = a[14];
        var a30 = a[3], a31 = a[7], a32 = a[11], a33 = a[15];

        var b00 = b[0], b01 = b[4], b02 = b[8], b03 = b[12];
        var b10 = b[1], b11 = b[5], b12 = b[9], b13 = b[13];
        var b20 = b[2], b21 = b[6], b22 = b[10], b23 = b[14];
        var b30 = b[3], b31 = b[7], b32 = b[11], b33 = b[15];

        return [
            a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
            a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
            a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
            a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,

            a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
            a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
            a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
            a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,

            a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
            a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
            a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
            a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,

            a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
            a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
            a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
            a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33
        ];
    },

    translation: function(tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ];
    },

    xRotation: function(angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
    },

    yRotation: function(angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
    },

    zRotation: function(angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    translate: function(m, tx, ty, tz) {
        return m4.multiply(m4.translation(tx, ty, tz), m);
    },

    xRotate: function(m, angle) {
        return m4.multiply(m4.xRotation(angle), m);
    },

    yRotate: function(m, angle) {
        return m4.multiply(m4.yRotation(angle), m);
    },

    zRotate: function(m, angle) {
        return m4.multiply(m4.zRotation(angle), m);
    }
};
