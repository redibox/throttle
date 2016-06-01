import defaults from './defaults';
import scripts from './scripts';
import { BaseHook } from 'redibox';

export default class Throttle extends BaseHook {
  constructor() {
    super('throttle');
  }

  // noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
  /**
   * Default scripts for throttle
   */
  scripts() {
    return scripts;
  }

  // noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
  /**
   * Default config for scheduler
   * @returns {{someDefaultThing: string}}
   */
  defaults() {
    return defaults;
  }

}
