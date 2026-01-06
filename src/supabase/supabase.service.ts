import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  public client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')?.trim();
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY')?.trim();
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is missing in environment variables');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }
}
