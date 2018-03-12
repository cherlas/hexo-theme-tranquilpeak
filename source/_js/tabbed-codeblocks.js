(function($) {
  'use strict';

  // Animate tabs of tabbed code blocks

  /**
   * TabbedCodeBlock
   * @param {String} elems
   * @constructor
   */
  var TabbedCodeBlock = function(elems) {
    this.$jsFixedContent = $(elems);
    this.$table = this.$jsFixedContent.find('.tabs-content');
  };

  TabbedCodeBlock.prototype = {
    /**
     * Run TabbedCodeBlock feature
     * @return {void}
     */
    run: function() {
      var self = this;
      self.$jsFixedContent.find('.tab').click(function() {
        var $codeblock = $(this).parent().parent().parent();
        var $tabsContent = $codeblock.find('.tabs-content').children('pre, .highlight');
        // remove `active` css class on all tabs
        $(this).siblings().removeClass('active');
        // add `active` css class on the clicked tab
        $(this).addClass('active');
        // hide all tab contents
        $tabsContent.hide();
        // show only the right one
        $tabsContent.eq($(this).index()).show()
        self.resize();
      });
      this.resize();
      $(window).resize(function() {
        self.resize();
      });
    },

    /**
     * Resize codeblocks
     * @return {void}
     */
    resize: function() {
      var self = this;
      self.$table.find('figure').each(function() {
        var code = $(this).find('td.code');
        var windowWidth = $(window).width();
        var gutter = $(this).find('.gutter');
        var gutterWidth = gutter.outerWidth(); // always 15px;
        var paddingLeft = parseInt(code.css('padding-left').substr(0, 2), 10);
        var paddingRight = parseInt(code.css('padding-right').substr(0, 2), 10);

        if (windowWidth < 768 || gutter.length <= 0) {
          gutterWidth = 0;
        }
        var width = self.$table.width() - gutterWidth - paddingRight - paddingLeft;
        code.find('pre').css('width', width);
      });
    }
  };

  $(document).ready(function() {
    var tabbedCodeBlocks = new TabbedCodeBlock('.codeblock--tabbed');
    tabbedCodeBlocks.run();
  });
})(jQuery);
