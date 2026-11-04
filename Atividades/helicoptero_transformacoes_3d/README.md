# Helicóptero e transformações 3D

## Conteúdos da disciplina

O helicóptero é montado com malhas separadas para o corpo, a cauda e as hélices. Matrizes 4×4 aplicam a translação ao conjunto. A hélice principal gira em torno do eixo Y, e a traseira gira em torno do eixo Z, usando um pivô deslocado até o centro da peça. O WebGL usa teste de profundidade para determinar quais superfícies ficam visíveis. O desenho e as transformações são atualizados a cada quadro.

## Como testar

1. Abra [index.html](index.html) em um navegador com WebGL. As duas hélices devem começar a girar automaticamente.
2. Segure **↑/↓** para mover o helicóptero para cima ou para baixo e **←/→** para deslocá-lo horizontalmente.
3. Observe que todas as peças acompanham o deslocamento e as hélices continuam girando nos próprios eixos. Ao soltar as setas, o deslocamento para, mas a rotação das hélices continua.
