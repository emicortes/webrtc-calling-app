import { Injectable } from '@angular/core';
import { from, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  camera$ = from(
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  ).pipe(shareReplay());
  
  constructor() {}
}
