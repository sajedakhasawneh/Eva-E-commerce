import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../Services/shop.service';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.css'
})
export class ViewUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private service: UserService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.service.getAllUsers().subscribe((data) => {
      this.users = data;
    }, error => {
      console.error("Error fetching users", error);
    });
  }



}
