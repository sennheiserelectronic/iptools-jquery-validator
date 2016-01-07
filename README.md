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

### Bug reports, suggestions

- File all your issues, feature requests [here](https://github.com/interactive-pioneers/iptools-jquery-validator/issues)
- If filing a bug report, follow the convention of _Steps to reproduce_ / _What happens?_ / _What should happen?_
- __If you're a developer, write a failing test instead of a bug report__ and send a Pull Request

### Code

1. Fork it ( https://github.com/[my-github-username]/iptools-jquery-validator/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Develop your feature by concepts of [TDD](http://en.wikipedia.org/wiki/Test-driven_development), see [Tips](#tips)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

### Tips

Following tasks are there to help with development:

- `grunt watch:bdd` listens to tests and source, reruns tests
- `grunt qa` run QA task that includes tests and JSHint
- `grunt build` minify source to dist/

## Licence
Copyright © 2016 Interactive Pioneers GmbH. Licenced under [GPL-3](LICENSE).
