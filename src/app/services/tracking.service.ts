import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  touchSupport: boolean;
  language: string;
  timezone: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService implements OnDestroy {

  private socket!: Socket;
  private startTime: number = Date.now();
  private trackingDataSent = false;
  private isFirstVisit = sessionStorage.getItem('hasVisited') === null;
  activeUsers$ = new BehaviorSubject<number>(1);

  constructor(private http: HttpClient) {
    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket = io(environment.socketUrl, {
      autoConnect: false
    });

    this.socket.on('connect', () => {
      this.socket.emit('register-user');
    });

    this.socket.on('initial-count', (count: number) => {
      this.activeUsers$.next(count);
    });

    this.socket.on('active-users-update', (count: number) => {
      this.activeUsers$.next(count);
      this.sendTrackingData(count);
    });

    this.socket.connect();

    window.addEventListener('beforeunload', this.handleUnload.bind(this));
  }

  private async sendTrackingData(currentActiveUsers: number) {
    if (this.trackingDataSent) return;
    this.trackingDataSent = true;

    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      const sessionTime = Math.round((Date.now() - this.startTime) / 1000);

      const location = await this.getLocation();
      const device = this.getDeviceInfo();

      const data = {
        from: 'SiteIQ',
        ip: ipData.ip,
        referrer: document.referrer || 'Direct',
        sessionTime: sessionTime,
        activeUsers: currentActiveUsers,
        isFirstVisit: this.isFirstVisit,
        location: location,
        device: device
      };

      this.sendEmail(data).subscribe();

      if (this.isFirstVisit) {
        sessionStorage.setItem('hasVisited', 'true');
      }
    } catch (err) {
      console.error('Tracking failed:', err);
      this.trackingDataSent = false;
    }
  }

  private getLocation(): Promise<LocationData | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.warn('Location access denied or unavailable:', error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent.toLowerCase();

    return {
      deviceType: this.detectDeviceType(userAgent),
      os: this.detectOS(userAgent),
      browser: this.detectBrowser(userAgent),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
    const tabletRegex = /ipad|android(?!.*mobile)|tablet|kindle|silk/i;

    if (tabletRegex.test(userAgent)) {
      return 'tablet';
    } else if (mobileRegex.test(userAgent)) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  private detectOS(userAgent: string): string {
    if (/windows nt 10/i.test(userAgent)) return 'Windows 10/11';
    if (/windows nt 6.3/i.test(userAgent)) return 'Windows 8.1';
    if (/windows nt 6.2/i.test(userAgent)) return 'Windows 8';
    if (/windows nt 6.1/i.test(userAgent)) return 'Windows 7';
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/macintosh|mac os x/i.test(userAgent)) {
      const match = userAgent.match(/mac os x ([\d_]+)/);
      return match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
    }
    if (/android (\d+)/i.test(userAgent)) {
      const match = userAgent.match(/android (\d+)/i);
      return `Android ${match ? match[1] : ''}`;
    }
    if (/iphone|ipad|ipod/i.test(userAgent)) {
      const match = userAgent.match(/os (\d+)_(\d+)/i);
      return match ? `iOS ${match[1]}.${match[2]}` : 'iOS';
    }
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/cros/i.test(userAgent)) return 'Chrome OS';
    return 'Unknown';
  }

  private detectBrowser(userAgent: string): string {
    if (/edg/i.test(userAgent)) return 'Edge';
    if (/chrome|crios/i.test(userAgent) && !/edg/i.test(userAgent)) return 'Chrome';
    if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) return 'Safari';
    if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
    if (/opera|opr/i.test(userAgent)) return 'Opera';
    if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';
    return 'Unknown';
  }

  private handleUnload() {
    if (this.socket?.connected) {
      this.socket.emit('unregister-user');
    }
  }

  sendEmail(data: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/visit/send`, data);
  }

  ngOnDestroy() {
    if (this.socket?.connected) {
      this.socket.emit('unregister-user');
      this.socket.disconnect();
    }
    window.removeEventListener('beforeunload', this.handleUnload.bind(this));
  }
}
