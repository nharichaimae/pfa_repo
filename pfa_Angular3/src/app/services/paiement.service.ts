import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaiementDTO {
  id: number;
  montant: number;
  datePaiement: string;
  statut: string;
  abonnementId: number;
}
@Injectable({
  providedIn: 'root'
})

export class PaiementService {

  private apiUrl = 'http://localhost:8080/api'; // Spring Boot

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer historique admin
  getHistorique(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/historique`);
  }
    private baseUrl = 'http://localhost:8080/api/clients';

  getHistoriqueClient(userId: number): Observable<PaiementDTO[]> {
    return this.http.get<PaiementDTO[]>(`${this.baseUrl}/${userId}/paiements`);
  }




}