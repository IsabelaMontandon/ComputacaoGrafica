/* Matrizes 4x4 em ordem de colunas, como esperado por uniformMatrix4fv.
   Modelagem, câmera e projeção perspectiva. */
(function(root) {
  'use strict';
  const identity = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
  function multiply(a,b) {
    const result = new Array(16).fill(0);
    for(let column=0;column<4;column++)
      for(let row=0;row<4;row++)
        for(let k=0;k<4;k++) result[column*4+row] += a[k*4+row]*b[column*4+k];
    return result;
  }
  function translation(x,y,z) { const m=identity();m[12]=x;m[13]=y;m[14]=z;return m; }
  const scaling=(x,y,z) => [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1];
  function rotationX(a) {const c=Math.cos(a),s=Math.sin(a);return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1];}
  function rotationY(a) {const c=Math.cos(a),s=Math.sin(a);return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1];}
  function rotationZ(a) {const c=Math.cos(a),s=Math.sin(a);return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1];}
  function compose(position,rotation,scale) {
    // M = T * Rz * Ry * Rx * S. A operação da direita é aplicada primeiro.
    return multiply(translation(...position),multiply(rotationZ(rotation[2]),
      multiply(rotationY(rotation[1]),multiply(rotationX(rotation[0]),scaling(...scale)))));
  }
  function orthographic(left,right,bottom,top,near,far) {
    return [2/(right-left),0,0,0, 0,2/(top-bottom),0,0, 0,0,-2/(far-near),0,
      -(right+left)/(right-left),-(top+bottom)/(top-bottom),-(far+near)/(far-near),1];
  }
  function perspective(fov,aspect,near,far) {
    const f=1/Math.tan(fov/2),r=1/(near-far);
    return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*r,-1, 0,0,2*far*near*r,0];
  }
  function lookAt(eye,target,up=[0,1,0]) {
    const sub=(a,b)=>a.map((v,i)=>v-b[i]);
    const norm=a=>{const n=Math.hypot(...a);return a.map(v=>v/n);};
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
    const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);
    return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
  }
  // Inversa transposta da parte linear de T*R*S, para normais com escala não uniforme.
  function normalMatrix(position,rotation,scale) {
    return compose([0,0,0],rotation,scale.map(v=>1/v));
  }
  const api={identity,multiply,translation,scaling,rotationX,rotationY,rotationZ,compose,orthographic,perspective,lookAt,normalMatrix};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.M4=api;
})(typeof window!=='undefined'?window:globalThis);
