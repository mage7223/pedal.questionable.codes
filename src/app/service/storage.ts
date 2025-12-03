import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Save data to localStorage
  setItem(key: string, value: any): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Error saving to localStorage', e);
      }
    }
  }

  // Get data from localStorage
  getItem(key: string): any | null {
    if (this.isBrowser) {
      try {
        const storedItem = localStorage.getItem(key);
        return storedItem ? JSON.parse(storedItem) : null;
      } catch (e) {
        console.error('Error getting data from localStorage', e);
        return null;
      }
    }
    return null;
  }

  // Remove data from localStorage
  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  // Clear all localStorage
  clear(): void {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }
}
