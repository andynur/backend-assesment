import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { PrescriptionDetailsController } from './prescription-details.controller';
import { PrescriptionDetailsService } from './prescription-details.service';

@Module({
  imports: [ProductsModule],
  controllers: [PrescriptionDetailsController],
  providers: [PrescriptionDetailsService],
  exports: [PrescriptionDetailsService],
})
export class PrescriptionDetailsModule {}
