import { Component, inject, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { PedalService } from '../service/pedal-service';


@Component({
  selector: 'app-main-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {
  router = inject(Router);
  pedalService = inject(PedalService);
  canShare = signal(true);

  constructor() {
    if (navigator.share === undefined) {
      this.canShare.set(false);
    }
  }

  onNavigateToSimpleCounter() {
    console.log('Navigating to Simple Counter');
    this.router.navigate(['/simple-counter']);
  }

  onConnectToPedal() {
    if(this.pedalService.connected()){
      this.pedalService.disconnectFromPedal();
    } else {
      this.pedalService.connectToPedal();
    }
  }

  onShareLink() {
    const shareData = {
      title: 'Pedal Questionable Codes',
      text: 'Check out Pedal Questionable Codes!',
      url: window.location.href,
    };

    navigator['share'](shareData).then(() => {
      console.log('Link shared successfully');
    }).catch((error: any) => {
      console.error('Error sharing link:', error);
    });
  }

  onNavigateInstructions() {
    console.log('Navigating to Instructions');
    this.router.navigate(['/instructions']);
  }

  onNavigateQr() {
    console.log('Navigating to QR Code');
    this.router.navigate(['/qr']);
  }

}
