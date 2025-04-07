import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  @Input() userParent: any;
  @Output() userChild = new EventEmitter<any>();
  constructor(private http: HttpClient, private active: ActivatedRoute) { }

  user: any

  ngOnInit() {

    this.user = { ...this.userParent };
  }

  save() {
    this.http.put(`https://67d61653286fdac89bc11c6d.mockapi.io/loggedInUser/1`, this.user).subscribe(
      (updatedUser) => {
        this.userChild.emit(updatedUser);
      })
    console.log("Data to send:", this.user);

  }

  cancel() {
    this.userChild.emit(this.userParent)
  }
}
