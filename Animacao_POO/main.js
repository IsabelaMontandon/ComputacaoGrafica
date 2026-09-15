const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Robo {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.anguloBraco = 0;
        this.anguloPerna = 0;

        this.sentidoBraco = 1;
        this.sentidoPerna = 1;
    }

    atualizar() {
        this.anguloBraco += 0.02 * this.sentidoBraco;
        this.anguloPerna += 0.015 * this.sentidoPerna;

        if (this.anguloBraco > 0.5 || this.anguloBraco < -0.5) {
            this.sentidoBraco *= -1;
        }

        if (this.anguloPerna > 0.3 || this.anguloPerna < -0.3) {
            this.sentidoPerna *= -1;
        }
    }

    desenhar() {
        this.desenharCabeca();
        this.desenharCorpo();
        this.desenharBracos();
        this.desenharPernas();
    }

    desenharCabeca() {
        ctx.fillStyle = "lightblue";

        ctx.fillRect(
            this.x - 40,
            this.y - 130,
            80,
            60
        );

        // olhos
        ctx.fillStyle = "black";

        ctx.beginPath();
        ctx.arc(this.x - 20, this.y - 105, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x + 20, this.y - 105, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    desenharCorpo() {
        ctx.fillStyle = "blue";

        ctx.fillRect(
            this.x - 50,
            this.y - 60,
            100,
            120
        );
    }

    desenharBracos() {
        ctx.fillStyle = "darkblue";

        // braço esquerdo
        ctx.save();

        ctx.translate(
            this.x - 50,
            this.y - 50
        );

        ctx.rotate(this.anguloBraco);

        ctx.fillRect(
            -20,
            0,
            20,
            100
        );

        ctx.restore();


        // braço direito
        ctx.save();

        ctx.translate(
            this.x + 50,
            this.y - 50
        );

        ctx.rotate(-this.anguloBraco);

        ctx.fillRect(
            0,
            0,
            20,
            100
        );

        ctx.restore();
    }

    desenharPernas() {
        ctx.fillStyle = "darkblue";

        // perna esquerda
        ctx.save();

        ctx.translate(
            this.x - 25,
            this.y + 60
        );

        ctx.rotate(this.anguloPerna);

        ctx.fillRect(
            -20,
            0,
            25,
            100
        );

        ctx.restore();


        // perna direita
        ctx.save();

        ctx.translate(
            this.x + 25,
            this.y + 60
        );

        ctx.rotate(-this.anguloPerna);

        ctx.fillRect(
            -5,
            0,
            25,
            100
        );

        ctx.restore();
    }
}


const robo = new Robo(400, 300);


function animar() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    robo.atualizar();
    robo.desenhar();

    requestAnimationFrame(animar);
}


animar();