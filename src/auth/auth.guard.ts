import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    const { data, error } = await this.supabase.client.auth.getUser(token);
    
    if (error || !data.user) {
      throw new UnauthorizedException(error?.message || 'Invalid token');
    }
    
    req.user = data.user;
    return true;
  }
}
