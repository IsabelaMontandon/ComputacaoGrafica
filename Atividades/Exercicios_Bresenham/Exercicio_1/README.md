# Exercício 1 — Rasterização de retas

## Conteúdos da disciplina

O algoritmo de Bresenham escolhe os pontos inteiros que aproximam uma reta entre dois extremos. A cada passo, um erro acumulado indica se o algoritmo precisa avançar em um ou nos dois eixos. O código converte os cliques do mouse em coordenadas do canvas, invertendo o eixo vertical, e envia os pontos ao WebGL. A reta é desenhada com `gl.POINTS`.

## Como testar

1. Abra [index.html](index.html) em um navegador com WebGL.
2. Clique com o botão esquerdo em dois pontos do canvas. O primeiro clique define o início; o segundo completa a reta.
3. Pressione **1** para vermelho, **2** para verde ou **3** para azul. As teclas **0–9** selecionam cores, e a reta atual é redesenhada na cor escolhida.
4. Faça novos pares de cliques e compare retas horizontais, verticais e diagonais. Inverta a ordem dos extremos para testar o sentido oposto. Cada nova reta substitui o desenho anterior.
