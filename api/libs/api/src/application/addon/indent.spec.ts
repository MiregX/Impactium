import { IndentValidationPipe } from './indent.validator';
import { IndentInvalidFormat } from './error';

describe('IndentValidationPipe', () => {
  let pipe: IndentValidationPipe;

  beforeEach(() => {
    pipe = new IndentValidationPipe();
  });

  const runFail = (indent: jest.DoneCallback) => expect(() => pipe.transform(indent, { type: 'param', data: 'indent' })).toThrow(IndentInvalidFormat);
  const runSuccess = (indent: jest.DoneCallback) => expect(pipe.transform(indent, { type: 'param', data: 'indent' })).toEqual(indent());

  it('x', runFail);
  it('xx', runFail);
  it('-xx', runFail);
  it('-xxx', runFail);
  it('--x', runFail);
  it('x--x', runFail);
  it('x__x', runFail);
  it('_x_x', runFail);
  it('x_x_', runFail);
  it('xxxxxxxxxxxxxxxxxxxxxxxxx', runFail);
  it('@test', runFail);
  it('*test', runFail);
  it('te*st', runFail);

  it('xxx', runSuccess);
  it('x_x', runSuccess);
  it('te8st', runSuccess);
  it('xxxxxxxxxxxxxxxxxxxxxxxx', runSuccess);
  it('some-cool-id', runSuccess);
});
