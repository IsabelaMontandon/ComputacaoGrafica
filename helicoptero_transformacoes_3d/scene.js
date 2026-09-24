class Scene {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.renderer = new Renderer(gl, program);

        this.helicopterBody = new HelicopterBody();
        this.helicopterTopShaft = new HelicopterTopShaft();
        this.helicopterTail = new HelicopterTail();
        this.helicopterPropellers = new HelicopterPropellers();
        this.helicopterTailPropeller = new HelicopterTailPropeller();

        this.positionX = -0.25;
        this.positionY = 0.0;
        this.rotorAngle = 0.0;

        this.moveSpeed = 0.012;
        this.rotorSpeed = 0.08;
        this.keys = {};

        window.addEventListener("keydown", (event) => {
            if (event.key.startsWith("Arrow")) {
                event.preventDefault();
                this.keys[event.key] = true;
            }
        });

        window.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;
        });
    }

    update() {
        if (this.keys["ArrowUp"]) {
            this.positionY += this.moveSpeed;
        }

        if (this.keys["ArrowDown"]) {
            this.positionY -= this.moveSpeed;
        }

        if (this.keys["ArrowLeft"]) {
            this.positionX -= this.moveSpeed;
        }

        if (this.keys["ArrowRight"]) {
            this.positionX += this.moveSpeed;
        }

        this.rotorAngle += this.rotorSpeed;

        const helicopterTransform = m4.translation(
            this.positionX,
            this.positionY,
            0
        );

        this.helicopterBody.update(helicopterTransform);
        this.helicopterTopShaft.update(helicopterTransform);
        this.helicopterTail.update(helicopterTransform);

        let topRotorTransform = m4.yRotation(this.rotorAngle);
        topRotorTransform = m4.translate(
            topRotorTransform,
            this.positionX,
            this.positionY,
            0
        );

        this.helicopterPropellers.update(topRotorTransform);

        // A hélice traseira gira em torno do centro x = 0.7.
        let tailRotorTransform = m4.translation(-0.7, 0, 0);
        tailRotorTransform = m4.zRotate(tailRotorTransform, this.rotorAngle);
        tailRotorTransform = m4.translate(tailRotorTransform, 0.7, 0, 0);
        tailRotorTransform = m4.translate(
            tailRotorTransform,
            this.positionX,
            this.positionY,
            0
        );

        this.helicopterTailPropeller.update(tailRotorTransform);
    }

    draw() {
        const gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.program);

        this.helicopterBody.draw(this.renderer);
        this.helicopterTopShaft.draw(this.renderer);
        this.helicopterTail.draw(this.renderer);
        this.helicopterPropellers.draw(this.renderer);
        this.helicopterTailPropeller.draw(this.renderer);
    }

    execute() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.execute());
    }

    init() {
        requestAnimationFrame(() => this.execute());
    }
}
