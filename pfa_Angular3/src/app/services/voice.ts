import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {

  constructor(private http: HttpClient) {}

  sendAudio(blob: Blob, equipementId: number) {
    const formData = new FormData();
    formData.append("audio", blob, "audio.wav");
    formData.append("equipementId", equipementId.toString());

    return this.http.post("http://localhost:5297/api/voice/command", formData);
  }
}