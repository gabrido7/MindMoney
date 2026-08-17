const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

/** Cor determinística (mesma string sempre gera a mesma cor) para categorias/subcategorias novas. */
export const colorForLabel = (label: string): string => {
  const hue = hashString(label) % 360;
  return `hsl(${hue} 70% 55%)`;
};
