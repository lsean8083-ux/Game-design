export const ASSET_KEYS = Object.freeze({
  BACKGROUND: 'BACKGROUND',
  OBJECTS: 'OBJECTS',
  JAR: 'JAR',
});

export const IMAGE_ASSETS = [
  {
    assetKey: ASSET_KEYS.BACKGROUND,
    path: 'assets/images/background.png',
  },
  {
    assetKey: ASSET_KEYS.JAR,
    path: 'assets/images/jar.png',
  },
];

export const TEXTURE_ATLAS_ASSETS = [
  {
    assetKey: ASSET_KEYS.OBJECTS,
    textureURL: 'assets/images/spritesheet.png',
    atlasURL: 'assets/images/spritesheet.json',
  },
];
