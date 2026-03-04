import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaiementService } from '../services/paiement.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],   
  templateUrl: './historique-paiement.html',
  styleUrls: ['./historique-paiement.scss']
})
export class HistoriqueComponent implements OnInit {

  historique: any;

  constructor(private paiementService: PaiementService ,private cd: ChangeDetectorRef) {}

ngOnInit(): void {
  this.paiementService.getHistorique().subscribe({
    next: (data) => {
      this.historique = data;
      this.cd.detectChanges();   
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}