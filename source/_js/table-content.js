/* eslint-disable brace-style */
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
    this.tocMessage = this.$tableTile.data('message');
  };

  TableContent.prototype = {
    /**
     * Run toc feature
     * @return {void}
     */
    run: function() {
      var tocContent = '';
      var title = '<li>' + this.tocMessage + '</li>';
      var icon = '<i class="fa fa-chevron-down">';
      this.$ulToc.children('li').children('ul').each(function() {
        $(this).parent('li').prepend(icon);
        var self = this;
        $(this).slideToggle(20);
        $(this).parent('li').find('.fa').click(function() {
          $(self).slideToggle(300);
        });
      });
      this.$ulToc.prepend(title);
      if (this.$tableContent.length) {
        tocContent = this.$ulToc[0];
        this.$ulToc.detach();
        this.$tableContent.prepend(tocContent);
        this.$tableContent.insertBefore(this.$contentWrap);
        this.$tableTile.detach();
      } else {
        this.$ulToc.removeClass('js-fixedContent');
        tocContent = this.$ulToc[0];
        this.$ulToc.detach();
        this.$contentWrap.prepend(tocContent);
      }
    }
  };

  $(document).ready(function() {
    var toc = new TableContent();
    toc.run();
  });
})(jQuery);
