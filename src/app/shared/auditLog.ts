import { User } from "./user";

export interface AuditLog {
    auditId: number;
    actor: string;
    actionPerformed: string;
    entityType: string;
    auditTimeStamp: Date;
    criticalData: string;
    userId: number;
  }