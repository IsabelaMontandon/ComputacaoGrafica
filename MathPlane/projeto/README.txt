MATH PLANE — ATIVIDADE 2
Modelagem 3D e construção inicial da cena

Integrantes
Enzo Ascaneo — RA 180377
Isabela Montandon Bustamante — RA 176520

Como executar
1. Extraia o ZIP inteiro.
2. Abra projeto/index.html no Chrome, Edge ou Firefox com WebGL disponível.
3. A cena inicial aparece automaticamente. Não há controles nesta entrega.

Mantenha os arquivos da pasta projeto juntos. Não é necessário instalar
bibliotecas, usar um servidor ou estar conectado à internet.
Se o navegador informar WebGL indisponível, utilize um navegador que tenha
suporte a WebGL e aceleração gráfica disponível.

Tecnologia
WebGL puro, JavaScript, HTML e CSS. A página tenta WebGL 2 primeiro e utiliza
WebGL 1 como alternativa. A geometria continua sendo 3D em ambos os casos.

Conteúdo
Um avião com 18 peças e 900 triângulos, sobre uma pista, com chão e duas
árvores. Posições, escalas e rotações são aplicadas por matrizes 4x4.
A visualização é uma única vista ortográfica fixa, com cores planas.
Os tons das faces são cores constantes, sem cálculos de iluminação.
A hélice permanece parada.

Arquivos
index.html e style.css — página e dimensionamento do canvas.
m4.js — matrizes de modelagem e projeção ortográfica.
geometry.js — malhas de caixa, esfera, cilindro e fuselagem por revolução.
airplane.js — montagem das peças do avião.
scene.js — composição do cenário e desenho da cena.

Origem
Utilizamos o ChatGPT como apoio na concepção dos gráficos, na construção
do avião e no código. Todas as malhas são geradas no próprio código.
Nenhum arquivo de modelo 3D externo foi importado. O visual utiliza a
referência definida para o Math Plane.

Escopo desta entrega
Modelagem composta e cena 3D inicial. Os recursos de alternância de câmeras,
projeção perspectiva e fontes de luz ficam para a entrega 3.
Jogabilidade, menus, contas e progressão ficam para etapas posteriores.
