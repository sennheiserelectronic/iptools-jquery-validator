'use strict';
/* jshint undef: false */
(function() {
  describe('iptValidator', function() {

    var config = {
      errorClass: 'test'
    };

    var pluginName = 'plugin_iptValidator';

    var object = null;

    describe('init', function() {

      beforeEach(function() {
        object = $('input').iptValidator(config);
      });

      it('expected to construct object', function() {
        return expect(object).to.be.an.object;
      });

      it('expected to set errorClass to ' + config.errorClass, function() {
        return expect(object.data(pluginName).settings.errorClass).to.equal(config.errorClass);
      });

    });

    describe('destroy', function() {

      beforeEach(function() {
        object = $('input').iptValidator();
      });

      it('expected to remove data', function() {
        object.data(pluginName).destroy();
        return expect(object.data(pluginName)).to.not.be.ok;
      });

    });

  });
})();
