import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

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
    this.socket = io('http://localhost:5000', {
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

      const data = {
        from: 'SiteIQ',
        ip: ipData.ip,
        referrer: document.referrer || 'Direct',
        sessionTime: sessionTime,
        activeUsers: currentActiveUsers,
        isFirstVisit: this.isFirstVisit,
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
