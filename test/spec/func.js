'use strict';
/* jshint undef: false */
(function() {
  describe('iptValidator', function() {

    var config = {
      errorClass: 'test'
    };

    var pluginName = 'plugin_iptValidator';

    var object = null;

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
