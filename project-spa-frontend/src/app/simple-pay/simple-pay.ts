import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  balances = { A: 0, B: 0, C: 0 };
  amount = 20;
  direction: Direction = 'AtoB';
  message = '';
  apiUrl = 'https://paypalapplicationjavascript-1.onrender.com/api';

  constructor(private http: HttpClient) {
    this.getBalances();
  }

  ngOnInit(): void {
    this.getBalances();
  }

  ngAfterViewInit(): void {
    if (typeof paypal !== 'undefined') {
      paypal.Buttons({
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: String(this.amount) 
              }
            }]
          });
        },
        onApprove: async (_data: any, actions: any) => {
          await actions.order.capture();
          this.makePayment(); 
        }
      }).render('#paypal-button-container');
    }
  }

  getBalances(): void {
    this.http.get<{A: number, B: number, C: number}>(`${this.apiUrl}/balances`)
      .subscribe({
        next: data => this.balances = data,
        error: err => this.message = `Error loading balances: ${err.message}`
      });
  }

  makePayment(): void {
    const amount = Number(this.amount);
    if (amount <= 0) {
      this.message = 'Amount must be greater than 0';
      return;
    }

    let from = this.direction[0]; // first letter
    let to = this.direction[3];   // last letter

    this.http.post<any>(`${this.apiUrl}/pay`, { from, to, amount })
      .subscribe({
        next: (res) => {
          this.message = `Payment of $${amount} from ${from} to ${to} successful.`;
          this.balances = res.balances;
        },
        error: (err) => {
          this.message = err.error?.error || err.error?.message || `Error making payment: ${err.message}`;
        }
      });
  }
}