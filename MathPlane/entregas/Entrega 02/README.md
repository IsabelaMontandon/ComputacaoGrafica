# Math Plane

**Atividade 2 — Modelagem 3D e construção inicial da cena**

Computação Gráfica

## Integrantes do grupo

- Enzo Ascaneo
- Isabela Montandon Bustamante

Apresentamos a modelagem inicial do avião do Math Plane em uma cena tridimensional simples. Nesta etapa, o foco está na construção do modelo e na organização dos objetos no espaço.

## Modelagem e origem

O avião reúne 18 peças e 900 triângulos. A fuselagem é uma malha de revolução construída a partir de um perfil com raios diferentes. As asas, a cauda, a hélice e os suportes usam caixas. A cabine usa uma malha esférica alongada, e o nariz e as rodas usam cilindros. Assim, o personagem resulta da combinação de várias peças, e não de uma única primitiva.

Utilizamos o ChatGPT como apoio na concepção dos gráficos, na construção do avião e no código. O modelo é gerado diretamente no código, combinando malhas e primitivas geométricas, sem importar arquivos de modelos 3D externos. O visual segue a referência definida para o Math Plane.

## Tecnologia e construção da cena

Utilizamos WebGL puro, JavaScript, HTML e CSS. O programa prioriza WebGL 2 e possui compatibilidade com WebGL 1. O cenário contém chão, uma pista com marcações e duas árvores. O avião acompanha a direção da pista, e as três rodas alcançam sua face superior. Cada peça recebe posição, escala e rotação por uma matriz de modelagem.

A apresentação usa uma única vista ortográfica fixa e cores por face. A cena permanece parada. Alternância de câmeras, projeção perspectiva e fontes de luz serão desenvolvidas na entrega 3.

## Trecho da construção do avião

Em `airplane.js`, as chamadas abaixo montam a fuselagem, a cabine e as asas. As malhas são definidas em `geometry.js` e suas transformações em `m4.js`.

```javascript
model.add('fuselage',[0,0,0],[1,1,1],body,[0,0,0],'fuselagem');
model.add('sphere',[.45,.45,0],[.73,.49,.43],'#278cce',[0,0,0],'cabine');
for (const z of [-1,1]) {
    model.add('box',[-.22,-.13,z*1.8],[1.28,.13,2.86],wing,[0,0,0],'asa');
}
```

## Dificuldades e o que falta implementar

Os principais ajustes foram definir as proporções do avião, unir visualmente suas partes e alinhar as rodas à pista. A geometria foi mantida simples para facilitar sua compreensão e evolução. Ainda faltam os sistemas de visualização e iluminação da entrega 3 e, nas etapas seguintes, a jogabilidade e as operações matemáticas.

## Demonstração do modelo e da cena

As imagens mostram a cena entregue e um detalhe do mesmo enquadramento. O recorte do avião não corresponde a uma segunda câmera.

[Abrir a pasta de demonstração e ver o avião](demonstracao/)

- **Figura 1:** cena inicial com o avião sobre a pista, chão e duas árvores.
- **Figura 2:** recorte da mesma imagem destacando as peças do avião.
