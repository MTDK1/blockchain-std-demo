const debug = require('debug')

export function logFactory(name: string) {
  if (!name || name.length === 0) {
    name = '[noname]';
  }
  return debug(name);
}