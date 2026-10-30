/* Avião composto da atividade 2,
   Apoio do ChatGPT na concepção dos gráficos e construção da geometria. */
(function(root){
  'use strict';
  function buildAirplane(model) {
    const body='#fff0cf', wing='#e97662', dark='#27383d';
    // Corpo e cabine são malhas tridimensionais separadas.
    model.add('fuselage',[0,0,0],[1,1,1],body,[0,0,0],'fuselagem');
    model.add('sphere',[.45,.45,0],[.73,.49,.43],'#278cce',[0,0,0],'cabine');
    for (const z of [-1,1]) {
      model.add('box',[-.22,-.13,z*1.8],[1.28,.13,2.86],wing,[0,0,0],'asa');
      model.add('box',[-2.12,.04,z*.68],[.74,.11,1.38],wing,[0,0,0],'cauda horizontal');
    }
    model.add('box',[-2.28,.59,0],[.79,1.14,.12],wing,[0,0,-.2],'cauda vertical');
    model.add('cylinder',[2.17,0,0],[.33,.54,.54],'#344348',[0,0,0],'nariz');
    model.add('box',[2.37,0,0],[.10,1.94,.14],dark,[0,0,0],'hélice parada');
    model.add('sphere',[2.45,0,0],[.14,.14,.14],dark,[0,0,0],'cubo da hélice');
    for (const z of [-.65,.65]) {
      model.add('box',[.61,-.65,z],[.10,.68,.10],'#6c7679',[0,0,0],'suporte da roda');
      model.add('cylinder',[.61,-.99,z],[.30,.60,.60],dark,[0,Math.PI/2,0],'roda principal');
      model.add('cylinder',[.61,-.99,z*1.04],[.32,.26,.26],'#7a939c',[0,Math.PI/2,0],'centro da roda');
    }
    model.add('box',[-2.05,-.66,0],[.10,.8,.10],'#6c7679',[0,0,0],'suporte traseiro');
    model.add('cylinder',[-2.05,-1.13,0],[.18,.32,.32],dark,[0,Math.PI/2,0],'roda traseira');
  }
  if(typeof module!=='undefined'&&module.exports)module.exports=buildAirplane;
  else root.buildAirplane=buildAirplane;
})(typeof window!=='undefined'?window:globalThis);
