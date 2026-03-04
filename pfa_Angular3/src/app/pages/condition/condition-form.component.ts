import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConditionService } from '../../services/condition.service';
import { RegleService } from '../../services/regle.service';
import { Condition, Regle } from '../../Models/models';

@Component({
  selector: 'app-condition-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './condition-form.component.html',
  styleUrls: ['./condition-form.component.css']
})
export class ConditionFormComponent implements OnInit, OnDestroy {

   //  infos équipement (reçues depuis l’URL)
  idEquipement = 0;
  nomEquipement = '';
  typeEquipement = '';
//  gestion du type de valeur (ON/OFF ou nombre) 
  isOnOff = false;
  isNombre = false;
  valeurOnOff = 'ON';
  valeurNombre = 20;
  minTemp = 16;
  maxTemp = 30;
  //Historique des conditions 
  historique: Condition[] = [];
  loadingCondition = false;
  loadingHistorique = false;
  successCondition = '';
  errorCondition = '';
// formulaire des regles
  dateRegle: string | null = new Date().toISOString().split('T')[0];
  heureDebut = '08:00';
  heureFin = '22:00';
  regles: Regle[] = [];
  loadingRegle = false;
  loadingRegles = false;
  successRegle = '';
  errorRegle = '';

  chaqueJour = false;

  jours = [
    { label: 'Lun', value: 'lundi',    checked: false },
    { label: 'Mar', value: 'mardi',    checked: false },
    { label: 'Mer', value: 'mercredi', checked: false },
    { label: 'Jeu', value: 'jeudi',    checked: false },
    { label: 'Ven', value: 'vendredi', checked: false },
    { label: 'Sam', value: 'samedi',   checked: false },
    { label: 'Dim', value: 'dimanche', checked: false },
  ];
  // Horloge affichée dans l’UI 
  currentTime = '';
  currentDate = '';
  private timer: any;
    // Onglet actif (conditions ou règles)
  activeTab: 'condition' | 'regle' = 'condition';

  constructor(
    private route: ActivatedRoute, // lire les paramètres URL
    private router: Router, // navigation
    private conditionService: ConditionService, // appel api conditions
    private regleService: RegleService // api regle 
  ) {}

