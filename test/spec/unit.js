'use strict';
/* jshint undef: false */
/* global expect */
(function() {
  describe('iptValidator', function() {

    var config = {
      errorClass: 'test'
    };
    var pluginName = 'plugin_iptValidator';
    var object = null;

    describe('init', function() {

      beforeEach(function() {
        object = $('form').iptValidator(config);
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to construct object', function() {
        return expect(object).to.be.an.object;
      });

      it('expected to set errorClass to ' + config.errorClass, function() {
        return expect(object.data(pluginName).settings.errorClass).to.equal(config.errorClass);
      });

    });

    describe('_isEmpty', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return false', function() {
        return expect(object.data(pluginName)._isEmpty('test')).to.not.be.ok;
      });

      it('expected to return true', function() {
        return expect(object.data(pluginName)._isEmpty(' ')).to.be.ok;
      });

    });

    describe('_isValidEmail', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return false on single string', function() {
        return expect(object.data(pluginName)._isValidEmail('test')).to.not.be.ok;
      });

      it('expected to return false on joint string with @ sign', function() {
        return expect(object.data(pluginName)._isValidEmail('test@something')).to.not.be.ok;
      });

      it('expected to return true on regular email', function() {
        return expect(object.data(pluginName)._isValidEmail('test@test.de')).to.be.ok;
      });

      it('expected to return true on Gmail-style +-formatted email', function() {
        return expect(object.data(pluginName)._isValidEmail('test+filter@test.com')).to.be.ok;
      });

      it('expected to return true on 4-char TLD', function() {
        return expect(object.data(pluginName)._isValidEmail('test@test.info')).to.be.ok;
      });

      it('expected to return true on .international TLD', function() {
        return expect(object.data(pluginName)._isValidEmail('test@test.international')).to.be.ok;
      });

      it('expected to return true on dotted username', function() {
        return expect(object.data(pluginName)._isValidEmail('test.of.dotted.notation@test.international')).to.be.ok;
      });

      it('expected to return true on subdomain', function() {
        return expect(object.data(pluginName)._isValidEmail('test.of.dotted.notation@subsubdomain.subdomain.test.international')).to.be.ok;
      });

    });

    describe('_isValidPhone', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return false', function() {
        return expect(object.data(pluginName)._isValidPhone('Test')).to.not.be.ok;
      });

      it('expected to return true', function() {
        return expect(object.data(pluginName)._isValidPhone('+49 211 / 123123 - 0')).to.be.ok;
      });

    });

    describe('_isValidPostcode', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return false', function() {
        return expect(object.data(pluginName)._isValidPostcode('-')).to.not.be.ok;
      });

      it('expected to return true', function() {
        return expect(object.data(pluginName)._isValidPostcode('DE123 - 56')).to.be.ok;
      });

    });

    describe('_isValidNumeric', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return false', function() {
        return expect(object.data(pluginName)._isValidNumeric('Test')).to.not.be.ok;
      });

      it('expected to return true', function() {
        return expect(object.data(pluginName)._isValidNumeric('10.00')).to.be.ok;
      });

    });

  });
})();
