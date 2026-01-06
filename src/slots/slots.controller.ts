import { Controller, Post, Get, Delete, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('slots')
@UseGuards(AuthGuard)
export class SlotsController {
  constructor(private slotsService: SlotsService) {}

  @Post()
  async create(@Request() req: any, @Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(req.user.id, createSlotDto);
  }

  @Get()
  async findAll(@Query('date') date: string) {
    return this.slotsService.findByDate(date);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.slotsService.delete(req.user.id, id);
  }
}
