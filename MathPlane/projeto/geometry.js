/* Malhas locais geradas por código. Nenhum arquivo de modelo externo. */
(function (root) {
  'use strict';
  const M4 = typeof module!=='undefined'&&module.exports ? require('./m4.js') : root.M4;
  function box() {
    const vertices = [];
    const faces = [
      [[0,0,1],[1,0,1],[1,1,1],[0,1,1]],
      [[1,0,0],[0,0,0],[0,1,0],[1,1,0]],
      [[1,0,1],[1,0,0],[1,1,0],[1,1,1]],
      [[0,0,0],[0,0,1],[0,1,1],[0,1,0]],
      [[0,1,1],[1,1,1],[1,1,0],[0,1,0]],
      [[0,0,0],[1,0,0],[1,0,1],[0,0,1]]
    ];
    // Tons constantes por face: são cores do material, não fontes de luz.
    const tones = [0.94, 0.90, 0.96, 0.92, 1.0, 0.87];
    faces.forEach((face, i) => {
      for (const v of [face[0],face[1],face[2],face[0],face[2],face[3]]) {
        vertices.push({p:v.map(n => n - 0.5), tone:tones[i]});
      }
    });
    return vertices;
  }

  // Revolução em torno do eixo X. Cada par é [posição no eixo, raio].
  function lathe(profile, segments = 12) {
    const vertices = [];
    const tones = [1.0, 0.98, 0.95, 0.91, 0.89, 0.91, 0.95, 0.98];
    for (let k = 0; k < profile.length - 1; k++) {
      for (let j = 0; j < segments; j++) {
        const a = j * Math.PI * 2 / segments;
        const b = (j + 1) * Math.PI * 2 / segments;
        const point = (i,t) => [profile[i][0], Math.cos(t)*profile[i][1], Math.sin(t)*profile[i][1]];
        const tone = tones[j % tones.length];
        for (const p of [point(k,a),point(k+1,b),point(k+1,a),point(k,a),point(k,b),point(k+1,b)]) {
          vertices.push({p,tone});
        }
      }
    }
    return vertices;
  }

  function sphere(rows = 6, columns = 10) {
    const vertices = [];
    const point = (u,v) => [Math.sin(u)*Math.cos(v), Math.cos(u), Math.sin(u)*Math.sin(v)];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const a=i*Math.PI/rows, b=(i+1)*Math.PI/rows;
        const c=j*Math.PI*2/columns, d=(j+1)*Math.PI*2/columns;
        const tone=[1.0,0.96,0.91,0.95][j%4];
        for (const p of [point(a,c),point(b,d),point(b,c),point(a,c),point(a,d),point(b,d)]) vertices.push({p,tone});
      }
    }
    return vertices;
  }

  const meshes = {
    box: box(),
    cylinder: lathe([[-.5,0],[-.5,.5],[.5,.5],[.5,0]],12),
    sphere: sphere(),
    // Perfil afilado da cauda ao nariz, compatível com o avião de referência.
    fuselage: lathe([[-2.8,0],[-2.55,.21],[-1.4,.39],[.8,.52],[1.9,.39],[2.1,.25],[2.12,0]],10)
  };

  function transform(p, position, scale, rotation) {
    let [x,y,z] = p.map((v,i) => v*scale[i]);
    let c=Math.cos(rotation[0]),s=Math.sin(rotation[0]);
    [y,z]=[y*c-z*s,y*s+z*c];
    c=Math.cos(rotation[1]);s=Math.sin(rotation[1]);
    [x,z]=[x*c+z*s,-x*s+z*c];
    c=Math.cos(rotation[2]);s=Math.sin(rotation[2]);
    [x,y]=[x*c-y*s,x*s+y*c];
    return [x+position[0],y+position[1],z+position[2]];
  }

  class Model {
    constructor() { this.vertices=[]; this.parts=[]; }
    add(mesh, position, scale, hex, rotation=[0,0,0], name=mesh) {
      const color=[1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255);
      const first = this.vertices.length / 6;
      for (const vertex of meshes[mesh]) {
        this.vertices.push(...vertex.p,...color.map(v => v*vertex.tone));
      }
      // A geometria permanece local. A matriz de cada peça é aplicada no shader.
      const matrix = M4.compose(position, rotation, scale);
      this.parts.push({name,mesh,position,scale,rotation,matrix,first,
        count: this.vertices.length / 6 - first});
    }
  }
  const api={meshes,lathe,transform,Model};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.Geometry=api;
})(typeof window!=='undefined'?window:globalThis);
