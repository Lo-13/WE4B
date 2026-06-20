import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ActivityLog, FileMetadata, NosqlService, UsageStat } from '../../core/services/nosql.service';

Chart.register(...registerables);

@Component({
    selector: 'app-admin-logs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-logs.component.html',
})
export class AdminLogsComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly nosqlService = inject(NosqlService);

    @ViewChild('viewsChart') viewsChartRef?: ElementRef<HTMLCanvasElement>;
    @ViewChild('reservationsChart') reservationsChartRef?: ElementRef<HTMLCanvasElement>;

    activeTab = signal<'logs' | 'stats' | 'files'>('logs');
    logs = signal<ActivityLog[]>([]);
    stats = signal<UsageStat[]>([]);
    files = signal<FileMetadata[]>([]);
    loading = signal(true);
    private viewsChart?: Chart;
    private reservationsChart?: Chart;

    ngOnInit() {
        this.nosqlService.getActivityLogs().subscribe(data => this.logs.set(data));
        this.nosqlService.getUsageStats().subscribe(data => {
            this.stats.set(data);
            queueMicrotask(() => this.renderCharts());
        });
        this.nosqlService.getFileMetadata().subscribe({
            next: data => { this.files.set(data); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    ngAfterViewInit() {
        this.renderCharts();
    }

    ngOnDestroy() {
        this.viewsChart?.destroy();
        this.reservationsChart?.destroy();
    }

    setTab(tab: 'logs' | 'stats' | 'files') {
        this.activeTab.set(tab);

        if (tab === 'stats') {
            setTimeout(() => this.renderCharts());
        }
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
            .filter(s => s.type === 'reservation_created')
            .reduce((acc, s) => acc + s.count, 0);
    }

    private renderCharts(): void {
        if (!this.viewsChartRef || !this.reservationsChartRef || this.stats().length === 0) {
            return;
        }

        this.viewsChart?.destroy();
        this.reservationsChart?.destroy();

        this.viewsChart = new Chart(
            this.viewsChartRef.nativeElement,
            this.createBarConfig('Consultations par salle', this.groupStatsByRoom('room_view'), '#67e8f9'),
        );

        this.reservationsChart = new Chart(
            this.reservationsChartRef.nativeElement,
            this.createBarConfig('Réservations par salle', this.groupStatsByRoom('reservation_created'), '#86efac'),
        );
    }

    private groupStatsByRoom(type: string): { labels: string[]; values: number[] } {
        const grouped = new Map<string, number>();

        this.stats()
            .filter(stat => stat.type === type)
            .forEach(stat => {
                const fallbackLabel = `Salle ${stat.roomId ?? ''}`.trim();
                const label = stat.roomName ?? (fallbackLabel || type);
                grouped.set(label, (grouped.get(label) ?? 0) + stat.count);
            });

        const sorted = [...grouped.entries()]
            .sort((first, second) => second[1] - first[1])
            .slice(0, 6);

        return {
            labels: sorted.map(([label]) => label),
            values: sorted.map(([, value]) => value),
        };
    }

    private createBarConfig(title: string, data: { labels: string[]; values: number[] }, color: string): ChartConfiguration<'bar'> {
        return {
            type: 'bar',
            data: {
                labels: data.labels.length > 0 ? data.labels : ['Aucune donnée'],
                datasets: [
                    {
                        label: title,
                        data: data.values.length > 0 ? data.values : [0],
                        backgroundColor: color,
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: title,
                        color: '#e2e8f0',
                        font: { size: 14, weight: 'bold' },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: '#cbd5e1' },
                        grid: { color: 'rgba(148, 163, 184, 0.15)' },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#cbd5e1', precision: 0 },
                        grid: { color: 'rgba(148, 163, 184, 0.15)' },
                    },
                },
            },
        };
    }
}
