import { Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { Client, resources } from 'coinbase-commerce-node';

const { Charge } = resources;

@Injectable()
export class CoinbaseService {
  private client: unknown;

  constructor(
    private readonly prisma: PrismaService,
  ) {
    this.client = Client.init(process.env.COINBASE_API_KEY || '5ea8a85f-8674-48fa-90a0-72acb774a051');
    console.log(this.client);
  }

  async createCharge(amount: number, currency: string, description: string) {
    const chargeData = {
      name: 'Your Product Name',
      description,
      pricing_type: 'fixed_price' as unknown as any,
      local_price: {
        amount: amount.toString(),
        currency,
      },
    };

    return Charge.create(chargeData);
  }
}
