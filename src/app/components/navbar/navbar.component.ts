import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;
  arr = [7, 5, 3, 1, 7, 6, 5, 4, 3, 2, 1];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  findDuplicateelements() {
    const res = [];
    this.arr.sort();
    let i = 0;

    while (i < this.arr.length) {
      const first = this.arr.indexOf(this.arr[i]);
      const last = this.arr.lastIndexOf(this.arr[i]);

      if (last > first) {
        res.push(this.arr[i]);
      }
      i = last + 1;
    }

    return res;
  }
}
