import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
  standalone: false
})
export class RecommendationsComponent {
  @Input() reportData: any;
}
