import { Component } from '@angular/core';
import { StockNotification } from 'src/models/users/stock-notification';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent {
  stockNotifications?: StockNotification[];

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService
  ){}

  ngOnInit(): void {
    let email = this.authenticationService.GetUserEmail();

    if(email == null)
      return;

    this.userService.GetUser()
      .subscribe(user => this.stockNotifications = user.stockNotifications);
  }
}
