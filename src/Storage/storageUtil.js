export function save(id, value) {
  window.localStorage.setItem(id, JSON.stringify(value));
  return value;
}

export function load(id) {
  return JSON.parse(window.localStorage.getItem(id));
}

export function updateLocalStorage(state) {
  save("LOC", state.actions["LOC"].localStorage);
  save("NOK", state.actions["NOK"].localStorage);
  save("INTERN", state.actions["INTERN"].localStorage);
  save("INTERNMANAGER", state.actions["INTERNMANAGER"].localStorage);
}