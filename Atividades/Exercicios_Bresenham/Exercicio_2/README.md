# Exercício 2 — Retas e contornos de triângulos

## Conteúdos da disciplina

O programa reutiliza Bresenham para rasterizar segmentos. Para um triângulo, calcula os pontos dos três lados, incluindo o segmento que liga o último vértice ao primeiro. O WebGL desenha esses pontos para formar o contorno; o interior permanece vazio. Eventos de teclado escolhem o modo e a cor, e os cliques definem os vértices.

## Como testar

1. Abra [index.html](index.html) em um navegador com WebGL.
2. Pressione **R** e dê dois cliques com o botão esquerdo no canvas. Deve aparecer uma reta entre os pontos.
3. Pressione **T** e clique em três pontos que não estejam alinhados. No terceiro clique, deve aparecer o contorno fechado do triângulo.
4. Pressione **1**, **2** ou **3** e desenhe outra figura para testar vermelho, verde ou azul. As teclas **0–9** escolhem a cor do próximo desenho. Cada figura nova substitui a anterior.
