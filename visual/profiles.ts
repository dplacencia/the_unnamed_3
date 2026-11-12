// This Mac produced minor edge-pixel variation with GPU rendering enabled.
export const chromiumArgs = ["--disable-gpu"];

export const profiles = [
  {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
    theme: "light" as const,
  },
  {
    name: "tablet",
    viewport: { width: 768, height: 1024 },
    theme: "light" as const,
  },
  {
    name: "mobile",
    viewport: { width: 390, height: 844 },
    theme: "light" as const,
  },
  {
    name: "desktop-dark",
    viewport: { width: 1440, height: 900 },
    theme: "dark" as const,
  },
];

export const origins = {
  storybook: "http://localhost:6006",
  backoffice: "http://localhost:3100",
  landing: "http://localhost:4321",
  astroGallery: "http://localhost:4323",
};
