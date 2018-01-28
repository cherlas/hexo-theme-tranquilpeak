/* eslint-disable brace-style,max-len */
(function($) {
  'use strict';

  /**
   * TableContent
   * @constructor
   */
  var TableContent = function() {
    this.$postContent = $('.post-content');
    this.post = $('.post');
    this.$ulToc = this.$postContent.find('ul.toc');
    this.$tableTile = this.post.find('.tableTile');
    this.$tableContent = this.$postContent.find('.tableContent');
    this.$contentWrap = this.$postContent.find('.main-content-wrap');
    this.$contentWrapP = this.$contentWrap.find('p');
    this.tocTitle = this.$tableTile.data('message');
    this.$contentWrapMaxWidth = parseInt(this.$contentWrap.css('max-width'), 10);
    this.lastScrollTop = 99999;
    this.offsetTop = 0;
    this.minWidth = 768;
    this.windowWidth = $(window).width();
    this.crisis = 65;
  };

  TableContent.prototype = {
    /**
     * Run toc feature
     * @return {void}
     */
    run: function() {
      var self = this;
      setTimeout(function() {
        // self.resize();
        // self.scrollTableForRefresh();
      }, 0);

      // self.offsetTop = self.$tableContent.offset().top;

      var title = '<li>' + this.tocTitle + '</li>';
      this.$ulToc.prepend(title);
      var tocContent = this.$ulToc[0];
      this.$ulToc.detach();
      this.$tableContent.prepend(tocContent);
      this.$tableContent.insertBefore(this.$contentWrap);
      this.$tableTile.detach();

      $(window).smartresize(function() {
        // self.resize();
      }, 10);

      var didScroll = false;
      // $(window).scroll(function() {
      //   if (this.lastScrollTop !== $(window).scrollTop()) {
      //     didScroll = true;
      //   }
      // });

      setInterval(function() {
        if (didScroll) {
          // self.scrollTableContent();
          // didScroll = false;
        }
        // self.windowWidth = $(window).width();
      }, 10);
    },

    /**
     * Resize toc
     * @return {void}
     */
    resize: function() {
      var self = this;
      if (self.windowWidth < self.minWidth) {
        self.$tableContent.css('position', '');
        self.$tableContent.css('right', '');
      } else {
        var contentLeft = parseInt(self.$contentWrapP.offset().left, 10);
        var tableWidth = parseInt(self.$tableContent.width(), 10);
        var contentWidth = parseInt(self.$contentWrap.width(), 10);
        var contentPaddingRight = parseInt(self.$contentWrap.css('padding-right'), 10);
        var contentPaddingLeft = parseInt(self.$contentWrap.css('padding-left'), 10);
        var tableContentPaddingRight = parseInt(self.$tableContent.css('padding-right'), 10);

        self.scrollTableForRefresh();
        if (self.$tableContent.css('position') === 'fixed') {
          contentWidth = self.windowWidth - contentPaddingLeft - contentPaddingRight - tableWidth;
          if (contentWidth > self.$contentWrapMaxWidth) {
            contentWidth = self.$contentWrapMaxWidth;
          }
          self.$contentWrap.css('width', contentWidth);
        } else {
          self.$contentWrap.css('width', '');
        }
        var temp = self.windowWidth - contentWidth - tableWidth;
        var cssRight = temp - contentLeft - contentPaddingRight - tableContentPaddingRight;
        // console.log(self.wndowWidth + '--' + contentLeft + '--' + contentWidth + '--' +tableWidth+'--'+cssRight)i
        // console.log(self.$contentWrapMaxWidth)
        self.$tableContent.css('right', cssRight);

        // 设置margin,（窗口宽度-contentwidth-tablewidth）  /2
        var margin = temp / 2;
        self.$contentWrap.css('margin-left', margin);
      }
    },

    scrollTableContent: function() {
      var self = this;

      var scrollTop = $(window).scrollTop();
      var postContentOffsetTop = self.$tableContent.offset().top;
      self.$tableContent.css('max-height', self.windowWidth - postContentOffsetTop);
      var margin = self.$contentWrapP.css('margin-left');
      var contentWidth = self.$contentWrap.width();
      if (scrollTop > self.offsetTop - self.crisis && self.$tableContent.css('float') !== 'none') {
        self.lastOffsetTop = postContentOffsetTop;
        self.$tableContent.css('position', 'fixed');
        self.$tableContent.css('padding-left', '20px');
        self.$contentWrap.css('margin-left', margin);
        self.$tableContent.css('top', self.crisis);
        self.$contentWrap.css('width', contentWidth);
      }
      if (scrollTop <= self.offsetTop - self.crisis) {
        self.$tableContent.css('position', 'relative');
        self.$tableContent.css('top', '');
        self.$contentWrap.css('margin-left', '');
        self.$contentWrap.css('width', '');
        self.$tableContent.css('padding-left', '');
        self.up = false;
      }

      self.lastScrollTop = scrollTop;
    },

    scrollTableForRefresh: function() {
      var self = this;
      var margin = self.$contentWrap.css('margin-left');
      var scrollTop = $(window).scrollTop();
      var postContentOffsetTop = self.$tableContent.offset().top;
      if (scrollTop >= postContentOffsetTop + self.crisis && $(window).width() > self.minWidth) {
        self.$tableContent.css('position', 'fixed');
        self.$contentWrap.css('margin-left', margin);
        self.$tableContent.css('top', self.crisis);
      }
    }
  };

  $(document).ready(function() {
    var toc = new TableContent();
    toc.run();
  });
})(jQuery);
