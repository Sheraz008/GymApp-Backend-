import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSlotDto {
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  date!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i, { message: 'Start time must be in HH:MM AM/PM format' })
  startTime!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i, { message: 'End time must be in HH:MM AM/PM format' })
  endTime!: string;
}
