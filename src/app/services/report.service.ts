import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiBaseUrl}/reports`;
  subject = new Subject<number>();
  behaviorSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  generateReport(url: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate`, { url });
  }

  getReportHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }
}
