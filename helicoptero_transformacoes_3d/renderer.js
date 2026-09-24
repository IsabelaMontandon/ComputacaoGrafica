class Renderer {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.positionLocation = gl.getAttribLocation(program, "a_position");
        this.colorLocation = gl.getAttribLocation(program, "a_color");
        this.modelTransformLocation = gl.getUniformLocation(program, "u_modelTransform");

        this.bufferCache = new WeakMap();
    }

    getBuffers(geometry) {
        if (this.bufferCache.has(geometry)) {
            return this.bufferCache.get(geometry);
        }

        const gl = this.gl;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry.colors, gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);

        const buffers = {
            positionBuffer,
            colorBuffer,
            indexBuffer
        };

        this.bufferCache.set(geometry, buffers);
        return buffers;
    }

    draw(object) {
        const gl = this.gl;
        const geometry = object.geometry;
        const buffers = this.getBuffers(geometry);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.colorLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
        gl.uniformMatrix4fv(this.modelTransformLocation, false, object.modelTransform);

        gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
