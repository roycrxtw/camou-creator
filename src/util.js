
/**
 * CamouCreator - Utilities
 * @author Roy Lu(royvbtw)
 */

function parseHexToRGB(hex){
  hex = hex.substring(1);
  const rgb = [0, 0, 0];
  for(let i = 0; i < 3; i++){
    let color = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    rgb[i] = color;
  }
  return rgb;
}

function getRGBString(rgb){
  return 'rgb(' + rgb.join(', ') + ')';
}

export {parseHexToRGB, getRGBString};

