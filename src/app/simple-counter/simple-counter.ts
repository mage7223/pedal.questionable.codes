import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { StorageService } from '../service/storage';
import { PedalService } from '../service/pedal-service';

@Component({
  selector: 'app-simple-counter',
  imports: [],
  templateUrl: './simple-counter.html',
  styleUrl: './simple-counter.scss',
})
export class SimpleCounter implements OnInit{

  connected = false;
  device: BluetoothDevice | null = null;
  errorMessage = signal<string>("");
  hasError = signal(false);

  serviceUUID = "d98e357f-3d21-4669-a17d-9b389d6559e1";
  buttonDownCharacteristicUUID = "4e9ca473-b618-4de5-a0db-bb1c055a5e1c";
  buttonUpCharacteristicUUID = "019f2af2-6401-445b-a52d-8119aca2c5ef";
  storageService = inject(StorageService);
  pedalService = inject(PedalService);
  clickCount = signal(this.storageService.getItem("clickCount") ?? 0);

  constructor() {
    effect(() => {
      this.storageService.setItem("clickCount", this.clickCount());
    });
    effect(() => {
      this.hasError.set(this.errorMessage() !== "");
    });
    this.pedalService.onLeftButtonPress.subscribe(() => {
      this.leftButtonClicked();
    });
    this.pedalService.onCenterButtonPress.subscribe(() => {
      this.centerButtonClicked();
    });
    this.pedalService.onRightButtonPress.subscribe(() => {
      this.rightButtonClicked();
    });
    this.pedalService.onPedalError.subscribe((message: string) => {
      this.errorMessage.set(message);
    });
    this.pedalService.onConnectPedal.subscribe(() => {
      console.log("Pedal connected event received in SimpleCounter");
      this.errorMessage.set("");
    });
    this.pedalService.onDisconnectPedal.subscribe(() => {
      console.log("Pedal disconnected event received in SimpleCounter");
    });

  }


  ngOnInit(): void {
    if(!navigator.bluetooth) {
      this.errorMessage.set('Web Bluetooth is not supported in this browser.');
    }

  }

  public async onConnectClick() {
    this.pedalService.connectToPedal();
  }
  private leftButtonClicked() {
    console.log('Left button clicked');
    if(this.clickCount() > 0){
        this.clickCount.set(this.clickCount() - 1);
    }
  };
  private centerButtonClicked() {
    console.log('Center button clicked');
    this.clickCount.set(this.clickCount() + 1);
  };
  private rightButtonClicked() {
    this.clickCount.set(0);
    console.log('Right button clicked');
  };

  onClick($event: PointerEvent) {
    console.log('Header clicked with event:', $event);
    if($event.ctrlKey || $event.metaKey) {
      // ctrl click
      this.centerButtonClicked();
    }
    if($event.shiftKey) {
      // shift click
      this.leftButtonClicked();
    }
  }

}
