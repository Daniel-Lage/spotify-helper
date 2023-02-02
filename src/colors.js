const themes = {
  blue: {
    primary: "hsl(216, 60%, 60%)",
    secondary: "hsl(216, 60%, 35%)",
    background: "hsl(216, 10%, 10%)",
    active: "hsl(216, 60%, 25%)",
    inactive: "hsl(216, 40%, 50%)",
    btn_active: "hsl(216, 60%, 25%)",
    btn_inactive: "hsl(216, 60%, 35%)",
  },
  pink: {
    primary: "hsl(342, 60%, 60%)",
    secondary: "hsl(342, 60%, 35%)",
    background: "hsl(342, 10%, 10%)",
    active: "hsl(342, 60%, 25%)",
    inactive: "hsl(342, 60%, 60%)",
    btn_active: "hsl(342, 60%, 25%)",
    btn_inactive: "hsl(342, 60%, 35%)",
  },
  green: {
    primary: "hsl(126, 60%, 60%)",
    secondary: "hsl(126, 60%, 35%)",
    background: "hsl(126, 10%, 10%)",
    active: "hsl(126, 60%, 25%)",
    inactive: "hsl(126, 60%, 60%)",
    btn_active: "hsl(126, 60%, 25%)",
    btn_inactive: "hsl(126, 60%, 35%)",
  },
  light: {
    primary: "hsl(126, 0%, 100%)",
    secondary: "hsl(126, 0%, 35%)",
    background: "hsl(126, 0%, 10%)",
    active: "hsl(126, 0%, 25%)",
    inactive: "hsl(126, 0%, 60%)",
    btn_active: "hsl(126, 0%, 25%)",
    btn_inactive: "hsl(126, 0%, 35%)",
  },
  dark: {
    primary: "hsl(126, 0%, 25%)",
    secondary: "hsl(126, 0%, 12%)",
    background: "hsl(126, 0%, 0%)",
    active: "hsl(126, 0%, 15%)",
    inactive: "hsl(126, 0%, 25%)",
    btn_active: "hsl(126, 0%, 10%)",
    btn_inactive: "hsl(126, 0%, 12%)",
  },
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
