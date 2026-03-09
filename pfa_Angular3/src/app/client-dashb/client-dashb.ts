import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieceService, PieceType } from '../services/piece';
import { Router } from '@angular/router';
import RecordRTC ,{ StereoAudioRecorder }from 'recordrtc';
import { VoiceService } from '../services/voice'; 


@Component({
  selector: 'app-client-dashb',
  templateUrl: './client-dashb.html',
  styleUrl: './client-dashb.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ClientDashb {

  pieces: any[] = [];
  pieceTypes: PieceType[] = [];
  recorder: any;
  stream: any;
  currentEquip: any;

  constructor(
    private pieceService: PieceService,
    private router: Router,
    private cd: ChangeDetectorRef,
      private voiceService: VoiceService, // 🔹 ajouté
  ) {}

  ngOnInit() {
    // charger types puis pièces (pour avoir icon)
    this.loadPieceTypes();
  }

  loadPieceTypes() {
    this.pieceService.getPieceTypes().subscribe({
      next: (types) => {
        this.pieceTypes = types || [];
        this.loadPieces(); // une fois types chargés, charger pièces
      },
      error: (err) => {
        console.error('Erreur getPieceTypes:', err);
        // même si ça échoue, on tente de charger les pièces
        this.loadPieces();
      }
    });
  }

  loadPieces() {
    this.pieceService.getPieces().subscribe({
      next: (data: any[]) => {
        // ajoute showMenu + icon selon typeId/type_id
        this.pieces = (data || []).map(p => {
          const typeId = p.typeId ?? p.type_id ?? p.typeID ?? p.type_Id;

          const foundType = this.pieceTypes.find(t => t.id_type === typeId);

          return {
            ...p,
            showMenu: false,
            // normaliser l'id si backend renvoie id_piece / id_Piece / Id_Piece
            id: p.id ?? p.id_piece ?? p.id_Piece ?? p.Id_Piece,
            // normaliser le nom
            nom: p.nom ?? p.Nom,
            // injecter icon + typeNom depuis piece_type
            icon: p.icon ?? foundType?.icon ?? '',
            typeNom: p.typeNom ?? foundType?.nom ?? '',
            // sécuriser equipements
            equipements: p.equipements ?? p.Equipements ?? []
          };
        });

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur getPieces:', err);
        console.error('Message backend:', err?.error?.message);
      }
    });
  }

  goToAddEquipement(pieceId: number) {
    this.router.navigate(['/equipement', pieceId]);
  }

  goToCondition(equip: any) {
    const nom = equip.nom?.toLowerCase() || '';
    const desc = equip.description?.toLowerCase() || '';

    let type = 'lampe';

    if (nom.includes('chauf') || desc.includes('chauf')) {
      type = 'chauffage';
    } else if (nom.includes('clim') || desc.includes('clim')) {
      type = 'clime';
    } else if (nom.includes('tv') || nom.includes('telev') || desc.includes('telev')) {
      type = 'television';
    } else if (nom.includes('lamp') || desc.includes('lamp')) {
      type = 'lampe';
    }

    this.router.navigate(['/condition'], {
      queryParams: {
        id: equip.id,
        nom: equip.nom,
        type: type
      }
    });
  }


  deletePiece(id: number) {
    if (confirm("Voulez-vous vraiment supprimer cette pièce ?")) {
      this.pieceService.deletePiece(id).subscribe(() => {
        this.loadPieces();
        this.cd.detectChanges();
      });
    }
  }

  deleteEquip(id: number) {
    if (confirm("Voulez-vous supprimer cet équipement ?")) {
      this.pieceService.deleteEquipement(id).subscribe(() => {
        this.loadPieces();
        this.cd.detectChanges();
      });
    }
  }

  // si tu ne l’as pas encore, au minimum évite l'erreur dans HTML
  toggleEquip(equip: any) {
    // à implémenter si tu as un endpoint update etat
    console.log('toggleEquip', equip);
  }

  
//duplicate
duplicatePiece(id: number) {
  this.pieceService.duplicatePiece(id).subscribe({
    next: () => {
      this.loadPieces();
      this.cd.detectChanges();
    },
    error: (err) => console.error('Erreur duplication:', err)
});
}

//voice 
async startVoiceCommand(equip: any) {

  this.currentEquip = equip;

  // activer animation micro
  equip.recording = true;

  this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  this.recorder = new RecordRTC(this.stream, {
    type: 'audio',
    mimeType: 'audio/wav',
    recorderType: StereoAudioRecorder,
    numberOfAudioChannels: 1,
    desiredSampRate: 16000
  });

  this.recorder.startRecording();
  console.log("Enregistrement démarré...");

  // arrêter après 4s
  setTimeout(() => this.stopRecording(), 4000);
}
stopRecording() {

  this.recorder.stopRecording(async () => {

    const blob = this.recorder.getBlob();

    // arrêter animation micro
    if(this.currentEquip){
      this.currentEquip.recording = false;
    }

    if(!blob || blob.size <= 44){
      alert("Aucun son capturé !");
      this.stream.getTracks().forEach(track => track.stop());
      return;
    }

    this.voiceService.sendAudio(blob, this.currentEquip.id).subscribe({
      next: (res: any) => {
        console.log("Commande vocale:", res);

        if(res.command === "ON") this.currentEquip.etat = true;
        if(res.command === "OFF") this.currentEquip.etat = false;

        this.cd.detectChanges();
      },
      error: err => console.error(err)
    });

    this.stream.getTracks().forEach(track => track.stop());

  });
}

}
