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
