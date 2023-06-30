---
title: Classes
---

# .switcher

<div class="switcher">
{% Compare 'better', 'Shorthand' %}
```css
.grid {
  display: grid;
  gap: 10px 5%;
}
```

{% CompareCaption %}
Set both rows and columns **separately** at once
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Expanded' %}
```css/2-3
.grid {
  display: grid;
  row-gap: 10px;
  column-gap: 5%;
}
```

{% endCompare %}
</div>

# .screenshot

For more information about the WebOTP API and `autocomplete="one-time-code"`,
check out [SMS OTP form best practices](/sms-otp-form/).

<figure class="screenshot">
{% Img
   alt="",
   src="image/VbsHyyQopiec0718rMq2kTE1hke2/Szaf3C0hfjLNkTWAVf9B.png", width="387", height="523"
%}
</figure>