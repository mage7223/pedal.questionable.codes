import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { StorageService } from '../service/storage';

@Component({
  selector: 'app-simple-counter',
  imports: [],
  templateUrl: './simple-counter.html',
  styleUrl: './simple-counter.scss',
})
export class SimpleCounter implements OnInit{

  connected = false;
  device: BluetoothDevice | null = null;
  imagePath = signal("/pedals/disconnected.png");
  errorMessage = signal<string>("");
  hasError = signal(false);

  serviceUUID = "d98e357f-3d21-4669-a17d-9b389d6559e1";
  buttonDownCharacteristicUUID = "4e9ca473-b618-4de5-a0db-bb1c055a5e1c";
  buttonUpCharacteristicUUID = "019f2af2-6401-445b-a52d-8119aca2c5ef";
  storageService = inject(StorageService)
  clickCount = signal(this.storageService.getItem("clickCount") ?? 0);

  constructor() {
    effect(() => {
      this.storageService.setItem("clickCount", this.clickCount());
    });
    effect(() => {
      this.hasError.set(this.errorMessage() !== "");
    });

  }


  ngOnInit(): void {
    if(!navigator.bluetooth) {
      this.errorMessage.set('Web Bluetooth is not supported in this browser.');
    }

  }

  public async onConnectClick() {
    console.log("Connect to Sophie's Pedal clicked");
    if (!navigator.bluetooth) {
      
      console.error('Web Bluetooth is not supported in this browser.');
      return;
    }
    if(this.connected) {
        console.log('Disconnecting Bluetooth devices...');
        this.device?.gatt?.disconnect();
        this.imagePath.set("/pedals/disconnected.png");
        this.connected = false;
    } else 
        navigator.bluetooth.requestDevice(
            { filters:[ {services:[this.serviceUUID]} ] }
        ).then((device: any) => {        
          this.device = device;
          console.log('Device selected:', device.name);

          var buttonDownCharacteristic: any;
          var buttonUpCharacteristic: any;
          device.addEventListener('gattserverdisconnected', () => {
              console.log('Device disconnected');
              this.imagePath.set("/pedals/disconnected.png");
          });
          device.addEventListener('gattserverconnected', () => {
              console.log('Device connected');
              this.imagePath.set("/pedals/connected.png");
          });
          device.gatt.connect()
          .then((connectedServer: any) => {
              console.log('Connected to GATT server');
              this.imagePath.set("/pedals/connected.png");
              return connectedServer.getPrimaryService(this.serviceUUID);
          })
          .then((connectedService: any) => {
              return Promise.all([
                  connectedService.getCharacteristic(this.buttonDownCharacteristicUUID),
                  connectedService.getCharacteristic(this.buttonUpCharacteristicUUID)
              ]);
          }).then((characteristics: any[]) => {
              [buttonDownCharacteristic, buttonUpCharacteristic] = characteristics;
              console.log('Characteristics obtained:', buttonDownCharacteristic, buttonUpCharacteristic);
              buttonDownCharacteristic.startNotifications().then(() => {
                  buttonDownCharacteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueDownChanged.bind(this));
                  console.log('Notifications started for button down characteristic');
              });
              buttonUpCharacteristic.startNotifications().then(() => {
                  buttonUpCharacteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValueUpChanged.bind(this));
                  console.log('Notifications started for button up characteristic');
              });
              this.connected = true;
              
          })
          .catch((error: any) => {
              console.error('Error during GATT operations:', error);
          });
          this.device = device;
    });
  }

  private handleCharacteristicValueDownChanged(event: any) {
      const value = event.target.value;
      const buttonIndex = value.getUint8(0);
      if(buttonIndex === 0) {
          this.leftButtonClicked();
      } else if(buttonIndex === 1) {
          this.centerButtonClicked();
      } else if(buttonIndex === 2) {
          this.rightButtonClicked();
      }
  };

  private handleCharacteristicValueUpChanged(event: any) {
    const value = event.target.value;
    const buttonIndex = value.getUint8(0);

    console.log('Button up event received for button index:', buttonIndex);
};


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
