var PIXI;

if(typeof require === 'function') {
  PIXI = require('pixi.js');
} else {
  PIXI = window.PIXI;
}

var PaletteFilter = function(palette) {
  var fragmentShader = [
    'precision lowp float;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'uniform sampler2D uSampler;',

    'const int TOTAL_COLORS = ' + palette.length + ';',
    'uniform vec3 palette[' + palette.length + '];',

    'vec4 nearestColor(vec4 color) {',
    '  float bestDot = 0.0;',
    '  float currentDot = 0.0;',
    '  vec3 colorDelta = vec3(0.0, 0.0, 0.0);',
    '  vec3 nearest = vec3(0.0, 0.0, 0.0);',
    '  for(int i = 0; i < TOTAL_COLORS; i++) {',
    '    colorDelta = color.xyz - palette[i];',
    '    currentDot = dot(colorDelta, colorDelta);',
    '    if(currentDot > bestDot) {',
    '      bestDot = currentDot;',
    '      nearest = palette[i];',
    '    }',
    '  }',
    '  return vec4(nearest, color.w);',
    '}',

    'void main(void){',
    '   vec4 rawColor = texture2D(uSampler, vTextureCoord) * vColor ;',
    '   gl_FragColor = nearestColor(rawColor);',
    '}'
  ].join('\n');


  var uniforms = {
    palette: {
      type: 'v3v',
      value: palette.map(this._cssColorToVector) 
    }
  };

  PIXI.AbstractFilter.call(this, null, fragmentShader, uniforms);
};

PaletteFilter.prototype = Object.create(PIXI.AbstractFilter.prototype); 
PaletteFilter.prototype.constructor = PaletteFilter;
PaletteFilter.prototype._cssColorToVector = function(color) {
  return {
    x: parseInt(color.substring(1, 3), 16) / 256,
    y: parseInt(color.substring(3, 5), 16) / 256,
    z: parseInt(color.substring(5, 7), 16) / 256
  };
};

Object.defineProperties(PaletteFilter.prototype, {
  palette: {
    get: function() {
      return this.uniforms.palette.value;
    },
    set: function(palette) {
      this.uniforms.palette.value = palette.map(this._cssColorToVector);
    }
  }
});

// Some palettes to play with
PaletteFilter.ATARI_2600 = ['#000000', '#404040', '#6c6c6c', '#909090', '#b0b0b0', '#c8c8c8', '#dcdcdc', '#ececec', '#4f4f00', '#646410', '#848424', '#a0a034', '#b8b840', '#d0d050', '#e8e85c', '#fcfc68', '#702800', '#844414', '#985c28', '#ac783c', '#bc8c4c', '#cca05c', '#dcb468', '#ecc878', '#841800', '#983418', '#ac5030', '#c06848', '#d0805c', '#e09470', '#eca880', '#fcbc94', '#880000', '#9c2020', '#b03c3c', '#c05858', '#d07070', '#e08888', '#eca0a0', '#fcb4b4', '#78005c', '#8c2074', '#a03c88', '#b0589c', '#c070b0', '#d084c0', '#dc9cd0', '#ecb0e0', '#480078', '#602090', '#783ca4', '#8c58b8', '#a070cc', '#b484dc', '#c49cec', '#d4b0fc', '#140084', '#302098', '#4c3cac', '#6858c0', '#7c70d0', '#9488e0', '#a8a0ec', '#bcb4fc', '#000088', '#1c209c', '#3840b0', '#505cc0', '#6874d0', '#7c8ce0', '#90a4ec', '#a4b8fc', '#00187c', '#1c3890', '#3854a8', '#5070bc', '#6888cc', '#7c9cdc', '#90b4ec', '#a4c8fc', '#002c5c', '#1c4c78', '#386890', '#5084ac', '#689cc0', '#7cb4d4', '#90cce8', '#a4e0fc', '#003c2c', '#1c5c48', '#387c64', '#509c80', '#68b494', '#7cd0ac', '#90e4c0', '#a4fcd4', '#003c00', '#205c20', '#407c40', '#5c9c5c', '#74b474', '#8cd08c', '#a4e4a4', '#b8fcb8', '#143800', '#345c1c', '#507c38', '#6c9850', '#84b468', '#9ccc7c', '#b4e490', '#c8fca4', '#2c3000', '#4c501c', '#687034', '#848c4c', '#9ca864', '#b4c078', '#ccd488', '#e0ec9c', '#442800', '#644818', '#846830', '#a08444', '#b89c58', '#d0b46c', '#e8cc7c', '#fce08c'];
PaletteFilter.NES = ['#7c7c7c', '#0000fc', '#0000bc', '#4428bc', '#940084', '#a80020', '#a81000', '#881400', '#503000', '#007800', '#006800', '#005800', '#004058', '#000000', '#000000', '#000000', '#bcbcbc', '#0078f8', '#0058f8', '#6844fc', '#d800cc', '#e40058', '#f83800', '#e45c10', '#ac7c00', '#00b800', '#00a800', '#00a844', '#008888', '#000000', '#000000', '#000000', '#f8f8f8', '#3cbcfc', '#6888fc', '#9878f8', '#f878f8', '#f85898', '#f87858', '#fca044', '#f8b800', '#b8f818', '#58d854', '#58f898', '#00e8d8', '#787878', '#000000', '#000000', '#fcfcfc', '#a4e4fc', '#b8b8f8', '#d8b8f8', '#f8b8f8', '#f8a4c0', '#f0d0b0', '#fce0a8', '#f8d878', '#d8f878', '#b8f8b8', '#b8f8d8', '#00fcfc', '#d8d8d8', '#000000', '#000000'];

if(typeof module === 'undefined') {
  window.PaletteFilter = PaletteFilter;
} else {
  module.exports = PaletteFilter;
}
