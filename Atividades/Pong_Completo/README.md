# Pong

## Conteúdos da disciplina

As raquetes e a bola são construídas com geometria 2D. Matrizes de translação atualizam suas posições, e o WebGL 2 redesenha a cena a cada quadro. As colisões são verificadas pela posição da bola: ao tocar o topo ou a base, sua velocidade vertical muda de sentido; ao acertar uma raquete, a velocidade horizontal é invertida.

## Como testar

1. Abra [index.html](index.html) em um navegador com WebGL 2. A bola começa a se mover automaticamente.
2. Use **W/S** para subir e descer a raquete esquerda e **↑/↓** para a direita. Segure as teclas para testar os limites de movimento.
3. Intercepte a bola com uma raquete e observe o rebote. Deixe a bola passar por uma lateral: ela deve reaparecer no centro e seguir na direção oposta à da saída.
