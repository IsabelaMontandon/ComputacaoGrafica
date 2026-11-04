class SceneObject {
    constructor(geometry) {
        this.geometry = geometry;
        this.modelTransform = m4.identity();
    }

    update(modelTransform) {
        this.modelTransform = modelTransform;
    }

    draw(renderer) {
        renderer.draw(this);
    }
}

class HelicopterBody extends SceneObject {
    constructor() {
        super(helicopterBodyGeometry);
    }
}

class HelicopterTopShaft extends SceneObject {
    constructor() {
        super(helicopterTopShaftGeometry);
    }
}

class HelicopterTail extends SceneObject {
    constructor() {
        super(helicopterTailGeometry);
    }
}

class HelicopterPropellers extends SceneObject {
    constructor() {
        super(helicopterPropellersGeometry);
    }
}

class HelicopterTailPropeller extends SceneObject {
    constructor() {
        super(helicopterTailPropellerGeometry);
    }
}
