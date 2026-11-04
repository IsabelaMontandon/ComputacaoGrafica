# Math Plane

Computação Gráfica

## Integrantes do grupo

- Enzo Ascaneo
- Isabela Montandon Bustamante

## Jogo que será desenvolvido

Nossa ideia é desenvolver o Math Plane, um jogo educativo para crianças em que o jogador pilota um avião e resolve desafios de matemática ao longo do caminho.

## Descrição do jogo

O personagem principal será Pip, um pequeno avião. Usando as setas do teclado, o jogador poderá subir e descer para escolher quais balões pegar. Eles ficarão organizados em quatro linhas, com alguns numerados e outros vazios.

Em cada desafio, será preciso chegar a um resultado indicado na tela. Para isso, o jogador deverá escolher os números que ajudam a completar a conta. Por exemplo, se a meta de uma soma for 15, ele poderá pegar os balões 3, 5 e 7. Já os balões vazios servirão para passar sem mudar o valor acumulado.

Pensamos em dividir o jogo em quatro ilhas, cada uma ligada a uma estação do ano e a uma operação: verão para soma, outono para multiplicação, inverno para subtração e primavera para divisão. Cada ilha terá dez desafios. Também queremos oferecer três dificuldades: uma com balões parados, outra com movimento mais tranquilo e uma terceira mais rápida.

O objetivo será completar as contas para avançar pelas ilhas. O jogador terá três vidas e poderá ganhar estrelas de acordo com o tempo que levar para terminar. Pelo menos uma estrela será necessária para liberar a ilha seguinte.

## Ideias iniciais das estratégias de desenvolvimento

- Pretendemos usar JavaScript e WebGL para que o jogo funcione no navegador, aproveitando o que estamos aprendendo nas atividades de Computação Gráfica.
- Vamos começar com formas geométricas para desenhar o avião, os balões e o cenário, acrescentando movimentos e animações simples.
- A ideia é fazer o avião responder às setas do teclado e atualizar a conta sempre que ele pegar um balão numerado.
- Primeiro, queremos montar uma fase de soma para testar os controles e a escolha dos números. Depois, usaremos essa base para criar as outras operações.
