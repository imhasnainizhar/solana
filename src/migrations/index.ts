import * as migration_20261119_064207_initial from './20261119_064207_initial';
import * as migration_20261119_074043_storefront_blocks from './20261119_074043_storefront_blocks';
import * as migration_20261119_093241_theme_build_mode from './20261119_093241_theme_build_mode';
import * as migration_20261119_094352_passwordless_auth from './20261119_094352_passwordless_auth';

export const migrations = [
  {
    up: migration_20261119_064207_initial.up,
    down: migration_20261119_064207_initial.down,
    name: '20261119_064207_initial',
  },
  {
    up: migration_20261119_074043_storefront_blocks.up,
    down: migration_20261119_074043_storefront_blocks.down,
    name: '20261119_074043_storefront_blocks',
  },
  {
    up: migration_20261119_093241_theme_build_mode.up,
    down: migration_20261119_093241_theme_build_mode.down,
    name: '20261119_093241_theme_build_mode',
  },
  {
    up: migration_20261119_094352_passwordless_auth.up,
    down: migration_20261119_094352_passwordless_auth.down,
    name: '20261119_094352_passwordless_auth'
  },
];
