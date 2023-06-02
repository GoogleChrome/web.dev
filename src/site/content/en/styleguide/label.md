---
title: '{% Label %}'
---

### AIDL

To notify the merchant about new changes use the `PaymentDetailsUpdateService`
service declared in Chrome's AndroidManifest.xml. To use this service create two
AIDL files with the following content:

{% Label %}app/src/main/aidl/org/chromium/components/payments/IPaymentDetailsUpdateService{% endLabel %}

```kotlin
package org.chromium.components.payments;
import android.os.Bundle;

interface IPaymentDetailsUpdateServiceCallback {
    oneway void updateWith(in Bundle updatedPaymentDetails);

    oneway void paymentDetailsNotUpdated();
}
```

{% Label %}app/src/main/aidl/org/chromium/components/payments/IPaymentDetailsUpdateServiceCallback{% endLabel %}

```kotlin
package org.chromium.components.payments;
import android.os.Bundle;
import org.chromium.components.payments.IPaymentDetailsUpdateServiceCallback;

interface IPaymentDetailsUpdateService {
    oneway void changePaymentMethod(in Bundle paymentHandlerMethodData,
            IPaymentDetailsUpdateServiceCallback callback);

    oneway void changeShippingOption(in String shippingOptionId,
            IPaymentDetailsUpdateServiceCallback callback);

    oneway void changeShippingAddress(in Bundle shippingAddress,
            IPaymentDetailsUpdateServiceCallback callback);
}
```