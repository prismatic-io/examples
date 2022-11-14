const colorOptions = [
  "dark-blue",
  "dark-brown",
  "dark-green",
  "dark-orange",
  "dark-pink",
  "dark-purple",
  "dark-red",
  "dark-teal",
  "dark-warm-gray",
  "light-blue",
  "light-green",
  "light-orange",
  "light-pink",
  "light-purple",
  "light-red",
  "light-teal",
  "light-warm-gray",
  "light-yellow",
];

export const colorInputOptions = colorOptions.map((color) => ({
  label: color,
  value: color,
}));
