import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var paypal: any;

type Direction = 'AtoB' | 'AtoC' | 'BtoA' | 'BtoC' | 'CtoA' | 'CtoB';
@Component({
  selector: 'app-simple-pay',
  standalone: false,
  templateUrl: './simple-pay.html',
  styleUrl: './simple-pay.css',
})
export class SimplePay implements OnInit, AfterViewInit {
  balances: {A: number, B: number, C: number} = {
    A: 0, 
    B: 0, 
    C: 0
  };
  amount = 20;
  direction: Direction = 'AtoB';
  message = '';
  apiUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {
    this.getBalances();
  }
  ngOnInit(): void {
    this.getBalances();
  }
  getBalances(): void {
    this.http.get<{A: number, B: number, C: number}>(
      `${this.apiUrl}/balances`).subscribe({
        next: (data) => {
          this.balances = data;
        },
        error: (err) => {
          this.message = `Error loading balances: ${err.message}`;
        }
      });
  }
  makePayment(): void {
    const amount = Number(this.amount);
    if (amount <= 0) {
      this.message = 'Amount must be greater than 0';
      return;
    }
    let from = '';
    let to = '';
    switch (this.direction) {
      case 'AtoB':
        from = 'A';
        to = 'B';
        break;
      case 'AtoC':
        from = 'A';
        to = 'C';
        break;
      case 'BtoA':
        from = 'B';
        to = 'A';
        break;
      case 'BtoC':
        from = 'B';
        to = 'C';
        break;
      case 'CtoA':
        from = 'C';
        to = 'A';
        break;
      case 'CtoB':
        from = 'C';
        to = 'B';
        break;
    }
    this.http.post<any>(
      `${this.apiUrl}/pay`,
      { from, to, amount: amount }).subscribe({
        next: (res) => {
          this.message = `Payment of $${amount} from ${from} to ${to} successful.`;
          this.balances = res.balances;
        },
        error: (err) => {
          this.message = err.error?.error || err.error?.message || `Error making payment: ${err.message}`;
        }
      });
  }
  ngAfterViewInit(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.amount.toString(),
              currency_code: 'CAD'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.message = `The PayPal payment is completed by ${details.payer.name.given_name}`;
          this.makePayment();
        });
      }
    }).render('#paypal-button-container');
  }
}