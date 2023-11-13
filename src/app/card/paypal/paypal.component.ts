import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PayPalNamespace, loadScript } from '@paypal/paypal-js';
import { iBestellung } from 'src/app/model/iBestellung';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule, MatButtonModule, MatProgressSpinnerModule]
})
export class PaypalComponent implements OnInit{
  paypal! :PayPalNamespace | null;
  spinner = signal(true);
  constructor (private readonly dialRef: MatDialogRef<PaypalComponent>, @Inject(MAT_DIALOG_DATA) public data: iBestellung) {}
  ngOnInit(): void {
    this.loadPaypal(this.data, this.dialRef);
  }
  async loadPaypal(res: iBestellung, dialRef: MatDialogRef<PaypalComponent>) {

    try {
      this.paypal = await loadScript({ clientId: environment.paypal_client_id, currency: 'EUR'});
    } catch (err) {
      console.log('failed to load paypal....')
    }

    if(this.paypal?.Buttons) {
      try {
        this.spinner.set(false);
        await this.paypal.Buttons({
          async createOrder() {
            try {
              const response = await fetch(`${environment.api}order/create`, {
                method: 'post',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(res),
              })
              const orderData = await response.json();

              if(orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail?`${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`: JSON.stringify(orderData);

                throw new Error(errorMessage);
              }

            } catch (err) {
              const tmp = { statusCode: 0, message : ''};

              resultMessage(`Could not initiate PayPal Checkout...<br><br>${err}`);
            }
          },
          async onApprove(data, actions) {

              try {
                const response = await fetch(`${environment.api}order/capture`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({'orderID': data.orderID, 'bestellung': res})
                });

                const orderData = await response.json();

                // Three cases to handle:
                //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                //   (2) Other non-recoverable errors -> Show a failure message
                //   (3) Successful transaction -> Show confirmation or thank you message

                const errorDetail = orderData?.details?.[0];

                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                  // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                  // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                  return actions.restart();
                } else if (errorDetail) {
                  // (2) Other non-recoverable errors -> Show a failure message
                  console.log(errorDetail)
                  throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                } else if (!orderData.purchase_units) {
                  throw new Error(JSON.stringify(orderData));
                } else {
                  // (3) Successful transaction -> Show confirmation or thank you message
                  // Or go to another URL:  actions.redirect('thank_you.html');
                  dialRef.close('COMPLETED');
                /*  const transaction =
                    orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                    orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
                  resultMessage(
                    `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`,
                  );
                  console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2),
                  );*/
                }
              } catch (err) {
                console.log(err);
                resultMessage(`Sorry, your transaction could not be processed...<br><br>${err}`);
              }
          },
          async onShippingChange(data, actions) {
            resultMessage('Addres wird nicht geeandert');
          },

        }).render("#paypal-container");
      } catch (err) {
        console.log(err)
      }
    }
  }
  close() {
    this.dialRef.close();
  }
}
function resultMessage(arg0: string) {

  const container = document.querySelector("#result-message");

  if(container)
  container.innerHTML = arg0;
}

