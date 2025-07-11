import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TrackingService } from '../../services/tracking.service';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../services/toaster/toast.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  standalone: false
})
export class ReportComponent implements OnInit {
  url: string = '';
  reportData: any = null;
  loading: boolean = false;
  history: any[] = [];
  activeUsers$ = new BehaviorSubject<number>(0);

  constructor(
    private reportService: ReportService,
    private trackingService: TrackingService,
    public toastr: ToastService
  ) { }

  reportForm = new FormGroup({
    website: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.fetchHistory();
    this.activeUsers$ = this.trackingService.activeUsers$;
  }

  generateReport() {
    const url = this.reportForm.controls['website'].value || '';
    if (!url.trim()) return;
    this.loading = true;

    this.reportService.generateReport(url).subscribe(
      (data) => {
        this.reportData = data;
        this.fetchHistory();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.toastr.showError(error.error);
      }
    );
  }

  fetchHistory() {
    this.reportService.getReportHistory().subscribe(
      (data) => {
        this.history = data;
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this.toastr.showError(error.error);
      });
  }

  viewReport(item: any) {
    this.reportData = item;
  }
}
