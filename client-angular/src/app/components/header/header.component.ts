import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { MenuItem } from 'primeng/api';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items!: MenuItem[];
  visible: boolean = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        routerLink: ['']
      },
      {
        label: 'Search',
        routerLink: ['stocks', 'search']
      },
      {
        label: 'Stocks',
        routerLink: ['stocks', 'all']
      },
      { 
        label: 'Market Trends', 
        routerLink: ['marketTrends'] 
      },
      {
        label: 'Login',
        visible: false,
        command: () => this.router.navigate(['/login']),
      },
      {
        label: 'User',
        visible: false,
        items: [
          { label: 'My Stocks', routerLink: ['user', 'stocks'] },
          { label: 'Information', routerLink: ['user', 'information']},
          { label: 'Notifications', routerLink: ['user', 'notifications'] },
          { label: 'Sign Out', command: () => this.SignOut() },
        ]
      }
    ];

    let loginItemIndex = this.items
      .findIndex(item => item.label == 'Login');

    let userItemIndex = this.items
      .findIndex(item => item.label == 'User');

    this.authenticationService.userConnection()
      .subscribe(isUserConnected => {
        this.items[loginItemIndex].visible = !isUserConnected;
        this.items[userItemIndex].visible = isUserConnected;

        this.updateVisibility();
      });

    let notificationItemIndex = this.items[userItemIndex].items!
      .findIndex(item => item.label == 'Notifications');

    this.userService.GetUser()
      .subscribe(user => 
        {
          let notificationsCount = user.stockNotifications.length.toString();
          
          this.items[userItemIndex].badge = notificationsCount;
          this.items[userItemIndex].items![notificationItemIndex].badge = notificationsCount;

          this.updateVisibility();
        });
  }

  SignOut() {
    this.authenticationService.DisconnectUser();
    this.router.navigate(['/']);
  }

  updateVisibility(): void {
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }
}