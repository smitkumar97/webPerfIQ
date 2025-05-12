import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: false
})
export class LoaderComponent {
  @Input() isLoading: boolean = false; // Control visibility of the loader
  @Input() loadingText: string = 'Generating Report...'; // Custom loading text
}
