/* eslint-disable brace-style */
(function($) {
  'use strict';

  /**
   * Toc
   * @constructor
   */
  var Toc = function() {
    this.$postContent = $('.post-content');
    this.post = $('.post');
    this.$ulToc = this.$postContent.find('ul.toc');
    this.$tableTile = this.post.find('.tableTile');
    this.$tableContent = this.post.find('.tableContent');
    this.$contentWrap = this.$postContent.find('.main-content-wrap');
    this.$contentWrapP = this.$contentWrap.find('p');
    this.tocTitle = this.$tableTile.data('message');
    this.minWidth = 768 + 75;
    this.lastScrollTop = 99999;
    this.offsetTop = 0;
    this.up = false;
  };

  Toc.prototype = {
    /**
     * Run toc feature
     * @return {void}
     */
    run: function() {
      var self = this;
      setTimeout(function() {
        self.resize();
      }, 20);

      self.offsetTop = self.$tableContent.offset().top;

      var title = '<li>' + this.tocTitle + '</li>';
      this.$ulToc.prepend(title);
      var tocContent = this.$ulToc[0];
      this.$ulToc.detach();
      this.$tableContent.prepend(tocContent);
      this.$tableContent.insertBefore(this.$postContent);
      this.$tableTile.detach();

      $(window).resize(function() {
        self.resize();
      });

      $(window).scroll(function() {
        self.scrollTableContent();
      });
    },

    /**
     * Resize toc
     * @return {void}
     */
    resize: function() {
      var self = this;
      var windowWidth = $(window).width();
      self.$tableContent.css('max-height', windowWidth);
      if (windowWidth < self.minWidth) {
        self.$tableContent.css('float', 'none');
        self.$tableContent.css('position', '');
        self.$tableContent.css('right', '');
      } else {
        var contentLeft = self.$contentWrapP.offset().left;
        var tableWidth = self.$tableContent.width();
        var contentWidth = self.$contentWrap.width();
        var contentPaddingRight = parseFloat(self.$contentWrap.css('padding-right'));
        var cssLeft = windowWidth - contentLeft - contentWidth - contentPaddingRight - tableWidth;
        self.$tableContent.css('float', 'right');
        self.$tableContent.css('right', cssLeft);
      }
    },

    scrollTableContent: function() {
      var self = this;
      var crisis = 65;
      var scrollTop = $(window).scrollTop();
      var postContentOffsetTop = self.$tableContent.offset().top;
      var result = Math.abs(Math.abs(postContentOffsetTop - scrollTop) - crisis);
      var margin = self.$contentWrap.css('margin-left');
      if (!self.up && result <= crisis) {
        self.up = true;
        self.lastScrollTop = scrollTop;
        self.lastOffsetTop = postContentOffsetTop;
        self.$tableContent.css('position', 'fixed');
        self.$contentWrap.css('margin-left', margin);
        self.$tableContent.css('top', crisis);
      }
      if (self.up && scrollTop <= self.offsetTop - crisis) {
        self.$tableContent.css('position', 'relative');
        self.$tableContent.css('top', '');
        self.$contentWrap.css('margin-left', '');
        self.up = false;
      }
    }
  };

  $(document).ready(function() {
    var toc = new Toc();
    toc.run();
  });
})(jQuery);
