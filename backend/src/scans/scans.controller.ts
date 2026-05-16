import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateScanDto } from './dto/create-scan.dto';
import { scanGuidance } from './scan-guidance';
import { ScansService } from './scans.service';

@Controller('scans')
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Get('guidance')
  guidance() {
    return scanGuidance;
  }

  @Get()
  findAll() {
    return this.scansService.findAll();
  }

  @Post()
  create(@Body() dto: CreateScanDto) {
    return this.scansService.create(dto);
  }
}
