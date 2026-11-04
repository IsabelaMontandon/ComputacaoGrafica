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

Abra [`index.html`](index.html) no navegador, mantendo os arquivos na mesma pasta. Não é necessário instalar dependências. O navegador precisa oferecer suporte a WebGL.

Para acompanhar o que foi implementado em cada etapa, consulte a pasta [entregas](../entregas/).
