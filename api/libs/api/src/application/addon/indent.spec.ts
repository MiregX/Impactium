import { BadRequestException } from '@nestjs/common';
import { IndentValidationPipe } from './indent.validator';

describe('IndentValidationPipe', () => {
  let pipe: IndentValidationPipe;

  beforeEach(() => {
    pipe = new IndentValidationPipe();
  });

  const runFail = (indent: string) => expect(() => pipe.transform(indent, { type: 'param', data: 'indent' })).toThrow(BadRequestException);
  const runSuccess = (indent: string) => expect(pipe.transform(indent, { type: 'param', data: 'indent' })).toEqual(indent);

  it('▲ Indent<x> throw new BadRequestException()', () => runFail('x'));
  it('▲ Indent<xx> throw new BadRequestException()', () => runFail('xx'));
  it('▲ Indent<-xx> throw new BadRequestException()', () => runFail('-xx'));
  it('▲ Indent<-xxx> throw new BadRequestException()', () => runFail('-xxx'));
  it('▲ Indent<--x> throw new BadRequestException()', () => runFail('--x'));
  it('▲ Indent<x--x> throw new BadRequestException()', () => runFail('x--x'));
  it('▲ Indent<x__x> throw new BadRequestException()', () => runFail('x__x'));
  it('▲ Indent<_x_x> throw new BadRequestException()', () => runFail('_x_x'));
  it('▲ Indent<x_x_> throw new BadRequestException()', () => runFail('x_x_'));
  it('▲ Indent<xxxxxxxxxxxxxxxxxxxxxxxxx> throw new BadRequestException()', () => runFail('xxxxxxxxxxxxxxxxxxxxxxxxx'));
  it('▲ Indent<@test> throw new BadRequestException()', () => runFail('@test'));
  it('▲ Indent<*test> throw new BadRequestException()', () => runFail('*test'));
  it('▲ Indent<te*st> throw new BadRequestException()', () => runFail('te*st'));

  it('▲ Indent<xxx> => PASS', () => runSuccess('xxx'));
  it('▲ Indent<x_x> => PASS', () => runSuccess('x_x'));
  it('▲ Indent<te8st> => PASS', () => runSuccess('te8st'));
  it('▲ Indent<xxxxxxxxxxxxxxxxxxxxxxxx> => PASS', () => runSuccess('xxxxxxxxxxxxxxxxxxxxxxxx'));
  it('▲ Indent<some-cool-id> => PASS', () => runSuccess('some-cool-id'));
});
