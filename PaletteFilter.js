var PIXI;

if(typeof require === 'function') {
  PIXI = require('pixi.js');
} else {
  PIXI = window.PIXI;
}

var PaletteFilter = function(palette) {
  var fragmentShader = null;

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

if(typeof module === 'undefined') {
  window.PaletteFilter = PaletteFilter;
} else {
  module.exports = PaletteFilter;
}
