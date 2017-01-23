# iptools-jquery-validator [![Build Status](http://img.shields.io/travis/interactive-pioneers/iptools-jquery-validator.svg)](https://travis-ci.org/interactive-pioneers/iptools-jquery-validator)

jQuery form validation plugin.

## Requirements

- jQuery >=1.11.3 <4.0.0

## Supported validation schemas

| Schema | Description |
| --------- | ----------- |
| `required` | Checks if field has value. |
| `email` | Checks if field value is email. |
| `regexp` | Checks field value against regular expression defined in `data-validation-regexp`. |
| `phone` | Checks if field value is phone number. Allows `+`, space and numbers. |
| `numeric` | Checks if field value is numeric. Allows decimals, signs, and scientific notation. |
| `number` | Checks if field value is number. |
| `name` | Checks if field value is name, i.e. first or last name of person. |
| `street` | Checks if field value is street name. |
| `housenumber` | Checks if field value is house number. |
| `postcode` | Checks if field value is post code. |
| `match` | Checks if field value matches to field referenced by `data-validation-connected-field`. |
| `unique` | Checks if field value is unique in amongst given references by `data-validation-unique-with` and `data-validation-unique-set`. |

## Usage

`iptools-jquery-validator` relies on namespaced data attributes such as

| Attribute | Description |
| --------- | ----------- |
| `data-validation` | Comma-separated list of validation schemas to apply, e.g. `data-validation="required,phone"`. See [Supported validation schemas](#supported-validation-schemas). | 
| `data-validation-trigger` | Event on which validation should be triggered. Only events emitted from actual control are considered. |
| `data-validation-regexp` | Regular expression definition for fields with `regexp` validation schema. |
| `data-validation-connected-field` | Name of the connected field for fields with `match` validation schema. |
| `data-validation-unique-set` | Namespace within which to perform unique validation. |
| `data-validation-unique-with` | IDs of controls amongst of which field should have unique value. |
| `data-errormsg-<schema>` | Error message to be displayed in case validation fails, e.g. `data-errormsg-required="Name is required."`. |

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
