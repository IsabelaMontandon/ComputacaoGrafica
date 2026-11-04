function createBox(minX, maxX, minY, maxY, minZ, maxZ, color) {
    const vertices = new Float32Array([
        minX, minY, maxZ,
        maxX, minY, maxZ,
        maxX, maxY, maxZ,
        minX, maxY, maxZ,

        minX, minY, minZ,
        maxX, minY, minZ,
        maxX, maxY, minZ,
        minX, maxY, minZ
    ]);

    const colors = new Float32Array(Array(8).fill(color).flat());

    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,
        4, 6, 5, 4, 7, 6,
        0, 3, 7, 0, 7, 4,
        1, 5, 6, 1, 6, 2,
        3, 2, 6, 3, 6, 7,
        0, 4, 5, 0, 5, 1
    ]);

    return { vertices, colors, indices };
}

function combineGeometries(geometries) {
    const vertices = [];
    const colors = [];
    const indices = [];
    let vertexOffset = 0;

    geometries.forEach((geometry) => {
        vertices.push(...geometry.vertices);
        colors.push(...geometry.colors);

        geometry.indices.forEach((index) => {
            indices.push(index + vertexOffset);
        });

        vertexOffset += geometry.vertices.length / 3;
    });

    return {
        vertices: new Float32Array(vertices),
        colors: new Float32Array(colors),
        indices: new Uint16Array(indices)
    };
}

const helicopterBodyGeometry = createBox(
    -0.2, 0.2,
    -0.2, 0.2,
    -0.2, 0.2,
    [0.2, 0.7, 0.9]
);

const helicopterTopShaftGeometry = createBox(
    -0.03, 0.03,
    0.2, 0.3,
    -0.03, 0.03,
    [0.35, 0.35, 0.35]
);

const helicopterTailGeometry = createBox(
    0.0, 0.7,
    -0.05, 0.05,
    -0.05, 0.05,
    [0.8, 0.2, 0.2]
);

const helicopterPropellersGeometry = combineGeometries([
    createBox(
        -0.8, 0.8,
        0.30, 0.35,
        -0.05, 0.05,
        [0.4, 0.8, 0.4]
    ),
    createBox(
        -0.05, 0.05,
        0.35, 0.40,
        -0.8, 0.8,
        [0.4, 0.85, 0.85]
    )
]);

const helicopterTailPropellerGeometry = combineGeometries([
    createBox(
        0.55, 0.85,
        -0.025, 0.025,
        0.05, 0.07,
        [0.35, 0.75, 0.65]
    ),
    createBox(
        0.675, 0.725,
        -0.15, 0.15,
        0.05, 0.07,
        [0.35, 0.85, 0.85]
    )
]);
