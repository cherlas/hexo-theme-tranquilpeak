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
    this.$contentWrap = this.$postContent.find('.toc.main-content-wrap');
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
      var icon = '<i class="fa fa-chevron-right">';
      var selfOut = this;
      this.$ulToc.find('ul').each(function() {
        var liBlock = $(this).parent('li');
        $(liBlock).prepend(icon);
        if ($(liBlock).css('padding-left') !== '20px') {
          $(liBlock).css('padding-left', '20px');
        }
        var selfIn = this;
        var count = 0;
        selfOut.toggleContent(this, 20);
        $(liBlock).find('.fa').click(function() {
          selfOut.toggleContent(selfIn, 250);
          if (count % 2 === 0) {
            $(liBlock).find('i').removeClass('fa-chevron-right').addClass('fa-chevron-down');
            count++;
          } else {
            $(liBlock).find('i').removeClass('fa-chevron-down').addClass('fa-chevron-right');
            count = 0;
          }
        });
      });
      this.$ulToc.prepend(title);
      if (this.$tableContent.length) {
        tocContent = this.$ulToc[0];
        // this.$ulToc.detach();
        this.$tableContent.prepend(tocContent);
        // this.$tableContent.insertBefore(this.$contentWrap);
        this.$tableTile.detach();
      } else {
        this.$ulToc.removeClass('js-fixedContent');
        tocContent = this.$ulToc[0];
        this.$ulToc.detach();
        this.$contentWrap.prepend(tocContent);
      }
    },

    toggleContent: function(element, time) {
      $(element).slideToggle(time);
    }
  };

  $(document).ready(function() {
    var toc = new TableContent();
    toc.run();
  });
})(jQuery);