  ngOnInit(): void {
     // On lit les query params: ?id=...&nom=...&type=...
    this.route.queryParams.subscribe(params => {
      // sécurise id: garde uniquement les chiffres
      const rawId = String(params['id'] ?? '').replace(/\D.*/, '');
      this.idEquipement = parseInt(rawId, 10);
      // récupère nom et type
      this.nomEquipement = params['nom'] || '';
      this.typeEquipement = params['type'] || '';
      // adapte le formulaire selon typeEquipement
      this.detectType();
      this.loadHistorique();
      this.loadRegles();
    });
    this.startClock();
  }
  // a la destruction du composant
  ngOnDestroy(): void {
    // arrête l’interval pour éviter fuite mémoire
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
    //Détecter le type d’équipement et configurer le formulaire
  detectType(): void {
    const t = this.typeEquipement.toLowerCase();
    // Lampe/TV → bouton ON/OFF
    this.isOnOff  = t === 'lampe' || t === 'television';
    // Clim/Chauffage → valeur numérique (température)
    this.isNombre = t === 'clime' || t === 'chauffage';
       // Ajuste les limites et la valeur par défaut selon type
    if (t === 'chauffage') { this.minTemp = 10; this.maxTemp = 35; this.valeurNombre = 18; }
    if (t === 'clime')     { this.minTemp = 16; this.maxTemp = 30; this.valeurNombre = 22; }
  }

// Charger l'historique des conditions d’un équipement
  loadHistorique(): void {
    if (!this.idEquipement) return;
    this.loadingHistorique = true;
    this.conditionService.getByEquipement(this.idEquipement).subscribe({
      next: (data) => { this.historique = data; this.loadingHistorique = false; },
      error: ()     => { this.loadingHistorique = false; }
    });
  }
   // Récupère la valeur à envoyer (ON/OFF ou nombre)
  getValeur(): string {
    if (this.isOnOff)  return this.valeurOnOff;
    if (this.isNombre) return this.valeurNombre.toString();
    return '';
  }
   // Envoyer une condition au backend
  submitCondition(): void {
    const valeur = this.getValeur();
    if (!valeur) { this.errorCondition = 'Veuillez saisir une valeur'; return; }
    this.loadingCondition = true;
    this.successCondition = '';
    this.errorCondition   = '';
    this.conditionService.create({
      idEquipement:  this.idEquipement,
      nomEquipement: this.nomEquipement,
      valeur:        valeur,
      dateHeure:     new Date().toISOString()
    }).subscribe({
      next: () => {
        this.successCondition = `✅ Condition "${valeur}" appliquée avec succès !`;
        this.loadingCondition = false;
        this.loadHistorique();
      },
      error: () => {
        this.errorCondition  = 'Erreur lors de l\'application de la condition';
        this.loadingCondition = false;
      }
    });
  }
    // Supprimer une condition
  deleteCondition(id: number): void {
    this.conditionService.delete(id).subscribe({
      next:  () => this.loadHistorique(),
      error: () => this.errorCondition = 'Erreur lors de la suppression'
    });
  }

   // Charger les règles liées à l’équipement
  loadRegles(): void {
    if (!this.idEquipement) return;
    this.loadingRegles = true;
    this.regleService.getByEquipement(this.idEquipement).subscribe({
      next: (data) => { this.regles = data; this.loadingRegles = false; },
      error: ()     => { this.loadingRegles = false; }
    });
  }
   // Si chaqueJour = true → dateRegle doit être null
  onChaqueJourChange(): void {
    this.dateRegle = this.chaqueJour ? null : new Date().toISOString().split('T')[0];
  }
  // Construit la chaîne "lundi,mardi,..." à envoyer au backend
  getJoursSelectionnes(): string {
    if (this.chaqueJour) return this.jours.map(j => j.value).join(',');
    return this.jours.filter(j => j.checked).map(j => j.value).join(',');
  }
 // Bouton “cocher tous les jours”
  toggleTousLesJours(): void {
    const tousCoches = this.jours.every(j => j.checked);
    this.jours.forEach(j => j.checked = !tousCoches);
    this.chaqueJour = !tousCoches;
  }
  // Vérifie si tous les jours sont cochés
  tousLesJoursCoches(): boolean {
    return this.jours.every(j => j.checked);
  }

  // Si l’utilisateur coche tous les jours un par un → chaqueJour devient true
  onJourChange(): void {
    this.chaqueJour = this.jours.every(j => j.checked);
  }
// Envoyer une règle au backend
  submitRegle(): void {
    if (!this.heureDebut || !this.heureFin) {
      this.errorRegle = 'Veuillez remplir tous les champs'; return;
    }
        // Si pas chaque jour → date obligatoire
    if (!this.chaqueJour && !this.dateRegle) {
      this.errorRegle = 'Veuillez sélectionner une date'; return;
    }

    this.loadingRegle = true;
    this.successRegle = '';
    this.errorRegle   = '';

    this.regleService.create({
      dateRegle:    this.chaqueJour ? null : this.dateRegle, //  null au lieu de 'chaque_jour'
      heureDebut:   this.heureDebut,
      heureFin:     this.heureFin,
      idEquipement: this.idEquipement,
      jours:        this.getJoursSelectionnes(),
      chaqueJour:   this.chaqueJour
    }).subscribe({
      next: () => {
        // message succès différent selon chaqueJour
        this.successRegle = this.chaqueJour
          ? `✅ Règle répétée chaque jour de ${this.heureDebut} à ${this.heureFin} !`
          : `✅ Règle planifiée le ${this.dateRegle} de ${this.heureDebut} à ${this.heureFin} !`;
        this.loadingRegle = false;
        // reset formulaire
        this.chaqueJour = false;
        this.dateRegle = new Date().toISOString().split('T')[0];
        this.jours.forEach(j => j.checked = false);
        // refresh liste
        this.loadRegles();
      },
      error: () => {
        this.errorRegle  = 'Erreur lors de la création de la règle';
        this.loadingRegle = false;
      }
    });
  }

// Supprimer une règle
  deleteRegle(id: number): void {
    this.regleService.delete(id).subscribe({
      next:  () => this.loadRegles(),
      error: () => this.errorRegle = 'Erreur lors de la suppression'
    });
  }
 // "lundi,mardi" → "Lun · Mar"
  formatJours(jours: string): string {
    if (!jours) return '';
    return jours.split(',')
      .map(j => j.charAt(0).toUpperCase() + j.slice(1, 3))
      .join(' · ');
  }
  // Choisir un icone selon type équipement

  getIcon(): string {
    const t = this.typeEquipement.toLowerCase();
    if (t === 'lampe')      return '💡';
    if (t === 'clime')      return '❄️';
    if (t === 'chauffage')  return '🔥';
    if (t === 'television') return '📺';
    return '🔌';
  }
 // Format date avec heure (historique)
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('fr-FR');
  }
// Format date courte (règles)
  formatDateShort(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }
 // Retour à la page principale
  goBack(): void {
    this.router.navigate(['/smarthouse']);
  }
}