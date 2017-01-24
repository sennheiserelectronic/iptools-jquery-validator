(function($, window, document, undefined) {

  'use strict';

  /*
   * Plugin UID.
   *
   * @type String.
   */
  var pluginName = 'iptValidator';

  var dataAttr = {
    connectedField: 'validation-connected-field',
    errorClassSubscribers: 'validation-error-class-subscribers',
    regExp: 'validation-regexp',
    uniqueWith: 'validation-unique-with',
    uniqueSet: 'validation-unique-set',
    trigger: 'validation-trigger',
    skip: 'validation-skip',
    skipScope: 'validation-skip-scope',
    trim: 'validation-trim'
  };

  /*
   * Default options.
   *
   * @type Object.
   *
   * {int} animationDuration - in ms.
   * {string} boxAnimationMode - default (uses show/hide methods), fade, slide.
   * {string} errorClass - class to be added to erroneous fields, error message and and error class subscribers.
   * {string} errorMsgBoxID - ID of element, that should hold the error messages (errorPublishingMode = insertInto).
   * {string} errorPublishingMode - none, appendToParent, prependToParent, insertAfter, insertBefore, insertInto.
   * {boolean} stopOnRequired - stop validation process on required error.
   * {boolean} validateOnSubmit - trigger validation on form submission.
   * {string} validateOnCustomEvent - custom event that should trigger validation.
   * {string} wipeTargets - 3rd party elements (e.g. errors) on page that need to be removed on validation.
   */
  var defaults = {
    animationDuration: 500,
    boxAnimationMode: 'default',
    errorClass: 'error',
    errorMsgBoxID: null,
    errorPublishingMode: 'appendToParent',
    stopOnRequired: false,
    validateOnSubmit: true,
    validateOnCustomEvent: '',
    wipeTargets: null
  };

  /**
   * IPTValidator
   * @constructor
   * @param {Object} element - jQuery element
   * @param {Object} options - plugin options
   */
  function IPTValidator(element, options) {

    this.element = element;
    this.$element = $(element);
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this._errors = [];
    this._addEventListeners();

  }

  IPTValidator.prototype = {

    /**
     * Checks if string is empty / contains nothing or only whitespace.
     *
     * @param {string} str
     * @returns {boolean} true if string is empty, false otherwise
     */
    _isEmpty: function(str) {
      return str.replace(' ', '').length === 0;
    },

    /**
     * Determine if field is filled in or considered empty.
     * Input text fields have to contain a string value to be considered as filled in.
     * Checkbox fields have to be checked to be considered as filled in.
     *
     * @param {jQuery} $field - jQuery element to be considered for validation.
     * @returns {boolean} true if element is filled in, false otherwise.
     */
    _isFilled: function($field) {

      var type = $field.prop('type');
      if (type === 'checkbox') {
        return $field.prop('checked');
      } else {
        return !this._isEmpty($field.val());
      }

    },

    /**
     * Validate against regular expression.
     *
     * @param {jQuery} $field - field to be validated
     * @param {string} value - value to be tested
     * @returns {boolean} true if regexp matches, false otherwise
     */
    _matchesRexExp: function($field, value) {
      var regExp = new RegExp($field.data(dataAttr.regExp));
      return regExp.test(value);
    },

    /**
     * Validate email.
     *
     * @param {string} str
     * @returns {boolean} true if string is valid email address, false otherwise
     */
    _isValidEmail: function(str) {
      return /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i.test(str);
    },

    /**
     * Validate phone number.
     *
     * @param {string} str
     * @returns {boolean} true if string is valid phone number, false otherwise
     */
    _isValidPhone: function(str) {
      return /^(\+)?([\/\d-\s]+)$/.test(str);
    },

    /**
     * Validate numeric.
     *
     * Allows decimals, signs, and scientific notation.
     *
     * @param {string} str
     * @returns {boolean} true if string is numeric, false otherwise
     */
    _isValidNumeric: function(str) {
      return /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(str);
    },

    /**
     * Validate number.
     *
     * Checks if a string consists of numbers only.
     *
     * @param {string} str
     * @returns {boolean} true if string is numeric, false otherwise
     */
    _isValidNumber: function(str) {
      return /^\d+$/.test(str);
    },

    /**
     * Validate name.
     *
     * Name represents first or last name of a person.
     *
     * @param {string} str
     * @returns {boolean} true if string is correctly formatted name, false otherwise
     */
    _isValidName: function(str) {
      return /^([^<>|%$\;:,@\"§\{\[\]\}\?\*#]+)$/.test(str);
    },

    /**
     * Validate street name.
     *
     * @param {string} str
     * @returns {boolean} true if string is correctly formatted street name, false otherwise
     */
    _isValidStreet: function(str) {
      return /^([\w\däöüÜÖÄß\s\/\&\",\.\'-]+)$/.test(str);
    },

    /**
     * Validate house number.
     *
     * @param {string} str
     * @returns {boolean} true if string is correctly formatted house number, false otherwise
     */
    _isValidHouseNumber: function(str) {
      return /^([\w\d-\/\s]+)$/.test(str);
    },

    /**
     * Validate postcode.
     *
     * @param {string} str
     * @returns {boolean} true if postcode is valid postcode, false otherwise.
     */
    _isValidPostcode: function(str) {
      return /^[A-Za-z0-9][A-Za-z0-9\-\s]{0,10}[A-Za-z0-9]$/i.test(str);
    },

    /**
     * Determine if field value is unique.
     *
     * @param {jQuery} $field - jQuery element to be considered for validation
     * @returns {boolean} true if element's value is unique, false otherwise
     */
    _isUnique: function($field) {

      var self = this;

      var unique = true;
      var value = $field.val();
      var memberFields = [];

      var references = $field.data(dataAttr.uniqueWith);
      if (references) {
        references = references.split(',');
        for (var i = 0, l = references.length, selector; i < l; i++) {
          selector = '#' + references[i];
          value += $(selector).val();
          memberFields.push(selector);
        }
      }
      var set = $field.data(dataAttr.uniqueSet);
      var $fields = this.$element
        .find('input[type=text][data-' + dataAttr.uniqueSet +  '=' + set + ']')
        .not($field)
        .not(memberFields.join(' '));
      $fields.each(function() {
        var subValue = self._getElementValue($(this));
        var subReferences = $(this).data(dataAttr.uniqueWith);
        if (subReferences) {
          subReferences = subReferences.split(',');
          for (var i = 0, l = subReferences.length; i < l; i++) {
            subValue += $('#' + subReferences[i]).val();
          }
        }
        if (subValue === value) {
          unique = false;
        }
      });
      return unique;
    },

    /**
     * Determine if two inputs have equal values.
     *
     * @param {jQuery} $field - jQuery element to be considered for validation
     * @param {string} reference - string reference to the name of the input to compare (name in brackets)
     * @returns {boolean} true if input's value strict-equals to value of referenced input
     */
    _isMatching: function($field, reference) {
      return $field.val() === this._getElementFromValidationReference(reference).val();
    },

    /**
     * Retrieve input element from validation reference.
     *
     * @param {string} reference - string reference to the name of the input from match validation schema
     * @param {jQuery} jQuery element
     */
    _getElementFromValidationReference: function(reference) {
      var fieldName = reference.substring(reference.indexOf('[') + 1, reference.lastIndexOf(']'));
      return this.$element.find('*[name="' + fieldName + '"]');
    },

    /**
     * Retrieve field value.
     * Determine if value needs to be returned trimmed.
     *
     * @param {jQuery} $field - jQuery element
     * @returns {string} value of the jQuery element
     */
    _getElementValue: function($field) {
      return $field.data(dataAttr.trim) === 'true' ? $.trim($field.val()) : $field.val();
    },

    /**
     * Get all child elements that have a data-validation attribute.
     *
     * @returns {jQuery} jQuery object with elements that should be validated
     */
    _getValidationElements: function() {
      return this.$element.find('*[data-validation]');
    },

    /**
     * Publish errors.
     *
     * @param {Object} field - jQuery element
     * @param {string} message - error message
     * @returns {undefined}
     */
    _publishError: function(field, message) {

      var $field = $(field);
      var $subscribers = $($(field).data(dataAttr.errorClassSubscribers));
      $field.add($subscribers).addClass(this.settings.errorClass);
      var $div = $('<div/>').addClass(this.settings.errorClass)
                            .text(message)
                            .attr('data-' + dataAttr.connectedField, $field.attr('name'))
                            .hide();

      switch (this.settings.errorPublishingMode) {
        case 'insertInto':
          if (this.settings.errorMsgBoxID !== null) {
            var $target = $('#' + this.settings.errorMsgBoxID);
            if ($target.length > 0) {
              $div.appendTo($target);
              if ($target.is(':hidden')) {
                switch (this.settings.boxAnimationMode) {
                  case 'fade':
                    $target
                      .delay(5)
                      .css('opacity', 0)
                      .slideDown(this.settings.animationDuration)
                      .animate({opacity: 1}, this.settings.animationDuration);
                    break;
                  case 'slide':
                    $target.delay(5).slideDown(this.settings.animationDuration);
                    break;
                  default:
                    $target.delay(5).show(this.settings.animationDuration);
                    break;
                }
              }
            }
          }
          break;
        case 'appendToParent':
          $div.appendTo($field.parent());
          break;
        case 'prependToParent':
          $div.prependTo($field.parent());
          break;
        case 'insertBefore':
          $div.insertBefore($field);
          break;
        case 'insertAfter':
          $div.insertAfter($field);
          break;
      }

      $div.fadeIn(this.settings.animationDuration);

    },

    /**
     * Remove published error messages and error classes connected to a specified field.
     *
     * @param {Object} field - jQuery element
     * @returns {undefined}
     */
    _removePublishedErrors: function(field) {

      var $field = $(field);
      var $subscribers = $($(field).data(dataAttr.errorClassSubscribers));
      $field.add($subscribers).removeClass(this.settings.errorClass);

      var fieldName = $field.attr('name');
      var selector = '*[data-' + dataAttr.connectedField + '="' + fieldName + '"]';
      this.$element.find(selector).remove();
      if (this.settings.errorMsgBoxID !== null) {
        $('#' + this.settings.errorMsgBoxID)
          .find(selector)
          .remove();
      }

    },

    /**
     * Remove all error messages and error classes from this form.
     *
     * @returns {undefined}
     */
    _removeAllPublishedErrors: function() {

      var self = this;
      var $fields = this._getValidationElements();
      $fields
        .removeClass(this.settings.errorClass)
        .each(function() {
          $($(this).data(dataAttr.errorClassSubscribers)).removeClass(self.settings.errorClass);
        });
      this.$element
        .find('*[data-' + dataAttr.connectedField + ']')
        .remove();
      if (this.settings.errorMsgBoxID !== null) {
        $('#' + this.settings.errorMsgBoxID).hide().empty();
      }

    },

    /**
     * Hides the message container if it is empty.
     *
     * @returns {undefined}
     */
    _hideMsgBoxIfEmpty: function() {

      var $box = $('#' + this.settings.errorMsgBoxID);
      if ($box.is(':empty')) {
        $box.hide();
      }

    },

    /**
     * Return array with validation errors.
     *
     * @returns {Array} Array with current errors
     */
    getErrors: function() {
      return this._errors;
    },

    /**
     * Clear error array.
     *
     * @returns {undefined}
     */
    _clearErrors: function() {
      this._errors = [];
    },

    /**
     * Determine if field should be validated.
     *
     * @param {Object} field - jQuery element
     * @param {string} validationType - type that should be validated against
     * @returns {boolean} true if field should be validated, false otherwise
     */
    _shallValidate: function(field, validationType) {

      if (this._isSkippable(field, validationType)) {
        return false;
      }
      var $field = $(field);
      var required = $field.data('validation').indexOf('required') !== -1;
      var value = $field.val();
      return required || (value && value.length > 0);

    },

    /**
     * Determine if field should be skipped.
     *
     * @param {Object} field - jQuery element
     * @param {string} validationType - type that should be validated against
     * @returns {boolean} true if field should be skipped, false otherwise
     */
    _isSkippable: function(field, validationType) {

      if ($(field).prop('disabled')) {
        return true;
      }
      var skippers = this.$element.find('*[data-' + dataAttr.skip + ']:selected');
      if (skippers.length > 0) {
        for (var i = 0, l = skippers.length, validationTypes, scope, $skipper; i < l; i++) {
          $skipper = $(skippers[i]);
          scope = $skipper.data(dataAttr.skipScope);
          if (typeof scope === undefined || $(field).parents('#' + scope).length === 0) {
            continue;
          }
          validationTypes = $skipper.data(dataAttr.skip)
          if (validationTypes) {
            validationTypes = validationTypes.split(',');
            for (var j = 0, k = validationTypes.length; j < k; j++) {
              if (validationTypes[j] === validationType) {
                return true;
              }
            }
          }
        }
      }
      return false;

    },

    /**
     * Validate a single form field.
     *
     * @returns {boolean} true if validation passes, false if validation fails
     */
    _validateField: function(field) {

      var self = this;

      if (self.settings.wipeTargets) {
        self.wipe();
      }

      var $field = $(field);
      var value = self._getElementValue($field);
      var validations = $field.data('validation').split(',');

      self._removePublishedErrors(field);

      validationIteration:
      for (var i = 0, l = validations.length, validationType; i < l; i++) {

        var ok = true;
        validationType = validations[i];

        if (validationType.indexOf('match') !== -1) {
          validationType = 'match';
        }

        if (!self._shallValidate(field, validationType)) {
          continue;
        }

        switch (validationType) {

          case 'required':
            if (!self._isFilled($field)) {
              ok = false;
              if (self.settings.stopOnRequired) {
                break validationIteration;
              }
            }
            break;

          case 'regexp':
            if (!self._matchesRexExp($field, value)) {
              ok = false;
            }
            break;

          case 'email':
            if (!self._isValidEmail(value)) {
              ok = false;
            }
            break;

          case 'phone':
            if (!self._isValidPhone(value)) {
              ok = false;
            }
            break;

          case 'numeric':
            if (!self._isValidNumeric(value)) {
              ok = false;
            }
            break;

          case 'number':
            if (!self._isValidNumber(value)) {
              ok = false;
            }
            break;

          case 'name':
            if (!self._isValidName(value)) {
              ok = false;
            }
            break;

          case 'street':
            if (!self._isValidStreet(value)) {
              ok = false;
            }
            break;

          case 'housenumber':
            if (!self._isValidHouseNumber(value)) {
              ok = false;
            }
            break;

          case 'postcode':
            if (!self._isValidPostcode(value)) {
              ok = false;
            }
            break;

          case 'match':
            if (!self._isMatching($field, validations[i])) {
              ok = false;
            } else {
              self._removePublishedErrors(self._getElementFromValidationReference(validations[i]));
            }
            break;

          case 'unique':
            if (!self._isUnique($field)) {
              ok = false;
            }
            break;
        }

        if (!ok) {
          var msg = $field.data('errormsg-' + validationType);
          self._publishError(field, msg);
          self._errors.push({field: field, error: msg});
          break validationIteration;
        }

      }

      self._hideMsgBoxIfEmpty();

    },

    /**
     * Validate all connected form fields with data-validation attribute.
     *
     * @returns {boolean} true if validation passes, false if validation fails
     */
    validate: function() {

      var self = this;
      self._clearErrors();
      self._removeAllPublishedErrors();

      var $fields = self._getValidationElements();
      $fields.each(function() {
        self._validateField(this);
      });

      self._hideMsgBoxIfEmpty();

      return (self._errors.length === 0);

    },

    /**
     * Handle submit event.
     *
     * @param {event} event - jQuery event
     * @returns {undefined}
     */
    _handleFormSubmit: function(event) {

      var self = event.data;
      if (!self.validate()) {
        return false;
      }

    },

    /**
     * Add event listeners.
     *
     * @returns {undefined}
     */
    _addEventListeners: function() {

      var self = this;

      if (this.settings.validateOnSubmit) {
        this.$element.on('submit' + '.' + this._name, null, this, this._handleFormSubmit);
      }

      if (this.settings.validateOnCustomEvent !== '') {
        this.$element.on(this.settings.validateOnCustomEvent, function() {
          return self.validate();
        });
      }

      var $fields = this._getValidationElements();
      $fields.each(function() {
        var $this = $(this);
        if ($this.data(dataAttr.trigger) === 'change') {
          $this.on('change' + '.' + self._name, function() {
            self._validateField(this);
          });
        }
      });

    },

    /**
     * Remove any 3rd party errors.
     */
    wipe: function() {
      $(this.settings.wipeTargets).remove();
    },

    /**
     * Destroy method.
     *
     * @returns {undefined}
     */
    destroy: function() {

      this.$element.off('submit' + '.' + this._name);
      var $fields = this._getValidationElements();
      $fields.off('change' + '.' + this._name);
      this.$element.removeData('plugin_' + pluginName);

    }

  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new IPTValidator(this, options));
      }
    });
  };

})(jQuery, window, document);
