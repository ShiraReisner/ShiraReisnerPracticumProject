import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  user!: User | null;

  constructor(public userService: UserService,
    public router: Router) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  add() {
    this.router.navigate(["form-user"]);
  }

}
