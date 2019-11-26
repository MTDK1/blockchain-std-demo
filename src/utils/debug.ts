export function logFactory(
  name: string = "DEBUG"
): (params: any, ...optionparams: any) => void {
  const debug = require("debug");
  return debug(name);
}
