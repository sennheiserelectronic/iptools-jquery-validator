# iptools-jquery-validator [![Build Status](http://img.shields.io/travis/interactive-pioneers/iptools-jquery-validator.svg)](https://travis-ci.org/interactive-pioneers/iptools-jquery-validator)

jQuery form validation plugin

## Requirements

- jQuery 1.11.3 (or greater)

## Example

```html
<form method="post" action="">
  <input type="text" data-validation="required,email" data-validation-trigger="change" data-errormsg-required="Dieses Feld ist ein Pflichtfeld." data-errormsg-email="Bitte geben Sie eine gültige E-Mail-Adresse an.">
</form>

<script src="src/iptools-jquery-validator.js"></script>
<script type="text/javascript">
  $(document).ready(function() {
    $('form').iptValidator({
      triggerOnSubmit: true,
      stopOnRequired: false,
      errorPublishingMode: 'insertAfter',
      errorMsgContainerID: null,
      errorClass: 'error'
    });
  });
</script>
```

## Contributions

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence
Copyright © 2016 Interactive Pioneers GmbH. Licenced under [GPL-3](LICENSE).
