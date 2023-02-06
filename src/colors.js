const theme = (primary, secondary, item, dark_item) => ({
  primary: primary,
  secondary: secondary,
  item: item,
  dark_item: dark_item,
});

const themes = {
  cyan: theme(
    "hsl(215, 50%, 50%)",
    "hsl(215, 50%, 30%)",
    "hsl(0, 0%, 20%)",
    "hsl(0, 0%, 10%)"
  ),
  magenta: theme(
    "hsl(335, 60%, 50%)",
    "hsl(335, 60%, 30%)",
    "hsl(0, 0%, 20%)",
    "hsl(0, 0%, 10%)"
  ),
  green: theme(
    "hsl(95, 50%, 50%)",
    "hsl(95, 50%, 30%)",
    "hsl(0, 0%, 20%)",
    "hsl(0, 0%, 10%)"
  ),
  mono: theme(
    "hsl(0, 0%, 40%)",
    "hsl(0, 0%, 20%)",
    "hsl(0, 0%, 20%)",
    "hsl(0, 0%, 10%)"
  ),
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
