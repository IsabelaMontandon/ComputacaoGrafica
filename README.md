# Código-fonte do Math Plane

Esta pasta reúne o código do Math Plane, projeto de Computação Gráfica desenvolvido com HTML, CSS e JavaScript. A cena é renderizada no navegador com WebGL puro.

## Arquivos principais

| Arquivo | Função |
| --- | --- |
| [`index.html`](index.html) | Define a estrutura da página, o canvas onde a cena é desenhada e a ordem de carregamento dos scripts. |
| [`style.css`](style.css) | Define a aparência e a disposição dos elementos da interface. |
| [`airplane.js`](airplane.js) | Monta o modelo do avião, definindo a posição, a escala e a cor de suas peças. |
| [`geometry.js`](geometry.js) | Gera as malhas geométricas usadas para construir os objetos da cena. |
| [`m4.js`](m4.js) | Reúne as operações com matrizes 4×4 usadas nas transformações, na visualização e na projeção. |
| [`scene.js`](scene.js) | Inicializa o WebGL, monta a cena e coordena o desenho e as interações com a interface. |

## Como executar

Abra [`index.html`](index.html) pelo Live Server do VS Code ou por outro servidor HTTP, mantendo a pasta `texturas` junto aos arquivos-fonte. O navegador precisa oferecer suporte a WebGL. A página publicada no GitHub Pages também pode ser usada.

Esta versão da Entrega 05 inclui somente soma. A tela inicial apresenta Jogar, instruções e regras das estrelas. Use **↑/↓** para subir e descer, **→** para avançar, **1/2** para as câmeras e **R** para reiniciar. O botão **Pausar** permite continuar, reiniciar ou voltar à tela inicial.

Para acompanhar o que foi implementado em cada etapa, consulte a pasta [entregas](../entregas/).
