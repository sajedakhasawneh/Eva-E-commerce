import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isLogged: any;

  constructor(private ser: UserService, private route: Router) { }

  ngOnInit() {
    this.ser.getLoggedInUser().subscribe(user => {
      this.isLogged = !!user;
    });
  }

  LogOut() {
    this.ser.clearLoggedInUser()
    this.route.navigate(['/login'])
  }
}
