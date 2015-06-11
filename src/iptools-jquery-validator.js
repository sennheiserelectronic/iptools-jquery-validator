/*
 * jQuery data input validator plugin.
 *
 * Copyright © 2013-2015 Ain Tohvri, David Lehnen, Interactive Pioneers GmbH
 */

;(function($, window, document, undefined) {

  'use strict';

  /*
   * Plugin UID.
   *
   * @type String.
   */
  var pluginName = 'iptValidator';

  /*
   * Default options.
   *
   * @type Object.
   *
   * {boolean} triggerOnSubmit - trigger validation on form submission.
   * {boolean} stopOnRequired - stop validation process on required error.
   * {string} errorPublishingMode - appendToParent, prependToParent, insertAfterField, insertBeforeField, insertIntoTarget.
   * {string} errorMsgContainerID - id of an element, that should contain all error messages (errorPublishingMode = insertIntoTarget).
   * {string} errorClass - class to be added to erroneous fields.
   */
  var defaults = {
    triggerOnSubmit: true,
    stopOnRequired: false,
    errorPublishingMode: 'appendToParent',
    errorMsgContainerID: null,
    errorClass: 'error'
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
     * Validate email.
     *
     * @param {string} str
     * @returns {boolean} true if string is valid email address, false otherwise
     */
    _isValidEmail: function(str) {
      return /^([äöüÜÖÄßA-Za-z0-9_\-\.\+])+\@([äöüÜÖÄßA-Za-z0-9_\-\.])+\.([äöüÜÖÄßA-Za-z]{2,4})$/i.test(str);
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
     * Validate postcode.
     *
     * @param {string} str
     * @returns {boolean} true if postcode is valid postcode, false otherwise.
     */
    _isValidPostcode: function(str) {
      return /^[A-Za-z0-9][A-Za-z0-9\-\s]{0,10}[A-Za-z0-9]$/i.test(str);
    },

    /**
     * Validate numeric.
     *
     * Numeric is a string representing a number with spaces allowed.
     *
     * @param {string} str
     * @returns {boolean} true if string is numeric, false otherwise
     */
    _isValidNumeric: function(str) {
      return /^([\d\s]+)$/.test(str);
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
     * Determine if field value is unique.
     *
     * @param {jQuery} $field - jQuery element to be considered for validation
     * @returns {boolean} true if element's value is unique, false otherwise
     */
    _isUnique: function($field) {

      var unique = true;
      var references = $field.attr('data-validation-unique-with').split(',');
      var value = $field.val();
      var memberFields = [];
      for (var i = 0, l = references.length, selector; i < l; i++) {
        selector = '#' + references[i];
        value += $(selector).val();
        memberFields.push(selector);
      }
      var set = $field.attr('data-validation-unique-set');
      var $fields = this.$element.find('input[type=text][data-validation-unique-set=' + set + ']').not($field).not(memberFields.join(' '));
      $fields.each(function() {
        var subReferences = $(this).attr('data-validation-unique-with').split(',');
        var subValue = this._getElementValue($(this));
        for (var i = 0, l = subReferences.length; i < l; i++) {
          subValue += $('#' + subReferences[i]).val();
        }
        if (subValue === value) {
          unique = false;
        }
      });
      return unique;

    },

    /**
     * Retrieve field value.
     * Determine if value needs to be returned trimmed.
     *
     * @param {jQuery} $field - jQuery element
     * @returns {string} value of the jQuery element
     */
    _getElementValue: function($field) {
      return $field.attr('data-validation-trim') === 'true' ? $.trim($field.val()) : $field.val();
    },

    /**
     * Get all child elements that have a data-validation attribute.
     *
     * @returns {jQuery} jQuery object with elements that should be validated
     */
    _getValidationElements: function() {
      return this.$element.find('*[data-validation]:visible');
    },

    /**
     * Publish errors.
     *
     * @param {Object} field - jQuery element
     * @param {string} message - error message
     * @returns {undefined}
     */
    _publishError: function(field, message) {

      $(field).addClass(this.settings.errorClass).parent().addClass(this.settings.errorClass);
      var $span = $('<span></span>').addClass(this.settings.errorClass).text(message);

      switch (this.settings.errorPublishingMode) {
        case 'insertIntoTarget':
          var $target = ('#' + this.settings.errorMsgContainerID);
          if ($target) {
            $target.append($span);
          }
          break;
        case 'appendToParent':
          $(field).parent().append($span);
          break;
        case 'prependToParent':
          $(field).parent().prepend($span);
          break;
        case 'insertBeforeField':
          $(field).before($span);
          break;
        case 'insertAfterField':
          $(field).after($span);
          break;
      }

    },

    /**
     * Remove all errors messages and error classes set by this plugin instance.
     *
     * @returns {undefined}
     */
    _removeErrors: function() {

      var $fields = this._getValidationElements();
      $fields.removeClass(this.settings.errorClass).parent().removeClass(this.settings.errorClass);
      this.$element.find('span.' + this.settings.errorClass).remove();

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
    clearErrors: function() {
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
      var required = $field.attr('data-validation').indexOf('required') !== -1;
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
      var skipperIdentAttribute = 'data-validation-skip';
      var skipperScopeAttribute = 'data-validation-skip-scope';
      var skippers = this.$element.find('*[' + skipperIdentAttribute + ']:selected');
      if (skippers.length > 0) {
        for (var i = 0, l = skippers.length, validationTypes, scope, $skipper; i < l; i++) {
          $skipper = $(skippers[i]);
          scope = $skipper.attr(skipperScopeAttribute);
          if (typeof scope === undefined || $(field).parents('#' + scope).length === 0) {
            continue;
          }
          validationTypes = $skipper.attr(skipperIdentAttribute).split(',');
          for (var j = 0, k = validationTypes.length; j < k; j++) {
            if (validationTypes[j] === validationType) {
              return true;
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
    validateField: function(field) {

      var self = this;

      var $field = $(field);
      var value = self._getElementValue($field);
      var validations = $field.data('validation').split(',');

      validationIteration:
      for (var i = 0, l = validations.length, validationType; i < l; i++) {

        var ok = true;
        validationType = validations[i];

        if (validationType.indexOf('password-match') !== -1) {
          validationType = 'password-match[pw2]';
        }

        if (!self._shallValidate(this, validationType)) {
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

          case 'postcode':
            if (!self._isValidPostcode(value)) {
              ok = false;
            }
            break;

          case 'numeric':
            if (!self._isValidNumeric(value)) {
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

          case 'password-match':
            var fieldName = validations[i].substring(validations[i].indexOf('[') + 1, validations[i].lastIndexOf(']'));
            var $matchControl = self.$element.find('input[name="' + fieldName + '"]');
            if ($matchControl.length === 0 || $field.val() !== $matchControl.val()) {
              ok = false;
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
        }

      }

    },

    /**
     * Validate all connected form fields with data-validation attribute.
     *
     * @returns {boolean} true if validation passes, false if validation fails
     */
    validate: function() {

      var self = this;
      self._clearErrors();
      self._removeErrors();

      var $fields = self._getValidationElements();
      $fields.each(function() {
        self._validateField(this);
      });

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
      if (!self.$element.validate()) {
        event.preventDefault();
      }

    },

    /**
     * Add event listeners.
     *
     * @returns {undefined}
     */
    _addEventListeners: function() {

      var self = this;

      if (this.settings.triggerOnSubmit) {
        this.$element.on('submit' + '.' + this._name, null, this, this._handleFormSubmit);
      }

      var $fields = this._getValidationElements();
      $fields.each(function() {
        var $this = $(this);
        if ($this.data('validation-trigger') === 'change') {
          $this.on('change' + '.' + self._name, function() {
            self._validateField(this);
          });
        }
      });

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
