# Animação com POO

O exercício desenha um robô em um canvas 2D e anima seus braços e pernas.

## Conteúdos da disciplina

- Modelagem por composição de formas simples.
- Transformações 2D: translação até a articulação e rotação da peça em torno desse ponto.
- Animação com `requestAnimationFrame`: a cada quadro, o programa atualiza os ângulos, limpa o canvas e redesenha o robô.
- Organização com a classe `Robo`, que guarda o estado da animação e separa atualização e desenho.

## Como testar

Abra [index.html](index.html) no navegador. A animação começa automaticamente, sem controles. Observe que o corpo fica no lugar enquanto braços e pernas oscilam em torno das articulações, invertendo o movimento ao atingir seus limites.
