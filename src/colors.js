const theme = (primary, secondary, item, dark_item) => ({
  primary: primary,
  secondary: secondary,
  item: item,
  dark_item: dark_item,
});

const themes = {
  blue: theme(
    "hsl(216, 60%, 60%)",
    "hsl(216, 60%, 40%)",
    "hsl(216, 10%, 5%)",
    "hsl(216, 10%, 2%)"
  ),
  pink: theme(
    "hsl(342, 60%, 60%)",
    "hsl(342, 60%, 40%)",
    "hsl(342, 10%, 5%)",
    "hsl(342, 10%, 2%)"
  ),
  green: theme(
    "hsl(126, 60%, 60%)",
    "hsl(126, 60%, 40%)",
    "hsl(126, 10%, 5%)",
    "hsl(126, 10%, 2%)"
  ),
  mono: theme(
    "hsl(216, 0%, 40%)",
    "hsl(216, 0%, 20%)",
    "hsl(216, 0%, 5%)",
    "hsl(216, 0%, 2%)"
  ),
};

export function getColors(theme, setTheme) {
  if (!Object.keys(themes).includes(theme)) {
    console.log(theme);
    setTheme("blue");
    return themes["blue"];
  }
  return themes[theme];
}

export function getThemes() {
  return Object.entries(themes);
}
