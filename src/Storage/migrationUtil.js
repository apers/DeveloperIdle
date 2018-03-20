import {load, save} from "./storageUtil";

export const CURRENT_VERSION = 0;

export function migrate() {
  const version = load("version");
  migrate_to_1(version);
  migrate_to_2(version);
}

function migrate_to_1(version) {
  if(version === 0) {
    /*let internState = load("INTERN");
    internState.value.production = 5;
    save("INTERN", internState);
    save("version", 1);*/
  }
}

function migrate_to_2(version) {
  if(version === 1) {
  }
}