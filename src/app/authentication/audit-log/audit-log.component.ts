import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { AuditLog } from 'src/app/shared/auditLog';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
  auditTrail: any[] = [];
  auditLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];  // New property for filtered logs
  searchQuery: string = '';

  constructor(private apiService: APIService) {}

  ngOnInit() {
    this.fetchAuditLogs();
  }

  fetchAuditLogs() {
    this.apiService.getAllAuditLogs().subscribe(
      (data: AuditLog[]) => {
        this.auditLogs = data;
        console.log(this.auditLogs);
      },
      (error) => {
        console.error('Error fetching audit logs:', error);
      }
    );
  }
  filterLogs() {
    this.filteredLogs = this.auditLogs.filter(log => {
      const actor = log.actor ? log.actor.toLowerCase() : '';
      const action = log.actionPerformed ? log.actionPerformed.toLowerCase() : '';
      const entity = log.entityType ? log.entityType.toLowerCase() : '';
      const criticalData = log.criticalData ? log.criticalData.toLowerCase() : '';
      const timestamp = log.auditTimeStamp ? log.auditTimeStamp.toLocaleString().toLowerCase() : '';
  
      return (
        actor.includes(this.searchQuery.toLowerCase()) ||
        action.includes(this.searchQuery.toLowerCase()) ||
        entity.includes(this.searchQuery.toLowerCase()) ||
        criticalData.includes(this.searchQuery.toLowerCase()) ||
        timestamp.includes(this.searchQuery.toLowerCase())
      );
    });
  }
  

}
