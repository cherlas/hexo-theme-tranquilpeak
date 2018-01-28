/* eslint-disable brace-style */
(function($) {
  'use strict';

  /**
   * fix table content
   * https://github.com/jeremychurch/FixedContent.js
   */

  /**
   * FixContent
   * @constructor
   */
  var FixContent = function() {
    this.$jsFixedContent = $('.toc.js-fixedContent');
    this.lastScroll = 0;
    this.contentOffset = 0;
    this.options = {
      marginTop: 65,
      minWidth: 767
    };
  };

  FixContent.prototype = {
    /**
     * Run FixContent feature
     * @return {void}
     */
    run: function() {
      var self = this;

      if (this.$jsFixedContent.length > 0) {
        $(window).resize(function() {
          self.setContentWidth();
        });
        if ($(window).innerWidth() >= this.options.minWidth) {
          $(window).scroll(function() {
            self.fixedContent();
            self.setContentPosition();
          });
        }
      }
    },

    fixedContent: function() {
      this.setContentPosition();
    },

    setContentPosition: function() {
      var self = this;
      var contentHeight = this.getContentHeight();
      if (self.contentOffset === 0) {
        self.contentOffset = self.getContentOffset();
      }
      if ($(window).innerHeight() > (contentHeight + this.options.marginTop + self.contentOffset)) {
        if ($(window).scrollTop() >= (self.contentOffset - this.options.marginTop)) {
          this.$jsFixedContent.css({
            position: 'fixed',
            top: self.options.marginTop
          });
          if (this.lastScroll === 0) {
            self.lastScroll = $(window).scrollTop();
          }
        } else if ($(window).scrollTop() <= self.lastScroll) {
          this.$jsFixedContent.css({
            position: 'static',
            top: ''
          });
          self.lastScroll = 0;
        }
      }
    },

    setContentWidth: function() {
      var parentWidth = this.$jsFixedContent.parent().innerWidth();
      this.$jsFixedContent.css('width', parentWidth);
    },

    getContentOffset: function() {
      return this.$jsFixedContent.offset().top;
    },

    getContentHeight: function() {
      return this.$jsFixedContent.outerHeight();
    }
  };

  $(document).ready(function() {
    var fixContent = new FixContent();
    fixContent.run();
  });
})(jQuery);
