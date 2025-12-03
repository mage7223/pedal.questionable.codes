import { effect, EventEmitter, Injectable, Output, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PedalService {

  @Output('onLeftButtonPress') onLeftButtonPress = new EventEmitter<number>();
  @Output('onRightButtonPress') onRightButtonPress = new EventEmitter<number>();
  @Output('onCenterButtonPress') onCenterButtonPress = new EventEmitter<number>();
  @Output('onLeftButtonRelease') onLeftButtonRelease = new EventEmitter<number>();
  @Output('onRightButtonRelease') onRightButtonRelease = new EventEmitter<number>();
  @Output('onCenterButtonRelease') onCenterButtonRelease = new EventEmitter<number>();
  @Output('onDisconnectPedal') onDisconnectPedal = new EventEmitter<void>();
  @Output('onConnectPedal') onConnectPedal = new EventEmitter<void>();
  @Output('onPedalError') onPedalError = new EventEmitter<string>();
  
  connected = signal(false);
  device: BluetoothDevice | null = null;
  serviceUUID = "d98e357f-3d21-4669-a17d-9b389d6559e1";
  buttonDownCharacteristicUUID = "4e9ca473-b618-4de5-a0db-bb1c055a5e1c";
  buttonUpCharacteristicUUID = "019f2af2-6401-445b-a52d-8119aca2c5ef";


  constructor() {
    effect(() => {
      if(this.connected() === false) {
        this.onDisconnectPedal.emit();
      } else {
        this.onConnectPedal.emit();
      }
    });
  }

  public disconnectFromPedal() {
    console.log("Disconnect from Sophie's Pedal clicked");
    if(this.device && this.device.gatt && this.device.gatt.connected) {
        this.device.gatt.disconnect();
        this.connected.set(false);
    }
  }

  public connectToPedal() {
    console.log("Connect to Sophie's Pedal clicked");
    if (!navigator.bluetooth) {
      
      console.error('Web Bluetooth is not supported in this browser.');
      return;
    }
        navigator.bluetooth.requestDevice(
            { filters:[ {services:[this.serviceUUID]} ] }
        ).then((device: any) => {        
          this.device = device;
          console.log('Device selected:', device.name);

          var buttonDownCharacteristic: any;
          var buttonUpCharacteristic: any;
          device.addEventListener('gattserverdisconnected', () => {
              console.log('Device disconnected');
              this.connected.set(false);});
          device.addEventListener('gattserverconnected', () => {
              console.log('Device connected');
              this.connected.set(true);
          });
          device.gatt.connect()
          .then((connectedServer: any) => {
              console.log('Connected to GATT server');
              this.connected.set(true);
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
              this.connected.set(true);
              
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
      if(buttonIndex === 0) {
          this.leftButtonReleased();
      } else if(buttonIndex === 1) {
          this.centerButtonReleased();
      } else if(buttonIndex === 2) {
          this.rightButtonReleased();
      }
}

  private rightButtonReleased() {
    console.log('Right button released');
    this.onRightButtonRelease.emit();
  }
  private centerButtonReleased() {
    console.log('Center button released');
    this.onCenterButtonRelease.emit();
  }
  private leftButtonReleased() {
    console.log('Left button released');
    this.onLeftButtonRelease.emit();
  }
  private leftButtonClicked() {
    console.log('Left button clicked');
    this.onLeftButtonPress.emit();
  };
  private centerButtonClicked() {
    console.log('Center button clicked');
    this.onCenterButtonPress.emit();
  };
  private rightButtonClicked() {
    console.log('Right button clicked');
    this.onRightButtonPress.emit();
  };
  
}
