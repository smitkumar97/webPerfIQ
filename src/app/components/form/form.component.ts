import { Component } from '@angular/core';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  standalone: false
})
export class FormComponent {
  var1: any;
  var2=0;

  constructor(
    private reportService: ReportService,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.reportService.behaviorSubject.subscribe((val) => this.var1=val);
    this.reportService.subject.subscribe((val) => this.var2=val);
  }

  increase() {
    this.var1 += 1;
    this.reportService.behaviorSubject.next(this.var1);
  }

  increase2() {
    this.var2 += 1;
    this.reportService.subject.next(this.var2);
  }
}
