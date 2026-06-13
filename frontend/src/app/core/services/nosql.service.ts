import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface ActivityLog {
    _id: string;
    userId?: number;
    email?: string;
    action: string;
    targetType: string;
    targetId?: number;
    metadata: Record<string, unknown>;
    createdAt: string;
}

export interface UsageStat {
    _id: string;
    type: string;
    roomId?: number;
    roomName?: string;
    count: number;
    date: string;
}

export interface FileMetadata {
    _id: string;
    fileName: string;
    mimeType: string;
    size: number;
    uploadedBy?: number;
    linkedEntity?: string;
    linkedEntityId?: number;
    createdAt: string;
}

export interface CreateFileMetadataPayload {
    fileName: string;
    mimeType: string;
    size: number;
    uploadedBy?: number;
    linkedEntity?: string;
    linkedEntityId?: number;
}

@Injectable({ providedIn: 'root' })
export class NosqlService {
    private readonly http = inject(HttpClient);

    getActivityLogs(): Observable<ActivityLog[]> {
        return this.http.get<ActivityLog[]>(`${API_BASE_URL}/nosql/logs`);
    }

    getUsageStats(): Observable<UsageStat[]> {
        return this.http.get<UsageStat[]>(`${API_BASE_URL}/nosql/stats`);
    }

    getFileMetadata(): Observable<FileMetadata[]> {
        return this.http.get<FileMetadata[]>(`${API_BASE_URL}/nosql/files`);
    }

    createFileMetadata(payload: CreateFileMetadataPayload): Observable<FileMetadata> {
        return this.http.post<FileMetadata>(`${API_BASE_URL}/nosql/files`, payload);
    }
}