const theme = (primary, secondary, accents) => ({
  primary: primary,
  secondary: secondary,
  accents: accents,
  item: "hsl(0, 0%, 20%)",
  dark_item: "hsl(0, 0%, 15%)",
  background: "hsl(0, 0%, 10%)",
});

const themes = {
  blue: theme("hsl(215, 80%, 60%)", "hsl(215, 60%, 40%)", "hsl(215, 50%, 80%)"),
  pink: theme("hsl(335, 80%, 60%)", "hsl(335, 60%, 40%)", "hsl(335, 50%, 80%)"),
  lime: theme("hsl(95, 80%, 60%)", "hsl(95, 60%, 40%)", "hsl(95, 50%, 80%)"),
  mono: theme("hsl(0, 0%, 40%)", "hsl(0, 0%, 30%)", "hsl(0, 0%, 90%)"),
};

export function getColors(theme) {
  return themes[theme];
}

export function getThemes() {
  return Object.entries(themes);
}
