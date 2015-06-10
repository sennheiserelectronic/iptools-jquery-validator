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
   * {Boolean} stopOnRequired Stop validation process on required error.
   * {String} errorClass Class name of the error to inject to erroneous field.
   */
  var defaults = {
    stopOnRequired: false,
    errorClass: 'error'
  };

  function IPTValidator(element, options) {

    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

  }

  IPTValidator.prototype = {

    _isEmpty: function(str) {
      return str.replace(' ', '').length === 0;
    },

    _isValidEmail: function(str) {
      return /^([äöüÜÖÄßA-Za-z0-9_\-\.\+])+\@([äöüÜÖÄßA-Za-z0-9_\-\.])+\.([äöüÜÖÄßA-Za-z]{2,4})$/i.test(str);
    },

    _isValidPhone: function(str) {
      return /^(\+)?([\/\d-\s]+)$/.test(str);
    },

    /**
     * Validate postcode.
     *
     * NB! Currently only validates against German postcode.
     *
     * @param {String} str
     * @returns {Boolean} True if postcode is valid German postcode, false otherwise.
     */
    _isValidPostcode: function(str) {
      return /^[\d]{5}$/.test(str);
    },

    /**
     * Validate numeric.
     *
     * Numeric is a string representing a number with spaces allowed.
     *
     * @param {String} str
     * @returns {Boolean} True if string is numeric, false otherwise.
     */
    _isValidNumeric: function(str) {
      return /^([\d\s]+)$/.test(str);
    },

    /**
     * Validate name.
     *
     * Name represents forename or surname of a person.
     *
     * @param {String} str
     * @returns {Boolean} True if string is correctly formatted name, false otherwise.
     */
    _isValidName: function(str) {
      return /^([^<>|%$\;:,@\"§\{\[\]\}\?\*#]+)$/.test(str);
    },

    /**
     * Validate street name.
     *
     * @param {String} str
     * @returns {Boolean} True if string is correctly formatted street name, false otherwise.
     */
    _isValidStreet: function(str) {
      return /^([\w\däöüÜÖÄß\s\/\&\",\.\'-]+)$/.test(str);
    },

    /**
     * Validate house number.
     *
     * @param {String} str
     * @returns {Boolean} True if string is correctly formatted house number, false otherwise.
     */
    _isValidHouseNumber: function(str) {
      return /^([\w\d-\/\s]+)$/.test(str);
    },

    /**
     * Determine if field value is unique.
     *
     * @param {jQuery} $field jQuery element to be considered for validation.
     * @returns {Boolean} true if element's value is unique, false otherwise.
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
      var $fields = this.$element.find('input[type=text][data-validation-unique-set=' + set + ']')
        .not($field).not(memberFields.join(' '));
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
     * @param {jQuery} $field jQuery element.
     * @returns {String} value of the jQuery element.
     */
    _getElementValue: function($field) {
      return $field.attr('data-validation-trim') === 'true' ? $.trim($field.val()) : $field.val();
    },

    /**
     * Determine if field is filled in or considered empty.
     * Input text fields have to contain a string value to be considered as filled in.
     * Checkbox fields have to be checked to be considered as filled in.
     *
     * @param {jQuery} $field jQuery element to be considered for validation.
     * @returns {Boolean} true if element is filled in, false otherwise.
     */
    _isFilled: function($field) {

      var type = $field.prop('type');
      if (type === 'checkbox') {
        return $field.prop('checked');
      } else {
        return !this._isEmpty($field.val());
      }

    },

    _publishError: function(field, message) {

      $(field).addClass(this.options.errorClass).parent().addClass(this.options.errorClass);
      var $span = $('<span></span>').addClass(this.options.errorClass).text(message);
      $(field).parent().append($span);

    },

    _cleanErrors: function() {

      var validatedElements = this.$element.find('*[data-validation]');
      validatedElements.removeClass(this.options.errorClass).parent().removeClass(this.options.errorClass);
      validatedElements.siblings('span.' + this.options.errorClass).remove();

    },

    _shallValidate: function(field, validationType) {

      if (this._isSkippable(validationType, field)) {
        return false;
      }
      var required = $(field).attr('data-validation').indexOf('required') !== -1;
      return required || ($(field).val() && $(field).val().length > 0);

    },

    _isSkippable: function(validationType, field) {

      if ($(field).attr('disabled')) {
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

    validate: function() {

      var self = this;
      self._cleanErrors();

      var validations;
      var errors = [];

      this.$element.find('*[data-validation]:visible').each(function() {
        validations = $(this).attr('data-validation').split(',');
        validationIteration:
        for (var i = 0, l = validations.length, msg, validationType; i < l; i++) {
          validationType = validations[i];
          if (validationType.indexOf('password-match') !== -1) {
            validationType = 'password-match';
          }
          if (!self._shallValidate(this, validationType)) {
            continue;
          }
          switch (validationType) {
            case 'required':
              if (!self._isFilled($(this))) {
                msg = $(this).attr('data-errormessage-required');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
                if (self.options.stopOnRequired) {
                  break validationIteration;
                }
              }
              break;
            case 'email':
              if (!self._isValidEmail(self._getElementValue($(this)))) {
                msg = $(this).attr('data-errormessage-email');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
            case 'phone':
              if (!self._isValidPhone(self._getElementValue($(this)))) {
                msg = $(this).attr('data-errormessage-phone');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
            case 'postcode':
              if (!self._isValidPostcode(self._getElementValue($(this)))) {
                msg = $(this).attr('data-errormessage-postcode');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
            case 'numeric':
              if (!self._isValidNumeric(self._getElementValue($(this)))) {
                msg = $(this).attr('data-errormessage-numeric');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
            case 'password-match':
              var fieldName = validations[i].substring(validations[i].indexOf('[') + 1, validations[i].lastIndexOf(']'));
              var $matchControl = self.$element.find('input[name="' + fieldName + '"]');
              if ($matchControl.length === 0 || $(this).val() !== $matchControl.val()) {
                msg = $(this).attr('data-errormessage-password-match');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
            case 'name':
              if (!self._isValidName(self._getElementValue($(this)))) {
                msg = $(this).attr('data-errormessage-name');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
            case 'street':
              if (!self._isValidStreet(self._getElementValue($(this)))) {
                msg = $(this).attr('data-errormessage-street');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
            case 'housenumber':
              if (!self._isValidHouseNumber(self._getElementValue($(this)))) {
                msg = $(this).attr('data-errormessage-housenumber');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
            case 'unique':
              if (!self._isUnique($(this))) {
                msg = $(this).attr('data-errormessage-unique');
                self._publishError(this, msg);
                errors.push({field: this, error: msg});
              }
              break;
          }
        }
      });

      return errors;

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
