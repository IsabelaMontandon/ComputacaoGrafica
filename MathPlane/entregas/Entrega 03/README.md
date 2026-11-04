# Math Plane

**Atividade 3 - Câmeras, projeção perspectiva e iluminação**

Computação Gráfica · UNIFESP

**Integrantes:** Enzo Ascaneo e Isabela Montandon Bustamante.

## O que foi entregue

Nesta etapa, reaproveitamos o avião modelado na Atividade 2 para montar uma cena de voo em WebGL. Mantivemos a pista e as árvores e acrescentamos montanhas e seis balões, distribuídos em duas fileiras.

- **Câmeras:** a vista lateral mostra o perfil do avião; a diagonal mostra a cena por trás e por cima.
- **Projeção perspectiva:** na vista diagonal, os balões mais distantes parecem menores, embora todos tenham o mesmo tamanho no espaço 3D.
- **Iluminação:** de dia, o sol ilumina o cenário. À noite, o farol do avião acende automaticamente e destaca os balões à frente.

## Como testar

Abra o arquivo [`index.html`](../../projeto/index.html) em um navegador com suporte a WebGL. Use **1** para a câmera lateral, **2** para a diagonal e **N** para alternar entre dia e noite. Os botões **Câmera** e **Modo Dia/Noite** também permitem fazer essas mudanças.

O código-fonte está na pasta [`MathPlane/projeto`](../../projeto/).

## Demonstração

- [Ver as capturas das duas câmeras de dia e à noite](demonstracao/)
- [Assistir à gravação no YouTube](https://youtu.be/WMneL6LS1FQ?feature=shared)

No vídeo, demonstramos primeiro os botões e depois os atalhos de teclado. As duas câmeras são mostradas de dia e à noite para comparar os enquadramentos e o efeito da iluminação.
