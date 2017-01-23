'use strict';
/* jshint undef: false */
/* global expect */
(function() {
  describe('iptValidator', function() {

    var classes = {
      wipeTarget: 'some-other-error-container'
    };
    var selectors = {
      emailErrorClassSubscriber: '.email-label'
    };
    var config = {
      errorClass: 'test-error',
      wipeTargets: '.' + classes.wipeTarget
    };
    var pluginName = 'plugin_iptValidator';
    var object = null;

    describe('wipe', function() {

      beforeEach(function() {
        $('<div>').addClass(classes.wipeTarget).appendTo('form');
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

    describe('validate', function() {

      beforeEach(function() {
        object = $('form').iptValidator(config);
      });

      it('expected to return false', function() {
        return expect(object.data(pluginName).validate()).to.not.be.ok;
      });
    });

    describe('submit', function() {

      beforeEach(function() {
        object = $('form').iptValidator(config);
      });

      it('expected to return false', function() {
        var event = jQuery.Event('submit');
        event.data = object.data(pluginName);
        return expect(object.data(pluginName)._handleFormSubmit(event)).to.not.be.ok;
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

        it('expected to set error class on email field', function() {
          var $field = object.find('input[name=email]');
          $field.val('no_reply@interactive-pioneers.de').trigger('change');
          return expect($field.hasClass(config.errorClass)).to.be.ok;
        });

        it('expected to set error class on subscriber (email label)', function() {
          var $form = object;
          $form.find('input[name=email]').val('no_reply@interactive-pioneers.de').trigger('change');
          var expectation = $form.find(selectors.emailErrorClassSubscriber).hasClass(config.errorClass);
          return expect(expectation).to.be.ok;
        });

      });

      context('when email field matches confirmation email field', function() {

        it('expected to not render error', function() {
          var email = 'no_reply@interactive-pioneers.de';
          object.find('input[name=email]').val(email);
          object.find('input[name=email_confirmation]').val(email);
          object.trigger('submit');
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

        it('expected to remove error class from subscribers (email label)', function() {
          var email = 'no_reply@interactive-pioneers.de';
          object.find('input[name=email_confirmation]').val(email).trigger('change');
          object.find('input[name=email]').val(email).trigger('change');
          var expectation = object.find(selectors.emailErrorClassSubscriber).hasClass();
          return expect(expectation).to.not.be.ok;
        });

      });

    });

  });
})();
