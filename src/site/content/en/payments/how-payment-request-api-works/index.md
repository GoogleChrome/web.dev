---
layout: post
title: How Payment Request API works
subhead: |
  Learn how the Payment Request API works at a high level.
authors:
  - agektmr
date: 2018-09-10
updated: 2021-09-14
description: |
  Learn how the Payment Request API works at a high level.
tags:
  - payments
feedback:
  - api
---

## Payment Request API

When a customer tries to purchase something from your website, the site must ask
the customer to provide payment information and, optionally, other information
such as shipping preference. You can achieve this easily and quickly using the
[Payment Request API (PR API)](https://w3c.github.io/payment-request/).

## Basic structure

Constructing a `PaymentRequest` object requires two parameters: _payment
methods_ and _payment details_. In addition, a third _payment options_ parameter
is optional. A basic request could be created like this:

```javascript
const request = new PaymentRequest(paymentMethods, paymentDetails);
```

Let's look at how each parameter is built and used.

### Payment methods

The first parameter, _paymentMethods_, is a list of supported payment methods in
an array variable. Each element in the array comprises two components,
`supportedMethods` and, optionally, `data`. 

For `supportedMethods`, the merchant needs to specify a [Payment Method
Identifier](/setting-up-a-payment-method/#step-1:-provide-the-payment-method-identifier)
such as `https://bobpay.xyz/pay`. The existence and content of `data` depends on
the content of `supportedMethods` and payment app provider's design. 

Both pieces of information should be provided by the payment app provider.

```javascript
// Supported payment methods
const paymentMethods = [{
  supportedMethods: 'https://bobpay.xyz/pay',
  data: {
    ... // Optional parameters defined by the payment app provider.
  }
}];
```

### Payment details

The second parameter, _paymentDetails_, is passed as an object and specifies
payment details for the transaction. It contains the required value `total`,
which specifies the total amount due from the customer. This parameter can also
optionally list the purchased items.

In the example below, the optional purchased items list (just one item, in this
case) is shown, as is the required total amount due. In both cases the currency
unit is specified with each individual amount.

```javascript
const paymentDetails = {
  displayItems: [{
    label: 'Anvil L/S Crew Neck - Grey M x1',
    amount: { currency: 'USD', value: '22.15' }
  }],
  total: {
    label: 'Total due',
    amount: { currency: 'USD', value : '22.15' }
  }
};
```

## The `show()` method

After setting the two parameters and creating the `request` object as shown
above, you can call the `show()` method, which displays the payment app user
interface.

```javascript
request.show().then(response => {
  // [process payment]
  // send to a PSP etc.
  response.complete('success');
});
```

How payment app user interface will look is completely up to the payment app
provider. After the customer agrees to make a payment, a JSON object is passed
to the merchant which contains all the required information to transfer money.
The merchant can then send it to the PSP to process the payment.

Finally, you may close the Payment Request UI by completing the process with
`response.complete('success')` or `response.complete('fail')` depending on the
result that the PSP returns.

## Next up

Learn more about [Web Payments](/payments/).
