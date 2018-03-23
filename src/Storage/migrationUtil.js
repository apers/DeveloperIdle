import {load, save} from "./storageUtil";

export const CURRENT_VERSION = 1;

export function migrate() {
  const version = load("version");
  if(version != CURRENT_VERSION) {
    save("version", CURRENT_VERSION);
    localStorage.clear();
  }

  migrate_to_1(version);
  migrate_to_2(version);
}

function migrate_to_1(version) {
  if(version === 0) {
  }
}

function migrate_to_2(version) {
  if(version === 1) {
  }
}