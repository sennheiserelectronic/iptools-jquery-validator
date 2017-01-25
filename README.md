# iptools-jquery-validator [![Build Status](http://img.shields.io/travis/interactive-pioneers/iptools-jquery-validator.svg)](https://travis-ci.org/interactive-pioneers/iptools-jquery-validator) [![Bower version](https://badge.fury.io/bo/iptools-jquery-validator.svg)](http://badge.fury.io/bo/iptools-jquery-validator)

jQuery form validation plugin.

## Requirements

- jQuery >=1.11.3 <4.0.0

## Supported validation schemas

| Schema        | Description                                                                                                                    |
| ---------     | -----------                                                                                                                    |
| `required`    | Checks if field has value.                                                                                                     |
| `email`       | Checks if field value is email.                                                                                                |
| `regexp`      | Checks field value against regular expression defined in `data-validation-regexp`.                                             |
| `phone`       | Checks if field value is phone number. Allows `+`, space and numbers.                                                          |
| `numeric`     | Checks if field value is numeric. Allows decimals, signs, and scientific notation.                                             |
| `number`      | Checks if field value is number.                                                                                               |
| `name`        | Checks if field value is name, i.e. first or last name of person.                                                              |
| `street`      | Checks if field value is street name.                                                                                          |
| `housenumber` | Checks if field value is house number.                                                                                         |
| `postcode`    | Checks if field value is post code.                                                                                            |
| `match`       | Checks if field value matches to field referenced by `data-validation-connected-field`.                                        |
| `unique`      | Checks if field value is unique in amongst given references by `data-validation-unique-with` and `data-validation-unique-set`. |

## Usage

`iptools-jquery-validator` relies on namespaced data attributes such as

| Attribute                           | Description                                                                                                                                                                              |
| ---------                           | -----------                                                                                                                                                                              |
| `data-validation`                   | Comma-separated list of validation schemas to apply, e.g. `data-validation="required,phone"`. See [Supported validation schemas](#supported-validation-schemas).                         |  
| `data-validation-trigger`           | Event on which validation should be triggered. Only events emitted from actual control are considered.                                                                                   |
| `data-validation-regexp`            | Regular expression definition for fields with `regexp` validation schema.                                                                                                                |
| `data-validation-connected-field`   | Name of the connected field for fields with `match` validation schema.                                                                                                                   |
| `data-validation-unique-set`        | Namespace within which to perform unique validation.                                                                                                                                     |
| `data-validation-unique-with`       | ID of field, value of which, in combination with current field's value, makes up unique value to be validated, e.g. forename + surname.                                                  |
| `data-validation-errormsg-<schema>` | Error message to be displayed in case validation fails, e.g. `data-validation-errormsg-required="Name is required."`. See [Supported validation schemas](#supported-validation-schemas). |

### Options

Following options (optional) can be used to initialise component:

| Option                  | Description                                                                                                                                              | Default               |
| ------                  | -----------                                                                                                                                              | -------               |
| `stopOnRequired`        | Stop further validation if `required` validation schema fails                                                                                            | `false`               |
| `triggerOnSubmit`       | Trigger validation on submit                                                                                                                             | `true`                |
| `validateOnCustomEvent` | Trigger validation on custom event                                                                                                                       | `null`                |
| `errorPublishingMode`   | Position of error message relative to erroneous field. Possible values: `insertInto`, `insertAfter`, `insertBefore`, `appendToParent`, `prependToParent` | `appendToParent`      |
| `errorMsgBoxID`         | HTML Element ID holding error messages. Corresponds to `errorPublishingMode: 'insertInto'`                                                               | `null`                |
| `errorClass`            | CSS class added to erroneous fields, error message and error class subscribers                                                                           | `error`               |
| `boxAnimationMode`      | Animation strategy applied to errors. Possible values: `default`, `fade`, `slide`                                                                        | `default` (show/hide) |
| `animationDuration`     | Duration of boc animation in ms                                                                                                                          | `500`                 |
| `wipeTargets`           | Third party elements (e.g. errors) to be removed from DOM on validation                                                                                  | `null`                |

## Example

```html
<form method="post" action="">
  <input type="text" data-validation="required,email" data-validation-trigger="change" data-validation-errormsg-required="Dieses Feld ist ein Pflichtfeld." data-validation-errormsg-email="Bitte geben Sie eine gültige E-Mail-Adresse an.">
</form>

<script src="src/iptools-jquery-validator.js"></script>
<script type="text/javascript">
  $(document).ready(function() {
    $('form').iptValidator({
      triggerOnSubmit: true,
      stopOnRequired: false,
      errorPublishingMode: 'insertAfter',
      errorMsgBoxID: null,
      errorClass: 'error'
    });
  });
</script>
```

## Contributions

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

Copyright © 2016, 2017 Interactive Pioneers GmbH. Licenced under [GPL-3](LICENSE).
