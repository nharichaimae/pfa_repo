import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegleService } from '../../services/regle.service';
import { Regle } from '../../Models/models';

@Component({
  selector: 'app-regle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './regle-form.component.html',
  styleUrls: ['./regle-form.component.css']
})
export class RegleFormComponent implements OnInit, OnDestroy {
  idEquipement = 0;
  nomEquipement = '';
  typeEquipement = '';

  dateRegle: string | null = new Date().toISOString().split('T')[0];
  heureDebut = '08:00';
  heureFin = '22:00';

  chaqueJour = false;

  regles: Regle[] = [];
  loading = false;
  loadingRegles = false;
  success = '';
  error = '';

  currentTime = '';
  currentDate = '';
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private regleService: RegleService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const rawId = String(params['id'] ?? '').replace(/\D.*/, '');
      this.idEquipement = parseInt(rawId, 10);

      console.log('Params reçus:', params);
      console.log('ID nettoyé:', this.idEquipement);

      if (!this.idEquipement || isNaN(this.idEquipement) || this.idEquipement <= 0) {
        console.error('ID équipement invalide !');
        this.error = 'Équipement introuvable, redirection...';
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        return;
      }

      this.nomEquipement = params['nom'] || '';
      this.typeEquipement = params['type'] || '';
      this.loadRegles();
    });

    this.startClock();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  startClock(): void {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    this.currentDate = now.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  loadRegles(): void {
    if (!this.idEquipement || this.idEquipement <= 0) return;
    this.loadingRegles = true;
    this.regleService.getByEquipement(this.idEquipement).subscribe({
      next: (data) => { this.regles = data; this.loadingRegles = false; },
      error: (err) => { console.error('Erreur chargement règles:', err); this.loadingRegles = false; }
    });
  }

  onChaqueJourChange(): void {
    this.dateRegle = this.chaqueJour ? null : new Date().toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (!this.heureDebut || !this.heureFin) {
      this.error = 'Veuillez remplir tous les champs'; return;
    }
    if (!this.chaqueJour && !this.dateRegle) {
      this.error = 'Veuillez sélectionner une date'; return;
    }
    if (!this.idEquipement || this.idEquipement <= 0) {
      this.error = 'Équipement invalide'; return;
    }
    if (this.heureDebut >= this.heureFin) {
      this.error = 'L\'heure de fin doit être après l\'heure de début'; return;
    }

    this.loading = true;
    this.success = '';
    this.error   = '';

    const payload = {
      dateRegle:    this.chaqueJour ? null : this.dateRegle, // ✅ null au lieu de 'chaque_jour'
      heureDebut:   this.heureDebut,
      heureFin:     this.heureFin,
      idEquipement: this.idEquipement,
      chaqueJour:   this.chaqueJour
    };

    console.log('Payload envoyé à l\'API:', payload);

    this.regleService.create(payload).subscribe({
      next: (regle) => {
        console.log('Règle créée:', regle);
        this.success = this.chaqueJour
          ? `✅ Règle répétée chaque jour de ${this.heureDebut} à ${this.heureFin} !`
          : `✅ Règle planifiée le ${this.dateRegle} de ${this.heureDebut} à ${this.heureFin} !`;
        this.loading = false;
        this.chaqueJour = false;
        this.dateRegle = new Date().toISOString().split('T')[0];
        this.loadRegles();
      },
      error: (err) => {
        console.error('Erreur création règle:', err);
        this.error = 'Erreur lors de la création de la règle';
        this.loading = false;
      }
    });
  }

  deleteRegle(id: number): void {
    if (!confirm('Supprimer cette règle ?')) return;
    this.regleService.delete(id).subscribe({
      next:  () => { this.regles = this.regles.filter(r => r.idRegle !== id); },
      error: () => { this.error = 'Erreur lors de la suppression'; }
    });
  }

  getIcon(): string {
    const t = this.typeEquipement.toLowerCase();
    if (t === 'lampe')      return '💡';
    if (t === 'clime')      return '❄️';
    if (t === 'chauffage')  return '🔥';
    if (t === 'television') return '📺';
    return '🔌';
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Chaque jour';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}