/* Atividade 3 — cena de voo: câmeras lateral/diagonal, perspectiva, sol e farol. */
'use strict';
(function(){
 const canvas=document.querySelector('#scene'),error=document.querySelector('#error');
 let gl=canvas.getContext('webgl2',{antialias:true});const webgl2=!!gl;
 if(!gl)gl=canvas.getContext('webgl',{antialias:true});
 const fail=m=>{error.hidden=false;error.textContent=m;};
 if(!gl){fail('WebGL indisponível. Use um navegador com aceleração gráfica habilitada.');return;}
 try {
 const version=webgl2?'#version 300 es\n':'',input=webgl2?'in':'attribute',varying=webgl2?'out':'varying';
 function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 const program=gl.createProgram();
 gl.attachShader(program,shader(gl.VERTEX_SHADER,version+`
 ${input} vec3 position; ${input} vec3 color; ${input} vec3 normal;
 uniform mat4 model,view,projection,normalMatrix;
 ${varying} mediump vec3 surfaceColor,worldPosition,worldNormal;
 void main(){
   vec4 world=model*vec4(position,1.0);
   worldPosition=world.xyz;worldNormal=mat3(normalMatrix)*normal;surfaceColor=color;
   // APLICAÇÃO DA PROJEÇÃO: mundo -> câmera -> coordenadas de recorte.
   gl_Position=projection*view*world;
 }`));
 gl.attachShader(program,shader(gl.FRAGMENT_SHADER,version+`
 precision mediump float;
 ${webgl2?'in':'varying'} mediump vec3 surfaceColor,worldPosition,worldNormal;
 uniform float sunEnabled,lampEnabled,nightMode,receivesHeadlight,emissive;
 uniform vec3 lampPosition;
 ${webgl2?'out vec4 fragmentColor;':''}
 void main(){
   vec3 n=normalize(worldNormal);
   // Fonte 1: sol direcional, com reflexão difusa de Lambert.
   float diffuseSun=max(dot(n,normalize(vec3(-0.4,1.0,0.7))),0.0);
   vec3 solar=sunEnabled*vec3(1.0,0.96,0.86)*0.85*diffuseSun;
   // Fonte 2: farol spot no nariz, apontando na direção +X do avião.
   vec3 delta=worldPosition-lampPosition;
   float distanceToLamp=length(delta);
   vec3 directionFromLamp=normalize(delta);
   float alignment=dot(directionFromLamp,vec3(1.0,0.0,0.0));
   // Borda suave: cone externo 46 graus, interno 34 graus.
   float cone=smoothstep(0.6947,0.8290,alignment);
   float attenuation=1.0/(1.0+0.015*distanceToLamp+0.004*distanceToLamp*distanceToLamp);
   float diffuseLamp=max(dot(n,-directionFromLamp),0.0);
   vec3 headlight=lampEnabled*receivesHeadlight*vec3(1.0,0.93,0.68)*2.3*cone*attenuation*diffuseLamp;
   // Receptores do farol: apenas os seis balões. A cena não usa sombras projetadas.
   vec3 ambient=mix(vec3(0.32,0.34,0.38),vec3(0.18,0.20,0.28),nightMode);
   vec3 result=surfaceColor*(ambient+solar+headlight)+surfaceColor*emissive;
   ${webgl2?'fragmentColor':'gl_FragColor'}=vec4(result,1.0);
 }`));
 gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const scene=new Geometry.Model();buildAirplane(scene);
 // O avião fica em y=0; o terreno está seis unidades abaixo.
 const ground=-6;
 scene.add('box',[4,ground-.16,-8],[80,.3,64],'#7eaf68',[0,0,0],'chão');
 scene.add('box',[4,ground+.01,0],[60,.12,3.6],'#6e7e88',[0,0,0],'pista');
 for(let x=-23;x<=31;x+=4)scene.add('box',[x,ground+.075,0],[1.9,.015,.12],'#f5efdf',[0,0,0],'faixa da pista');
 // Cones e pequenas esferas mantêm a construção simples e feita por primitivas.
 Geometry.meshes.cone=Geometry.lathe([[-.5,0],[-.5,1],[.5,0]],6);
 function tree(x,z,size){
  scene.add('cylinder',[x,ground+.65*size,z],[1.3*size,.22*size,.22*size],'#8c6743',[0,0,Math.PI/2],'tronco');
  scene.add('cone',[x,ground+1.8*size,z],[2.4*size,.8*size,.8*size],'#3d854f',[0,0,Math.PI/2],'copa');
 }
 for(const [x,z,s]of [[-7,-7,1.2],[-1,-10,.8],[5,-9,1.1],[14,-7,1.0],[21,-12,1.2],[-12,6,.8],[13,7,.7]])tree(x,z,s);
 for(const [x,z,h,r,color]of [[-13,-25,12,14,'#639687'],[4,-29,15,18,'#719f9a'],[23,-28,11,14,'#729ba6']])
  scene.add('cone',[x,ground+h/2,z],[h,r,r],color,[0,0,Math.PI/2],'montanha');
 // Duas fileiras: em cada uma, um balão à frente, um acima e um abaixo.
 // Mesma escala no mundo: na vista diagonal, a segunda fileira parece menor.
 for(const x of [6,10])for(const y of [-2.3,0,2.3]){
  scene.add('sphere',[x,y,0],[.57,.76,.57],'#ffd14a',[0,0,0],'balão');
  scene.add('cone',[x,y-.81,0],[.17,.13,.13],'#dfad31',[0,0,Math.PI/2],'nó do balão');
 }
 const lampPosition=[2.56,0,0];
 scene.add('cylinder',[2.5,0,0],[.13,.28,.28],'#ffe9ae',[0,0,0],'lente do farol');
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(scene.vertices),gl.STATIC_DRAW);
 for(const[name,offset]of[['position',0],['color',12],['normal',24]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,36,offset);}
 const uniforms={};for(const name of ['model','view','projection','normalMatrix','sunEnabled','lampEnabled','lampPosition','nightMode','receivesHeadlight','emissive'])uniforms[name]=gl.getUniformLocation(program,name);
 gl.uniform3fv(uniforms.lampPosition,new Float32Array(lampPosition));gl.enable(gl.DEPTH_TEST);
 const cameras=[
  {name:'Lateral',eye:[3.7,1.4,15.5],target:[3.7,-.3,0]},
  {name:'Diagonal',eye:[-9,4.5,11.5],target:[3.7,-.2,0]}
 ];
 let camera=0,night=false,sun=true,lamp=false;
 const cameraButton=document.querySelector('#camera'),modeButton=document.querySelector('#mode');
 function sync(){
  cameraButton.textContent='Câmera: '+cameras[camera].name;
  modeButton.textContent=night?'Modo: Noite':'Modo: Dia';modeButton.setAttribute('aria-pressed',String(night));


 }
 function draw(){
  const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);
  if(night)gl.clearColor(.025,.045,.105,1);else gl.clearColor(.40,.70,.94,1);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  // DEFINIÇÃO DA PERSPECTIVA: FOV vertical base de 48 graus, ampliado em telas estreitas.
  // Mantém avião e seis balões enquadrados ao redimensionar.
  const aspect=canvas.width/canvas.height;
  const fov=2*Math.atan(Math.tan(48*Math.PI/360)*Math.max(1,1.6/aspect));
  const projection=M4.perspective(fov,aspect,.1,180);
  gl.uniformMatrix4fv(uniforms.projection,false,new Float32Array(projection));
  gl.uniformMatrix4fv(uniforms.view,false,new Float32Array(M4.lookAt(cameras[camera].eye,cameras[camera].target)));
  gl.uniform1f(uniforms.sunEnabled,sun?1:0);gl.uniform1f(uniforms.lampEnabled,lamp?1:0);gl.uniform1f(uniforms.nightMode,night?1:0);
  for(const part of scene.parts){
   const balloon=part.name==='balão'||part.name==='nó do balão';
   gl.uniform1f(uniforms.receivesHeadlight,balloon?1:0);
   gl.uniform1f(uniforms.emissive,part.name==='lente do farol'&&lamp?1:0);
   gl.uniformMatrix4fv(uniforms.model,false,new Float32Array(part.matrix));gl.uniformMatrix4fv(uniforms.normalMatrix,false,new Float32Array(part.normalMatrix));gl.drawArrays(gl.TRIANGLES,part.first,part.count);
  }
  sync();
 }
 function toggleMode(){night=!night;sun=!night;lamp=night;}
 cameraButton.addEventListener('click',()=>{camera=1-camera;draw();});
 modeButton.addEventListener('click',()=>{toggleMode();draw();});

 window.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(k==='1')camera=0;else if(k==='2')camera=1;else if(k==='n')toggleMode();else return;draw();});
 window.addEventListener('resize',draw);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('Contexto gráfico interrompido. Recarregue a página.');});draw();
 }catch(e){fail(e.message);}
})();
