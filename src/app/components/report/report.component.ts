import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private reportService: ReportService,
  ) { }

  reportForm = new FormGroup({
    website: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.fetchHistory();
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
        console.error('Error generating report:', error);
        this.loading = false;
      }
    );
  }

  fetchHistory() {
    this.reportService.getReportHistory().subscribe((data) => {
      this.history = data;
    });
  }

  viewReport(item: any) {
    this.reportData = item;
  }
}
