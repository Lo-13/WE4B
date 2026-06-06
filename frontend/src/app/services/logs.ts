import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LogService {

    // Adresse du backend NestJS — c'est là qu'on envoie les logs
    private apiUrl = 'http://localhost:3000/logs';

    // HttpClient est l'outil Angular pour faire des requêtes HTTP
    // Il est injecté automatiquement par Angular grâce au constructeur
    constructor(private http: HttpClient) {}

    // Cette méthode s'appelle log()
    // Tu l'appelleras depuis n'importe quel composant comme ça :
    //   this.logService.log('LOGIN', { email: 'b@gamingrooms.fr' })
    //   this.logService.log('SALLE_VIEWED', { salleId: '5' })
    log(action: string, details: Record<string, any> = {}): void {

        // On récupère l'utilisateur actuellement connecté
        // Il est stocké dans le localStorage par votre AuthService
        const userRaw = localStorage.getItem('currentUser');
        const user = userRaw ? JSON.parse(userRaw) : null;

        // Si personne n'est connecté, on n'envoie rien
        if (!user) return;

        // On construit le message à envoyer au backend
        const payload = {
            userId:    user.id ?? user._id ?? 'inconnu',
            userEmail: user.email ?? 'inconnu',
            role:      user.role ?? 'client',
            action,   // ex: 'LOGIN'
            details,  // ex: { salleId: '5' }
        };


        this.http.post(this.apiUrl, payload).subscribe({
            error: (err) => console.warn('Erreur log (silencieuse) :', err)
        });
    }
}