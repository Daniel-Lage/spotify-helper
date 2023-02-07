const theme = (primary, secondary) => ({
  primary: primary,
  secondary: secondary,
  item: "hsl(0, 0%, 20%)",
  dark_item: "hsl(0, 0%, 15%)",
  background: "hsl(0, 0%, 10%)",
});

const themes = {
  cyan: theme("hsl(215, 50%, 50%)", "hsl(215, 50%, 30%)"),
  magenta: theme("hsl(335, 60%, 50%)", "hsl(335, 60%, 30%)"),
  green: theme("hsl(95, 50%, 50%)", "hsl(95, 50%, 30%)"),
  mono: theme("hsl(0, 0%, 40%)", "hsl(0, 0%, 30%)"),
};

export function getColors(theme, setTheme) {
  const theme_names = Object.keys(themes);
  if (!theme_names.includes(theme)) {
    theme = theme_names[0];
    setTheme(theme);
  }
  return themes[theme];
}

export function getThemes() {
  return Object.entries(themes);
}
