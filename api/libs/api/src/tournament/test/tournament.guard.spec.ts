import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TournamentExistanseGuard, TournamentGuard } from '../addon/tournament.guard';
import { TournamentService } from '../tournament.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { CodeInvalidFormat, CodeNotProvided } from '@api/main/application/addon/error';

jest.mock('@impactium/pattern', () => ({
  λLogger: {
    cyan: jest.fn((str: string) => str),
  },
  Identifier: {
    test: jest.fn(),
  },
}));


const { Identifier } = require('@impactium/pattern');

describe('Tournament Guards', () => {
  let tournamentExistanseGuard: TournamentExistanseGuard;
  let tournamentGuard: TournamentGuard;
  let tournamentServiceMock: Partial<TournamentService>;
  let authGuardMock: Partial<AuthGuard>;

  beforeEach(async () => {
    tournamentServiceMock = { find: jest.fn() };
    authGuardMock = { canActivate: jest.fn().mockResolvedValue(true) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentExistanseGuard,
        TournamentGuard,
        { provide: TournamentService, useValue: tournamentServiceMock },
        { provide: AuthGuard, useValue: authGuardMock },
      ],
    }).compile();

    tournamentExistanseGuard = module.get(TournamentExistanseGuard);
    tournamentGuard = module.get(TournamentGuard);
  });

  describe('TournamentExistanseGuard', () => {
    it('throws CodeNotProvided if no code in params', async () => {
      const context = createMockContext({ params: {} });
      await expect(tournamentExistanseGuard.canActivate(context)).rejects.toThrow(CodeNotProvided);
    });

    it('throws CodeInvalidFormat if code format is invalid', async () => {
      const context = createMockContext({ params: { code: 'bad-code -X-' } });
      Identifier.test.mockReturnValue(false);

      await expect(tournamentExistanseGuard.canActivate(context)).rejects.toThrow(CodeInvalidFormat);
    });

    it('sets tournament in request if valid code provided', async () => {
      const context = createMockContext({ params: { code: 'valid-code' } });
      Identifier.test.mockReturnValue(true);
      tournamentServiceMock.find = jest.fn().mockResolvedValue({ id: 1 });
      
      const result = await tournamentExistanseGuard.canActivate(context);
      expect(result).toBe(true);
      expect(context.switchToHttp().getRequest().tournament).toEqual({ id: 1 });
    });
  });

  describe('TournamentGuard', () => {
    it('runs tournamentExistanseGuard if request.tournament is not set', async () => {
      const context = createMockContext({ user: { uid: 'user1' } });
      jest.spyOn(tournamentExistanseGuard, 'canActivate').mockResolvedValue(true);

      await tournamentGuard.canActivate(context);
      expect(tournamentExistanseGuard.canActivate).toHaveBeenCalledWith(context);
    });

    it('runs authGuard if request.user is not set', async () => {
      const context = createMockContext({ tournament: { ownerId: 'user1' } });

      await tournamentGuard.canActivate(context);
      expect(authGuardMock.canActivate).toHaveBeenCalledWith(context);
    });

    it('returns true if user is owner of tournament', async () => {
      const context = createMockContext({ tournament: { ownerId: 'user1' }, user: { uid: 'user1' } });
      const result = await tournamentGuard.canActivate(context);
      expect(result).toBe(true);
    });

    it('returns false if user is not owner of tournament', async () => {
      const context = createMockContext({ tournament: { ownerId: 'user1' }, user: { uid: 'user2' } });
      const result = await tournamentGuard.canActivate(context);
      expect(result).toBe(false);
    });
  });
});

function createMockContext(requestData: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ ...requestData }),
    }),
  } as ExecutionContext;
}
