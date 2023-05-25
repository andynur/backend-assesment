import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrescriptionDetailsModule } from 'src/prescription-details/prescription-details.module';
import { ProductsModule } from 'src/products/products.module';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';

@Module({
  imports: [AuthModule, PrescriptionDetailsModule, ProductsModule],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
})
export class PrescriptionsModule {}
