const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL não está disponível.");
}

function criarShader(gl, tipo, codigo) {
    const shader = gl.createShader(tipo);

    gl.shaderSource(shader, codigo);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
    }

    return shader;
}

const vertexShaderSource =
    document.getElementById("vertex-shader").textContent;

const fragmentShaderSource =
    document.getElementById("fragment-shader").textContent;

const vertexShader = criarShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = criarShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);
gl.useProgram(program);

const positionLocation =
    gl.getAttribLocation(program, "aPosition");

const resolutionLocation =
    gl.getUniformLocation(program, "uResolution");

const colorLocation =
    gl.getUniformLocation(program, "uColor");

const buffer = gl.createBuffer();

let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;

let primeiroClique = true;

// Cor inicial azul
let corAtual = [0.0, 0.0, 1.0, 1.0];

// Cores associadas às teclas de 0 a 9
const cores = {
    "0": [0.0, 0.0, 0.0, 1.0], // preto
    "1": [1.0, 0.0, 0.0, 1.0], // vermelho
    "2": [0.0, 1.0, 0.0, 1.0], // verde
    "3": [0.0, 0.0, 1.0, 1.0], // azul
    "4": [1.0, 1.0, 0.0, 1.0], // amarelo
    "5": [1.0, 0.0, 1.0, 1.0], // magenta
    "6": [0.0, 1.0, 1.0, 1.0], // ciano
    "7": [1.0, 0.5, 0.0, 1.0], // laranja
    "8": [0.5, 0.0, 1.0, 1.0], // roxo
    "9": [1.0, 1.0, 1.0, 1.0]  // branco
};

function alterarCor(tecla) {
    if (cores[tecla]) {
        corAtual = cores[tecla];
        desenharLinha();
    }
}

// Algoritmo de Bresenham
function bresenham(xInicial, yInicial, xFinal, yFinal) {
    const pontos = [];

    let x = Math.round(xInicial);
    let y = Math.round(yInicial);

    const xf = Math.round(xFinal);
    const yf = Math.round(yFinal);

    const dx = Math.abs(xf - x);
    const dy = Math.abs(yf - y);

    const sx = x < xf ? 1 : -1;
    const sy = y < yf ? 1 : -1;

    let erro = dx - dy;

    while (true) {
        pontos.push(x);
        pontos.push(y);

        if (x === xf && y === yf) {
            break;
        }

        const erro2 = 2 * erro;

        if (erro2 > -dy) {
            erro -= dy;
            x += sx;
        }

        if (erro2 < dx) {
            erro += dx;
            y += sy;
        }
    }

    return pontos;
}

function desenharLinha() {
    const pontos = bresenham(x1, y1, x2, y2);

    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(pontos),
        gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform2f(
        resolutionLocation,
        canvas.width,
        canvas.height
    );

    gl.uniform4fv(colorLocation, corAtual);

    // A reta é desenhada ponto a ponto, sem GL_LINES
    gl.drawArrays(
        gl.POINTS,
        0,
        pontos.length / 2
    );
}

canvas.addEventListener("mousedown", function(event) {
    if (event.button !== 0) {
        return;
    }

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;

    // Inverte o eixo Y para o sistema do WebGL
    const y = canvas.height - (event.clientY - rect.top);

    if (primeiroClique) {
        x1 = x;
        y1 = y;
        primeiroClique = false;
    } else {
        x2 = x;
        y2 = y;
        primeiroClique = true;
        desenharLinha();
    }
});

window.addEventListener("keydown", function(event) {
    alterarCor(event.key);
});

gl.viewport(
    0,
    0,
    canvas.width,
    canvas.height
);

// Linha inicial azul entre (0,0) e (0,0)
desenharLinha();
