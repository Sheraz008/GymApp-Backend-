import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  async googleLogin(idToken: string) {
    const { data, error } = await this.supabase.client.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    
    if (error || !data.session) {
      throw new UnauthorizedException(error?.message || 'Authentication failed');
    }
    
    return { 
      access_token: data.session.access_token, 
      user: data.user 
    };
  }
}
