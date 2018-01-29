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
    this.tocTitle = this.$tableTile.data('message');
  };

  TableContent.prototype = {
    /**
     * Run toc feature
     * @return {void}
     */
    run: function() {
      if (this.$tableContent.length) {
        var title = '<li>' + this.tocTitle + '</li>';
        this.$ulToc.prepend(title);
        var tocContent = this.$ulToc[0];
        this.$ulToc.detach();
        this.$tableContent.prepend(tocContent);
        this.$tableContent.insertBefore(this.$contentWrap);
        this.$tableTile.detach();
      }
    }
  };

  $(document).ready(function() {
    var toc = new TableContent();
    toc.run();
  });
})(jQuery);
