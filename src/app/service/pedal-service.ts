import { EventEmitter, Injectable, Output } from '@angular/core';

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
  

  constructor() {}
  
}
