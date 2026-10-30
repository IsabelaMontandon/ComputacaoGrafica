/* Atividade 2: uma cena estática, uma vista ortográfica fixa e cores planas.
   Não implementa câmera alternável, perspectiva ou fontes de iluminação. */
'use strict';
(function(){
  const canvas=document.querySelector('#scene');
  // WebGL 2 acompanha os exemplos das aulas. WebGL 1 mantém compatibilidade.
  let gl=canvas.getContext('webgl2',{antialias:true});
  const webgl2=!!gl;
  if(!gl)gl=canvas.getContext('webgl',{antialias:true});
  const error=document.querySelector('#error');
  function fail(message){error.textContent=message;error.hidden=false;}
  if(!gl){fail('WebGL indisponível. Abra o projeto em um navegador com aceleração gráfica habilitada.');return;}

  function shader(type,source){
    const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));
    return s;
  }
  try {
    const program=gl.createProgram();
    const version=webgl2?'#version 300 es\n':'';
    const input=webgl2?'in':'attribute';
    gl.attachShader(program,shader(gl.VERTEX_SHADER,version+`
      ${input} vec3 position;
      ${input} vec3 color;
      uniform mat4 model;
      uniform mat4 orientation;
      uniform mat4 projection;
      ${webgl2?'out':'varying'} mediump vec3 surfaceColor;
      void main(){
        gl_Position=projection*orientation*model*vec4(position,1.0);
        surfaceColor=color;
      }`));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,version+`
      precision mediump float;
      ${webgl2?'in':'varying'} mediump vec3 surfaceColor;
      ${webgl2?'out vec4 fragmentColor;':''}
      void main(){${webgl2?'fragmentColor':'gl_FragColor'}=vec4(surfaceColor,1.0);}`));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const scene=new Geometry.Model();
    buildAirplane(scene);
    // A face superior da pista fica em y=-1.29, na altura inferior das rodas.
    scene.add('box',[0,-1.55,0],[22,.1,18],'#83aa65',[0,0,0],'chão');
    scene.add('box',[0,-1.39,0],[15,.2,4.5],'#859499',[0,0,0],'pista');
    for(let x=-6;x<=6;x+=3)scene.add('box',[x,-1.285,0],[1.25,.01,.07],'#f4edda',[0,0,0],'faixa da pista');

    function tree(x,z,size){
      const ground=-1.5;
      scene.add('cylinder',[x,ground+.65*size,z],[1.3*size,.22*size,.22*size],'#856445',[0,0,Math.PI/2],'tronco');
      scene.add('sphere',[x,ground+1.65*size,z],[.85*size,.95*size,.85*size],'#5f963f',[0,0,0],'copa');
    }
    tree(-5.4,-3,.9);
    tree(3.6,-3.9,.6);

    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(scene.vertices),gl.STATIC_DRAW);
    for(const[name,offset]of[['position',0],['color',12]]){
      const location=gl.getAttribLocation(program,name);
      gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,24,offset);
    }
    const projection=gl.getUniformLocation(program,'projection');
    const model=gl.getUniformLocation(program,'model');
    // Orientação constante da cena. Não há alternância ou controles de câmera.
    const orientation=M4.multiply(M4.rotationX(.4),M4.rotationY(-.67));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,'orientation'),false,new Float32Array(orientation));
    gl.enable(gl.DEPTH_TEST);

    function draw(){
      const dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.clearColor(.71,.87,.94,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      // Projeção ortográfica fixa: não existe redução de escala com a distância.
      const aspect=canvas.width/canvas.height;
      const height=Math.max(9.5,13/aspect),width=height*aspect;
      const left=-width/2,right=width/2,bottom=-height/2,top=height/2;
      const near=-40,far=40;
      const matrix=M4.orthographic(left,right,bottom,top,near,far);
      gl.uniformMatrix4fv(projection,false,new Float32Array(matrix));
      for(const part of scene.parts){
        gl.uniformMatrix4fv(model,false,new Float32Array(part.matrix));
        gl.drawArrays(gl.TRIANGLES,part.first,part.count);
      }
    }
    // Desenha ao abrir ou redimensionar. A cena não tem animação nem jogabilidade.
    draw();window.addEventListener('resize',draw);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('A cena WebGL foi interrompida. Recarregue a página.');});
  } catch(e){fail(e.message);}
})();
