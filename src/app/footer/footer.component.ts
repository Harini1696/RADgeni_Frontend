import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentDate = new Date();
  footerMessage:string = "GE HealthCare. GE is a trademarkof General Electric Company used under trademark license";
}
