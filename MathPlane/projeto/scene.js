"use strict";

(async function () {
  // Inicialização do WebGL

  const canvas = document.querySelector("#scene");
  const error = document.querySelector("#error");

  let gl = canvas.getContext("webgl2", {
    antialias: true
  });

  const webgl2 = Boolean(gl);

  if (!gl) {
    gl = canvas.getContext("webgl", {
      antialias: true
    });
  }

  function fail(message) {
    error.hidden = false;
    error.textContent = message;
  }

  if (!gl) {
    fail(
      "WebGL indisponível. Use um navegador com aceleração gráfica habilitada."
    );

    return;
  }

  try {
    const version = webgl2 ? "#version 300 es\n" : "";
    const input = webgl2 ? "in" : "attribute";
    const varying = webgl2 ? "out" : "varying";
    const fragmentInput = webgl2 ? "in" : "varying";
    const fragmentOutput = webgl2 ? "fragmentColor" : "gl_FragColor";
    const textureFunction = webgl2 ? "texture" : "texture2D";

    // Compilação dos shaders

    function shader(type, source) {
      const compiledShader = gl.createShader(type);

      gl.shaderSource(compiledShader, source);
      gl.compileShader(compiledShader);

      if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(compiledShader));
      }

      return compiledShader;
    }

    const vertexSource = version + `
      ${input} vec3 position;
      ${input} vec3 color;
      ${input} vec3 normal;
      ${input} vec2 aTexCoord;

      uniform mat4 model;
      uniform mat4 view;
      uniform mat4 projection;
      uniform mat4 normalMatrix;

      uniform float smoothBalloon;

      ${varying} mediump vec3 surfaceColor;
      ${varying} mediump vec3 worldPosition;
      ${varying} mediump vec3 worldNormal;
      ${varying} mediump vec2 vTexCoord;

      void main() {
        vec4 world = model * vec4(position, 1.0);

        worldPosition = world.xyz;

        worldNormal = mat3(normalMatrix) * mix(
          normal,
          normalize(position + vec3(0.00001)),
          smoothBalloon
        );

        surfaceColor = color;
        vTexCoord = aTexCoord;

        // Mundo -> câmera -> projeção.
        gl_Position = projection * view * world;
      }
    `;

    const fragmentSource = version + `
      precision mediump float;

      ${fragmentInput} mediump vec3 surfaceColor;
      ${fragmentInput} mediump vec3 worldPosition;
      ${fragmentInput} mediump vec3 worldNormal;
      ${fragmentInput} mediump vec2 vTexCoord;

      uniform float sunEnabled;
      uniform float lampEnabled;
      uniform float nightMode;
      uniform float receivesHeadlight;
      uniform float emissive;
      uniform float beam;
      uniform float cloudSprite;

      uniform sampler2D uTexture;
      uniform vec3 lampPosition;

      ${webgl2 ? "out vec4 fragmentColor;" : ""}

      void main() {
        // Representação visual do feixe do farol.
        if (beam > 0.5) {
          float t = vTexCoord.x;

          float edge = 1.0 - smoothstep(
            0.65,
            1.0,
            abs(vTexCoord.y * 2.0 - 1.0)
              / max(0.035, 0.02 + 0.96 * t)
          );

          float alpha =
            0.24
            * edge
            * smoothstep(0.0, 0.035, t)
            * (1.0 - smoothstep(0.22, 1.0, t));

          ${fragmentOutput} = vec4(1.0, 0.81, 0.42, alpha);

          return;
        }

        vec3 n = normalize(worldNormal);

        // Sol direcional.
        float diffuseSun = max(
          dot(n, normalize(vec3(-0.4, 1.0, 0.7))),
          0.0
        );

        vec3 solar =
          sunEnabled
          * vec3(1.0, 0.96, 0.86)
          * 0.85
          * diffuseSun;

        // Farol no nariz do avião, voltado para +X.
        vec3 delta = worldPosition - lampPosition;

        float distanceToLamp = length(delta);
        vec3 directionFromLamp = normalize(delta);

        float alignment = dot(
          directionFromLamp,
          vec3(1.0, 0.0, 0.0)
        );

        float cone =
          smoothstep(0.57, 0.82, alignment)
          * (1.0 - smoothstep(9.0, 16.0, distanceToLamp));

        float attenuation = 1.0 / (
          1.0
          + 0.015 * distanceToLamp
          + 0.004 * distanceToLamp * distanceToLamp
        );

        float diffuseLamp = max(
          0.20 + 0.80 * dot(n, -directionFromLamp),
          0.0
        );

        vec3 headlight =
          lampEnabled
          * max(0.0, receivesHeadlight)
          * vec3(1.0, 0.93, 0.68)
          * 1.75
          * cone
          * attenuation
          * diffuseLamp;

        vec3 ambient = mix(
          vec3(0.32, 0.34, 0.38),
          vec3(0.31, 0.34, 0.43),
          nightMode
        );

        vec4 texel = ${textureFunction}(uTexture, vTexCoord);

        // Tratamento dos planos com textura de nuvem.
        if (cloudSprite > 0.5) {
          if (texel.a < 0.55) {
            discard;
          }

          vec3 skyTint = mix(
            vec3(0.98),
            vec3(0.28, 0.37, 0.56),
            nightMode
          );

          ${fragmentOutput} = vec4(texel.rgb * skyTint, 1.0);

          return;
        }

        vec3 material = surfaceColor * texel.rgb;

        if (nightMode > 0.5 && receivesHeadlight < 0.0) {
          ambient = vec3(0.105, 0.13, 0.19);
        }

        if (nightMode > 0.5 && receivesHeadlight > 0.0) {
          ambient += vec3(0.27, 0.23, 0.13);
        }

        vec3 result =
          material * (ambient + solar + headlight)
          + material * emissive;

        ${fragmentOutput} = vec4(result, 1.0);
      }
    `;

    const program = gl.createProgram();

    gl.attachShader(
      program,
      shader(gl.VERTEX_SHADER, vertexSource)
    );

    gl.attachShader(
      program,
      shader(gl.FRAGMENT_SHADER, fragmentSource)
    );

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    // Avião e terreno

    const scene = new Geometry.Model();

    buildAirplane(scene);

    const aircraftParts = new Set(scene.parts);
    const ground = -6;

    scene.add(
      "box",
      [4, ground - 0.16, -8],
      [80, 0.3, 64],
      "#7eaf68",
      [0, 0, 0],
      "chão"
    );

    scene.add(
      "box",
      [4, ground + 0.01, 0],
      [60, 0.12, 3.6],
      "#6e7e88",
      [0, 0, 0],
      "pista"
    );

    for (let x = -23; x <= 31; x += 4) {
      scene.add(
        "box",
        [x, ground + 0.075, 0],
        [1.9, 0.015, 0.12],
        "#f5efdf",
        [0, 0, 0],
        "faixa da pista"
      );
    }

    // Árvores e montanhas

    Geometry.meshes.cone = Geometry.lathe(
      [
        [-0.5, 0],
        [-0.5, 1],
        [0.5, 0]
      ],
      6
    );

    function tree(x, z, size) {
      scene.add(
        "cylinder",
        [x, ground + 0.65 * size, z],
        [1.3 * size, 0.22 * size, 0.22 * size],
        "#ffffff",
        [0, 0, Math.PI / 2],
        "tronco"
      );

      scene.add(
        "cone",
        [x, ground + 1.8 * size, z],
        [2.4 * size, 0.8 * size, 0.8 * size],
        "#ffffff",
        [0, 0, Math.PI / 2],
        "copa"
      );
    }

    const treePositions = [
      [-7, -7, 1.2],
      [-1, -10, 0.8],
      [5, -9, 1.1],
      [14, -7, 1.0],
      [21, -12, 1.2],
      [-12, 6, 0.8],
      [13, 7, 0.7]
    ];

    for (const [x, z, size] of treePositions) {
      tree(x, z, size);
    }

    const mountainPositions = [
      [-13, -25, 12, 14],
      [4, -29, 15, 18],
      [23, -28, 11, 14]
    ];

    for (const [x, z, height, radius] of mountainPositions) {
      scene.add(
        "cone",
        [x, ground + height / 2, z],
        [height, radius, radius],
        "#ffffff",
        [0, 0, Math.PI / 2],
        "montanha"
      );
    }

    // Grade de balões

    const columns = [];
    const balloonParts = new Map();
    const heights = [-3.45, -1.15, 1.15, 3.45];

    const initialNumbers = [
      2, 5, 1, 8,
      4, 9, 3, 6,
      7, 2, 5, 1,
      3, 6, 8, 4
    ];

    for (let i = 0; i < 4; i++) {
      const column = {
        x: 6 + i * 3.5,
        numbers: initialNumbers.slice(i * 4, i * 4 + 4)
      };

      columns.push(column);

      heights.forEach((y, row) => {
        const start = scene.parts.length;

        scene.add(
          "sphere",
          [0, y, 0],
          [0.57, 0.76, 0.57],
          "#ffd34c",
          [0, 0, 0],
          "balão"
        );

        scene.add(
          "cone",
          [0, y - 0.81, 0],
          [0.17, 0.13, 0.13],
          "#edb836",
          [0, 0, Math.PI / 2],
          "nó do balão"
        );

        scene.add(
          "box",
          [0, y - 1.01, 0],
          [0.022, 0.28, 0.022],
          "#c49b44",
          [0, 0, 0],
          "fio do balão"
        );

        for (const part of scene.parts.slice(start)) {
          balloonParts.set(part, { column, row });
        }
      });
    }

    // Plano que representa o feixe do farol

    const beamVertex = (x, y) => ({
      p: [x, y, 0],
      uv: [x, (y + 1) / 2]
    });

    Geometry.meshes.lightBeam = [
      [0, -1],
      [1, -1],
      [1, 1],
      [0, -1],
      [1, 1],
      [0, 1]
    ].map(([x, y]) => beamVertex(x, y));

    scene.add(
      "lightBeam",
      [2.57, 0, -0.63],
      [11, 7.5, 1],
      "#ffffff",
      [0, 0, 0],
      "feixe"
    );

    const beamPart = scene.parts.pop();

    // Malha preparada para as nuvens da próxima etapa

    const cloudVertex = (u, v) => ({
      p: [u - 0.5, v - 0.5, 0],
      uv: [u, v]
    });

    Geometry.meshes.cloudPlane = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 0],
      [1, 1],
      [0, 1]
    ].map(([u, v]) => cloudVertex(u, v));

    // Lente do farol

    const lampPosition = [2.56, 0, 0];

    scene.add(
      "cylinder",
      [2.5, 0, 0],
      [0.13, 0.28, 0.28],
      "#ffe9ae",
      [0, 0, 0],
      "lente do farol"
    );

    aircraftParts.add(scene.parts[scene.parts.length - 1]);

    // Buffer de vértices

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(scene.vertices),
      gl.STATIC_DRAW
    );

    const attributes = [
      ["position", 3, 0],
      ["color", 3, 12],
      ["normal", 3, 24],
      ["aTexCoord", 2, 36]
    ];

    for (const [name, size, offset] of attributes) {
      const location = gl.getAttribLocation(program, name);

      gl.enableVertexAttribArray(location);

      gl.vertexAttribPointer(
        location,
        size,
        gl.FLOAT,
        false,
        44,
        offset
      );
    }

    const uniforms = {};

    const uniformNames = [
      "model",
      "view",
      "projection",
      "normalMatrix",
      "sunEnabled",
      "lampEnabled",
      "lampPosition",
      "nightMode",
      "receivesHeadlight",
      "emissive",
      "beam",
      "smoothBalloon",
      "cloudSprite"
    ];

    for (const name of uniformNames) {
      uniforms[name] = gl.getUniformLocation(program, name);
    }

    gl.enable(gl.DEPTH_TEST);

    async function loadTexture(file) {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);

        img.onerror = () => {
          reject(new Error("Não foi possível carregar " + file + "."));
        };

        img.src = "texturas/" + file;
      });

      const texture = gl.createTexture();

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        gl.REPEAT
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        gl.REPEAT
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        gl.LINEAR
      );

      gl.generateMipmap(gl.TEXTURE_2D);

      return texture;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(program, "uTexture"), 0);

    // Textura branca para peças que usam apenas cor

    const white = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, white);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255])
    );

    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR
    );

    const textureEntries = [
      ["fuselagem", "fuselagem-creme.png"],
      ["chão", "grama.png"],
      ["montanha", "rocha.png"],
      ["tronco", "casca.png"],
      ["copa", "folhagem.png"],
      ["balão liso", "balao-sem-numero.png"],

      ...Array.from(
        { length: 9 },
        (_, i) => [
          "balão " + (i + 1),
          "balao-" + (i + 1) + ".png"
        ]
      )
    ];

    const textures = new Map(
      await Promise.all(
        textureEntries.map(async ([part, file]) => [
          part,
          await loadTexture(file)
        ])
      )
    );

    // Câmeras

    const cameras = [
      {
        name: "Lateral",
        eye: [7.8, 1.5, 21],
        target: [7.8, -0.35, 0]
      },
      {
        name: "Diagonal",
        eye: [-11, 4.5, 15.5],
        target: [7.8, -0.2, 0]
      }
    ];

    let camera = 0;
    let night = false;
    let sun = true;
    let lamp = false;

    const keys = new Set();

    const movementKeys = new Set([
      "ArrowRight",
      "ArrowUp",
      "ArrowDown"
    ]);

    let travel = 0;
    let altitude = 0;
    let propellerAngle = 0;
    let flightFrame = 0;

    // Renderização

    function draw() {
      const dpr = Math.min(devicePixelRatio || 1, 2);

      const width = Math.max(
        1,
        Math.round(innerWidth * dpr)
      );

      const height = Math.max(
        1,
        Math.round(innerHeight * dpr)
      );

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);

      if (night) {
        gl.clearColor(0.025, 0.065, 0.16, 1);
      } else {
        gl.clearColor(0.57, 0.80, 0.94, 1);
      }

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Projeção perspectiva

      const aspect = canvas.width / canvas.height;

      const fov = 2 * Math.atan(
        Math.tan(48 * Math.PI / 360)
        * Math.max(1, 1.6 / aspect)
      );

      const projection = M4.perspective(
        fov,
        aspect,
        0.1,
        180
      );

      const selectedCamera = cameras[camera];

      const view = M4.lookAt(
        selectedCamera.eye,
        selectedCamera.target
      );

      gl.uniformMatrix4fv(
        uniforms.projection,
        false,
        new Float32Array(projection)
      );

      gl.uniformMatrix4fv(
        uniforms.view,
        false,
        new Float32Array(view)
      );

      // Iluminação

      gl.uniform1f(uniforms.sunEnabled, sun ? 1 : 0);
      gl.uniform1f(uniforms.lampEnabled, lamp ? 1 : 0);
      gl.uniform1f(uniforms.nightMode, night ? 1 : 0);

      gl.uniform3fv(uniforms.lampPosition, [
        lampPosition[0],
        lampPosition[1] + altitude,
        lampPosition[2]
      ]);

      // Área de leitura dos números à noite

      const visibleColumns = night
        ? columns
            .filter(column => column.x > lampPosition[0])
            .sort((a, b) => a.x - b.x)
            .slice(0, 2)
        : [];

      const activeRow = Math.min(
        heights.length - 1,
        Math.max(
          0,
          Math.round(
            (altitude - heights[0])
            / (heights[1] - heights[0])
          )
        )
      );

      // Desenho das peças

      for (const part of scene.parts) {
        const item = balloonParts.get(part);
        const aircraft = aircraftParts.has(part);
        const [x, y, z] = part.position;

        const wrap = (offset, period, min) => (
          ((offset - min) % period + period) % period + min
        );

        let pos = part.position;

        if (item) {
          pos = [item.column.x, y, z];
        } else if (aircraft) {
          pos = [x, y + altitude, z];
        } else if (part.name === "faixa da pista") {
          pos = [wrap(x - travel, 56, -23), y, z];
        } else if (
          part.name === "tronco"
          || part.name === "copa"
        ) {
          pos = [wrap(x - travel, 55, -23), y, z];
        } else if (part.name === "montanha") {
          pos = [wrap(x - travel * 0.18, 75, -38), y, z];
        }

        const cloud = part.name === "nuvem";

        if (cloud) {
          pos = [wrap(x - travel * 0.09, 68, -24), y, z];
        }

        gl.uniform1f(
          uniforms.cloudSprite,
          cloud ? 1 : 0
        );

        const texturedBalloon = item && part.name === "balão";

        const inLitArea =
          item
          && visibleColumns.includes(item.column)
          && Math.abs(item.row - activeRow) <= 1;

        const showNumber =
          texturedBalloon && (!night || inLitArea);

        let textureKey = part.name;

        if (texturedBalloon) {
          textureKey = showNumber
            ? "balão " + item.column.numbers[item.row]
            : "balão liso";
        }

        gl.bindTexture(
          gl.TEXTURE_2D,
          textures.get(textureKey) || white
        );

        gl.uniform1f(
          uniforms.receivesHeadlight,
          item ? (inLitArea ? 1 : -1) : 0
        );

        gl.uniform1f(
          uniforms.emissive,
          part.name === "lente do farol" && lamp ? 1 : 0
        );

        gl.uniform1f(
          uniforms.smoothBalloon,
          texturedBalloon ? 1 : 0
        );

        // Orientação dos balões e da hélice

        const spins = part.name === "hélice";
        const eye = selectedCamera.eye;

        let facing = 0;

        if (texturedBalloon) {
          facing = night && camera === 0
            ? -Math.PI / 2
            : Math.PI / 2 - Math.atan2(
                eye[2] - pos[2],
                eye[0] - pos[0]
              );
        }

        let rotation = part.rotation;

        if (spins) {
          rotation = [propellerAngle, 0, 0];
        } else if (texturedBalloon) {
          rotation = [0, facing, 0];
        } else if (cloud) {
          rotation = [
            0,
            Math.atan2(
              eye[0] - pos[0],
              eye[2] - pos[2]
            ),
            0
          ];
        }

        const matrix = pos !== part.position || spins
          ? M4.compose(pos, rotation, part.scale)
          : part.matrix;

        const normals = spins || texturedBalloon
          ? M4.normalMatrix(pos, rotation, part.scale)
          : part.normalMatrix;

        gl.uniformMatrix4fv(
          uniforms.model,
          false,
          new Float32Array(matrix)
        );

        gl.uniformMatrix4fv(
          uniforms.normalMatrix,
          false,
          new Float32Array(normals)
        );

        gl.drawArrays(
          gl.TRIANGLES,
          part.first,
          part.count
        );
      }

      // Desenho do feixe transparente

      gl.uniform1f(uniforms.cloudSprite, 0);

      if (lamp) {
        gl.enable(gl.BLEND);

        gl.blendFunc(
          gl.SRC_ALPHA,
          gl.ONE_MINUS_SRC_ALPHA
        );

        gl.depthMask(false);
        gl.uniform1f(uniforms.beam, 1);

        const beamMatrix = M4.compose(
          [2.57, altitude, -0.63],
          [0, 0, 0],
          beamPart.scale
        );

        gl.uniformMatrix4fv(
          uniforms.model,
          false,
          new Float32Array(beamMatrix)
        );

        gl.uniformMatrix4fv(
          uniforms.normalMatrix,
          false,
          new Float32Array(beamPart.normalMatrix)
        );

        gl.drawArrays(
          gl.TRIANGLES,
          beamPart.first,
          beamPart.count
        );

        gl.uniform1f(uniforms.beam, 0);
        gl.depthMask(true);
        gl.disable(gl.BLEND);
      }
    }

    // Deslocamento das colunas
    // Preparado para as próximas etapas.

    function updateColumns(distance) {
      travel += distance;

      for (const column of columns) {
        column.x -= distance;

        if (column.x < -4) {
          column.x =
            Math.max(...columns.map(other => other.x))
            + 3.5;
        }
      }
    }

    // Atualização por quadro

    let previous;

    function step(now) {
      const dt = previous === undefined
        ? 0
        : Math.min((now - previous) / 1000, 0.05);

      previous = now;

      const climb =
        Number(keys.has("ArrowUp"))
        - Number(keys.has("ArrowDown"));

      // O movimento e a hélice serão habilitados na etapa 2.

      draw();

      flightFrame = requestAnimationFrame(step);
    }

    // Controles do teclado

    window.addEventListener("keydown", event => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (movementKeys.has(event.key)) {
        event.preventDefault();
        keys.add(event.key);

        return;
      }

      if (event.repeat) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "r") {
        travel = 0;
        altitude = 0;

        keys.clear();

        columns.forEach((column, i) => {
          column.x = 6 + i * 3.5;

          column.numbers = initialNumbers.slice(
            i * 4,
            i * 4 + 4
          );
        });
      } else if (key === "1") {
        camera = 0;
      } else if (key === "2") {
        camera = 1;
      } else if (key === "n") {
        night = !night;
        sun = !night;
        lamp = night;
      }
    });

    window.addEventListener("keyup", event => {
      keys.delete(event.key);
    });

    window.addEventListener("blur", () => {
      keys.clear();
    });

    canvas.addEventListener("webglcontextlost", event => {
      event.preventDefault();

      cancelAnimationFrame(flightFrame);

      fail("Contexto gráfico interrompido. Recarregue a página.");
    });

    // Início da execução

    draw();

    flightFrame = requestAnimationFrame(step);
  } catch (error) {
    fail(error.message);
  }
})();