import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  msg = '';
  constructor(private ser: UserService, private route: Router) { }

  signUp(userData: any) {
    if (userData.email.trim() == '' || userData.password.trim() == '' || userData.fullName.trim() == '' ||
      userData.phone.trim() == '') {
      this.msg = "Please fill out all fields! 😇"
      return;
      }
    this.ser.postToUsers(userData).subscribe(() => {
      this.route.navigate(['/login']);
    })
    this.ser.postUserData(userData).subscribe(() => {/////////////////////////////////////////////
    })
  }
}
