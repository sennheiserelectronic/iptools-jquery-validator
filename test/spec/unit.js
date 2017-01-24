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
        return expect(object.data(pluginName)._isValidEmail('dotted.username@sub.subdomain.test.de')).to.be.ok;
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


    describe('_isFilled', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return true if field is filled in', function() {
        return expect(object.data(pluginName)._isFilled($('<input type="text" value="iptools validator">'))).to.be.ok;
      });

      it('expected to return true if checkbox is checked', function() {
        return expect(object.data(pluginName)._isFilled($('<input type="checkbox" checked="checked">'))).to.be.ok;
      });

      it('expected to return false if field is empty', function() {
        return expect(object.data(pluginName)._isFilled($('<input type="text" value="">'))).to.not.be.ok;
      });

      it('expected to return false if checkbox is unchecked', function() {
        return expect(object.data(pluginName)._isFilled($('<input type="checkbox">'))).to.not.be.ok;
      });

    });

    describe('_isValidNumber', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return true on numeric string', function() {
        return expect(object.data(pluginName)._isValidNumber('343434')).to.be.ok;
      });

      it('expected to return true on number', function() {
        return expect(object.data(pluginName)._isValidNumber(122332)).to.be.ok;
      });

      it('expected to return false on non-numeric string', function() {
        return expect(object.data(pluginName)._isValidNumber('a493404')).to.not.be.ok;
      });

      it('expected to return false on boolean', function() {
        return expect(object.data(pluginName)._isValidNumber(true)).to.not.be.ok;
      });

      it('expected to return false on function', function() {
        var f = function() { return true; };
        return expect(object.data(pluginName)._isValidNumber(f)).to.not.be.ok;
      });

      it('expected to return false on array', function() {
        return expect(object.data(pluginName)._isValidNumber([1212, 2332, 54])).to.not.be.ok;
      });

      it('expected to return false on object', function() {
        return expect(object.data(pluginName)._isValidNumber({number: 3232})).to.not.be.ok;
      });

    });

    describe('_isValidNumeric', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return true on numeric string', function() {
        return expect(object.data(pluginName)._isValidNumeric('343434')).to.be.ok;
      });

      it('expected to return true on number', function() {
        return expect(object.data(pluginName)._isValidNumeric(122332)).to.be.ok;
      });

      it('expected to return true on float', function() {
        return expect(object.data(pluginName)._isValidNumeric(122332.232354)).to.be.ok;
      });

      it('expected to return true on float as string', function() {
        return expect(object.data(pluginName)._isValidNumeric('1.2123434')).to.be.ok;
      });

      it('expected to return true on postive number as string', function() {
        return expect(object.data(pluginName)._isValidNumeric('+1.2123434')).to.be.ok;
      });

      it('expected to return true on negative number as string', function() {
        return expect(object.data(pluginName)._isValidNumeric('-1.2123434')).to.be.ok;
      });

      it('expected to return true on E notation as string', function() {
        return expect(object.data(pluginName)._isValidNumeric('1.212e+42')).to.be.ok;
      });

      it('expected to return false on non-numeric string', function() {
        return expect(object.data(pluginName)._isValidNumeric('a493404')).to.not.be.ok;
      });

      it('expected to return false on boolean', function() {
        return expect(object.data(pluginName)._isValidNumeric(true)).to.not.be.ok;
      });

      it('expected to return false on function', function() {
        var f = function() { return true; };
        return expect(object.data(pluginName)._isValidNumeric(f)).to.not.be.ok;
      });

      it('expected to return false on array', function() {
        return expect(object.data(pluginName)._isValidNumeric([1212, 2332, 54])).to.not.be.ok;
      });

      it('expected to return false on object', function() {
        return expect(object.data(pluginName)._isValidNumeric({number: 3232})).to.not.be.ok;
      });

    });

  });
})();
