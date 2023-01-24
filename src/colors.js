const themes = {
  blue: {
    primary: "hsl(216, 60%, 60%)",
    secondary: "hsl(216, 60%, 35%)",
    background: "hsl(216, 10%, 10%)",
    active: "hsl(216, 60%, 25%)",
    inactive: "hsl(216, 60%, 60%)",
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
};

export default function Colors(theme) {
  if (!theme) {
    return themes["blue"];
  }
  return themes[theme];
}
