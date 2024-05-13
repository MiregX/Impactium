import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

const validatorMock = {
  Configuration: jest.fn(),
};

jest.mock(
  '@impactium/config',
  () => {
    const formMock = {
      particulars: {
        Configuration: jest.fn(() => validatorMock),
      },
    };
    return { form: formMock };
  },
  { virtual: true },
);

describe('ApplicationController', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  let controller: ApplicationController;
  let service: ApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [ApplicationService],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
    service = module.get<ApplicationService>(ApplicationService);
  });

  describe('ApplicationServise.info()', () => {
    it('Возвращает 200', async () => {
      jest.spyOn(service, 'info').mockImplementation(() => ({
        "status": 200,
        "environment": {
          "loaded": true,
          "path": "dev.env",
          "mode": "development",
          "message": "Environment loaded in developnemt mode"
        },
        "enforced_preloader": false,
        "localhost": "http://localhost:3001"
      }));
  
      const result = await controller.info();
  
      expect(result).toHaveProperty('status', 200);
    });
  });
});
