import { injectable, decorate } from 'inversify';

const EventEmitter = require('events');
const define = Object.defineProperty;

@injectable()
export class Operation extends EventEmitter {
  outputs : any;

  setOutputs(outputs : string[]) {
    this.outputs = outputs.reduce((obj, output) => {
        obj[output] = output;
        return obj;
      }, Object.create(null));
  }

  on(output : string, handler: (...args : any[]) => void) : any {
    if (this.outputs[output]) {
      return this.addListener(output, handler);
    }
    throw new Error(`Invalid output "${ output }" to operation ${this.constructor.name}.`);
  }
}

decorate(injectable(), EventEmitter);