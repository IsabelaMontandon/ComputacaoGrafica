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

let modo = "reta";
let cliques = [];

let corAtual = [0.0, 0.0, 1.0, 1.0];

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
    }
}

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

function desenharPontos(pontos) {
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

    gl.drawArrays(
        gl.POINTS,
        0,
        pontos.length / 2
    );
}

function limparTela() {
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function desenharLinha(x1, y1, x2, y2) {
    limparTela();

    const pontos = bresenham(x1, y1, x2, y2);

    desenharPontos(pontos);
}

function desenharTriangulo(x1, y1, x2, y2, x3, y3) {
    limparTela();

    const lado1 = bresenham(x1, y1, x2, y2);
    const lado2 = bresenham(x2, y2, x3, y3);
    const lado3 = bresenham(x3, y3, x1, y1);

    const pontos = [
        ...lado1,
        ...lado2,
        ...lado3
    ];

    desenharPontos(pontos);
}

canvas.addEventListener("mousedown", function(event) {
    if (event.button !== 0) {
        return;
    }

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;

    // Inverte o eixo Y para o sistema do WebGL
    const y = canvas.height - (event.clientY - rect.top);

    cliques.push({ x, y });

    if (modo === "reta" && cliques.length === 2) {
        desenharLinha(
            cliques[0].x,
            cliques[0].y,
            cliques[1].x,
            cliques[1].y
        );

        cliques = [];
    }

    if (modo === "triangulo" && cliques.length === 3) {
        desenharTriangulo(
            cliques[0].x,
            cliques[0].y,
            cliques[1].x,
            cliques[1].y,
            cliques[2].x,
            cliques[2].y
        );

        cliques = [];
    }
});

window.addEventListener("keydown", function(event) {
    const tecla = event.key;

    alterarCor(tecla);

    if (tecla === "r" || tecla === "R") {
        modo = "reta";
        cliques = [];
    }

    if (tecla === "t" || tecla === "T") {
        modo = "triangulo";
        cliques = [];
    }
});

gl.viewport(
    0,
    0,
    canvas.width,
    canvas.height
);

// Linha inicial azul entre (0,0) e (0,0)
desenharLinha(0, 0, 0, 0);
