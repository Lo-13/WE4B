import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivityLog, FileMetadata, NosqlService, UsageStat } from '../../core/services/nosql.service';

@Component({
    selector: 'app-admin-logs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-logs.component.html',
})
export class AdminLogsComponent implements OnInit {
    private readonly nosqlService = inject(NosqlService);

    activeTab = signal<'logs' | 'stats' | 'files'>('logs');
    logs = signal<ActivityLog[]>([]);
    stats = signal<UsageStat[]>([]);
    files = signal<FileMetadata[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.nosqlService.getActivityLogs().subscribe(data => this.logs.set(data));
        this.nosqlService.getUsageStats().subscribe(data => this.stats.set(data));
        this.nosqlService.getFileMetadata().subscribe({
            next: data => { this.files.set(data); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    setTab(tab: 'logs' | 'stats' | 'files') {
        this.activeTab.set(tab);
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleString('fr-FR');
    }

    formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} o`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
        return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
    }

    totalConsultations(): number {
        return this.stats()
            .filter(s => s.type === 'room_view')
            .reduce((acc, s) => acc + s.count, 0);
    }

    totalReservations(): number {
        return this.stats()
            .filter(s => s.type === 'reservation')
            .reduce((acc, s) => acc + s.count, 0);
    }
}