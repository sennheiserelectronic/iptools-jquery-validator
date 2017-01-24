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

      it('expected to return false on float', function() {
        return expect(object.data(pluginName)._isValidNumber(2.343594)).to.not.be.ok;
      });

      it('expected to return false on float as string', function() {
        return expect(object.data(pluginName)._isValidNumber('2.343594')).to.not.be.ok;
      });

      it('expected to return false on E notation', function() {
        return expect(object.data(pluginName)._isValidNumber('2.343594e+44')).to.not.be.ok;
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

    describe('_isValidName', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return true on two space-separated words', function() {
        return expect(object.data(pluginName)._isValidName('Iptools Validator')).to.be.ok;
      });

      it('expected to return true on single string', function() {
        return expect(object.data(pluginName)._isValidName('Validator')).to.be.ok;
      });

      // FIXME: should return false if only number given.
      xit('expected to return false on number as string', function() {
        return expect(object.data(pluginName)._isValidName('4835894954')).to.not.be.ok;
      });

      context('expected to return false on string with special character', function() {

        it('@', function() {
          return expect(object.data(pluginName)._isValidName('pioneers@work')).to.not.be.ok;
        });

        it('<', function() {
          return expect(object.data(pluginName)._isValidName('pioneers<work')).to.not.be.ok;
        });

        it('>', function() {
          return expect(object.data(pluginName)._isValidName('pioneer>work')).to.not.be.ok;
        });

        it('%', function() {
          return expect(object.data(pluginName)._isValidName('pioneers%work')).to.not.be.ok;
        });

        it('*', function() {
          return expect(object.data(pluginName)._isValidName('pioneer*')).to.not.be.ok;
        });

        it('#', function() {
          return expect(object.data(pluginName)._isValidName('#pioneer')).to.not.be.ok;
        });

        it('[', function() {
          return expect(object.data(pluginName)._isValidName('pioneer[')).to.not.be.ok;
        });

        it(']', function() {
          return expect(object.data(pluginName)._isValidName('pioneer]')).to.not.be.ok;
        });

        it('{', function() {
          return expect(object.data(pluginName)._isValidName('pioneer{')).to.not.be.ok;
        });

        it('}', function() {
          return expect(object.data(pluginName)._isValidName('pioneer}')).to.not.be.ok;
        });

        it('§', function() {
          return expect(object.data(pluginName)._isValidName('§ pioneer')).to.not.be.ok;
        });

        it(',', function() {
          return expect(object.data(pluginName)._isValidName('Pioneers,Interactive')).to.not.be.ok;
        });

        it('$', function() {
          return expect(object.data(pluginName)._isValidName('$Pioneer')).to.not.be.ok;
        });

        it('"', function() {
          return expect(object.data(pluginName)._isValidName('"Pioneer"')).to.not.be.ok;
        });

        it('|', function() {
          return expect(object.data(pluginName)._isValidName('PioneerToo|s')).to.not.be.ok;
        });

      });

    });

    describe('_isValidStreet', function() {

      beforeEach(function() {
        object = $('form').iptValidator();
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to return true on two space-separated words', function() {
        return expect(object.data(pluginName)._isValidStreet('Super Highway')).to.be.ok;
      });

      it('expected to return true on single word', function() {
        return expect(object.data(pluginName)._isValidStreet('Friedensallee')).to.be.ok;
      });

      it('expected to return true on single word with number', function() {
        return expect(object.data(pluginName)._isValidStreet('Belvedereallee 5')).to.be.ok;
      });

      context('expected to return true on string with (special) character(s)', function() {

        it('ß', function() {
          return expect(object.data(pluginName)._isValidStreet('Meßberg')).to.be.ok;
        });

        it('Ü', function() {
          return expect(object.data(pluginName)._isValidStreet('Überseequartier')).to.be.ok;
        });

        it('ü', function() {
          return expect(object.data(pluginName)._isValidStreet('Neumühlen')).to.be.ok;
        });

        it('Öö', function() {
          return expect(object.data(pluginName)._isValidStreet('Övelgönne')).to.be.ok;
        });

        it('ä', function() {
          return expect(object.data(pluginName)._isValidStreet('HafenCity Universität')).to.be.ok;
        });

        it('Ä', function() {
          return expect(object.data(pluginName)._isValidStreet('HAFENCITY UNIVERSITÄT')).to.be.ok;
        });

        it('&', function() {
          return expect(object.data(pluginName)._isValidStreet('Planten & Blomen')).to.be.ok;
        });

        it('"', function() {
          return expect(object.data(pluginName)._isValidStreet('"Planten und Blomen"')).to.be.ok;
        });

        it(',', function() {
          return expect(object.data(pluginName)._isValidStreet('Ballindamm, Jungfernstieg')).to.be.ok;
        });

        it('.-', function() {
          return expect(object.data(pluginName)._isValidStreet('Hartwig-Hesse-Str. 3')).to.be.ok;
        });

        it('\'', function() {
          return expect(object.data(pluginName)._isValidStreet('Docklands \'Fischereihafen\'')).to.be.ok;
        });

      });

    });


  });
})();
