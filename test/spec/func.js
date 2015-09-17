'use strict';
/* jshint undef: false */
(function() {
  describe('iptValidator', function() {

    var wipeTargetClass = 'some-other-error-container';
    var config = {
      errorClass: 'test',
      wipeTargets: '.' + wipeTargetClass
    };
    var pluginName = 'plugin_iptValidator';
    var object = null;

    describe('wipe', function() {

      console.log('>');

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

  });
})();
