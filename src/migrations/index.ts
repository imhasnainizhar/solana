import * as migration_20261119_064207_initial from './20261119_064207_initial';
import * as migration_20261119_074043_storefront_blocks from './20261119_074043_storefront_blocks';

export const migrations = [
  {
    up: migration_20261119_064207_initial.up,
    down: migration_20261119_064207_initial.down,
    name: '20261119_064207_initial',
  },
  {
    up: migration_20261119_074043_storefront_blocks.up,
    down: migration_20261119_074043_storefront_blocks.down,
    name: '20261119_074043_storefront_blocks'
  },
];
