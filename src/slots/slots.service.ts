import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateSlotDto } from './dto/create-slot.dto';

@Injectable()
export class SlotsService {
  constructor(private supabase: SupabaseService) {}

  private convertTo24h(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier.toUpperCase() === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString().padStart(2, '0');
    } else {
      hours = hours.padStart(2, '0');
    }

    return `${hours}:${minutes}:00`;
  }

  private convertTo12h(time24h: string): string {
    const [hours24, minutes] = time24h.split(':');
    let hours = parseInt(hours24, 10);
    const modifier = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
  }

  async create(userId: string, createSlotDto: CreateSlotDto) {
    const { date, startTime, endTime } = createSlotDto;
    
    const startTime24 = this.convertTo24h(startTime);
    const endTime24 = this.convertTo24h(endTime);

    const { data, error } = await this.supabase.client
      .from('slots')
      .insert({
        user_id: userId,
        date,
        start_time: startTime24,
        end_time: endTime24,
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      ...data,
      start_time: this.convertTo12h(data.start_time),
      end_time: this.convertTo12h(data.end_time),
    };
  }

  async findByDate(date: string) {
    const { data, error } = await this.supabase.client
      .from('slots')
      .select('*')
      .eq('date', date);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data.map(slot => ({
      ...slot,
      start_time: this.convertTo12h(slot.start_time),
      end_time: this.convertTo12h(slot.end_time),
    }));
  }

  async delete(userId: string, id: string) {
    const { error } = await this.supabase.client
      .from('slots')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true };
  }
}
