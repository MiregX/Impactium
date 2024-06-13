import { Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { Client, resources } from 'coinbase-commerce-node';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createCharge(amount: number, currency: string, description: string) {

    // const charge = await resources.Charge.create(chargeData);
    // return charge;
  }
}
