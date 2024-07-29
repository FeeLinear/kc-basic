function getThemeCluster(theme = '#3261FF') {
  const tintColor = (color, tint) => {
    color = color.replace("#", '');
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    if (tint === 0) {
      // when primary color is in its rgb space
      return [red, green, blue].join(",");
    } else {
      red += Math.round(tint * (255 - red));
      green += Math.round(tint * (255 - green));
      blue += Math.round(tint * (255 - blue));
      return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
    }
  };

  const shadeColor = (color, shade) => {
    color = color.replace("#", '');
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
  };

  const clusters = [theme];
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1));
  return clusters;
}

module.exports.getThemeCluster = getThemeCluster;
