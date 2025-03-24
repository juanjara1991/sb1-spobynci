export interface Ticket {
  prefix: string;
  number: number;
  arrivalTime: Date;
  isPreferential: boolean;
  module?: number;
  waitTime?: number;
  pharmacist?: string;
  endTime?: Date;
  totalTime?: number;
}

export interface Module {
  id: number;
  pharmacist: string;
  currentTicket: Ticket | null;
  lastActivityTime: Date;
}

export type UserRole = 'admin' | 'module';

export interface ModuleUser {
  rut: string;
  password: string;
  name: string;
  moduleId: number;
  role: UserRole;
}