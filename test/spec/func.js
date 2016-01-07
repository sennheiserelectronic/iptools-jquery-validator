'use strict';
/* jshint undef: false */
(function() {
  describe('iptValidator', function() {

    var wipeTargetClass = 'some-other-error-container';
    var config = {
      errorClass: 'test-error',
      wipeTargets: '.' + wipeTargetClass
    };
    var pluginName = 'plugin_iptValidator';
    var object = null;

    describe('wipe', function() {

      beforeEach(function() {
        $('<div>').addClass(wipeTargetClass).appendTo('form');
        object = $('form').iptValidator(config);
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      context('when called explicitly', function() {
        it('expected to remove wipe targets on validation', function() {
          object.data(pluginName).wipe();
          return expect(object.find(config.wipeTargets)).to.have.length(0);
        });
      });

      context('when submitted', function() {
        it('expected to remove wipe targets on validation', function() {
          object.submit();
          return expect($(config.wipeTargets)).to.have.length(0);
        });
      });

      context('when field is changed', function() {
        it('expected to remove wipe targets on validation', function() {
          object.find('input').trigger('change');
          return expect($(config.wipeTargets)).to.have.length(0);
        });
      });

    });

    describe('destroy', function() {

      beforeEach(function() {
        object = $('form').iptValidator(config);
      });

      it('expected to remove data', function() {
        object.data(pluginName).destroy();
        return expect(object.data(pluginName)).to.not.be.ok;
      });

    });

    describe('_isMatching', function() {

      beforeEach(function() {
        object = $('form').iptValidator(config);
      });

      afterEach(function() {
        object.find('input[type=email]').val('');
        object.data(pluginName)._removeAllPublishedErrors();
        object.data(pluginName).destroy();
      });

      context('when email field is different from confirmation email field', function() {

        it('expected to render error', function() {
          object.find('input[name=email]').val('no_reply@interactive-pioneers.de').trigger('change');
          var expectation = object.find('.' + config.errorClass).text();
          return expect(expectation).to.include('Email addresses are not matching');
        });

      });

      context('when email field matches confirmation email field', function() {

        it('expected to not render error', function() {
          var email = 'no_reply@interactive-pioneers.de';
          object.find('input[name=email]').val(email);
          object.find('input[name=email_confirmation]').val(email).trigger('change');
          var expectation = object.find('.' + config.errorClass).text();
          return expect(expectation).to.not.include('Email addresses are not matching');
        });

      });

      context('when match error is fixed on related field', function() {

        it('expected to remove rendered match errors', function() {
          var email = 'no_reply@interactive-pioneers.de';
          object.find('input[name=email_confirmation]').val(email).trigger('change');
          object.find('input[name=email]').val(email).trigger('change');
          var expectation = object.find('.' + config.errorClass).text();
          return expect(expectation).to.not.include('Email addresses are not matching');
        });

      });

    });

  });
})();
