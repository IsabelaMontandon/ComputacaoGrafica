/* Matrizes 4x4 em ordem de colunas, como esperado por uniformMatrix4fv.
   Apenas transformações de modelagem e projeção ortográfica nesta entrega. */
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
  const api={identity,multiply,translation,scaling,rotationX,rotationY,rotationZ,compose,orthographic};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.M4=api;
})(typeof window!=='undefined'?window:globalThis);
