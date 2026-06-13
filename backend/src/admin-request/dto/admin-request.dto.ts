export class AdminRequestDto {
    requestId !: number; 
    userId !: number;
    roomId !: number
    status !: 'pending' | 'accepted' | 'denied';
    createdDate !: Date;
}
