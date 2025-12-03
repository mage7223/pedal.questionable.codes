import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import QRCodeStyling from 'qr-code-styling';

@Component({
  selector: 'app-qr',
  imports: [],
  templateUrl: './qr.html',
  styleUrl: './qr.scss'
})
export class Qr implements AfterViewInit{
  @ViewChild('qrCodeContainer') qrCodeContainer: ElementRef | undefined;
  qrCode: QRCodeStyling | undefined;

    ngAfterViewInit() {
        //const qrCodeData = 'zod.vg/yBWa';
        const qrCodeData = window.location.href;
        const qrCodeSize = 256;

        // Create QR code instance
        this.qrCode = new QRCodeStyling(this.getConfigJson(qrCodeData));

        // Generate the QR code and get the canvas element
        const canvas = document.createElement('canvas');
        this.qrCode.append(canvas);

        // Append the canvas to the container
    if (this.qrCodeContainer && this.qrCode) {
      this.qrCode.append(this.qrCodeContainer.nativeElement);
    }
    
  }


  getConfigJson(value: string): any {
    return {
      width: 300,
      height: 300,
      data: value, // The data to encode in the QR code
      //image: 'assets/android-chrome-192x192.png', // Path to your logo image
/*      dotsOptions: {
        type: 'rounded'
      },*/
      cornersSquareOptions: {
        type: 'square'
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5
      }
    };
  }

}
