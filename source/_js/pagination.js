(function($) {
  'use strict';

  // Open and close the sidebar by swiping the sidebar and the blog and vice versa

  /**
   * Sidebar
   * @constructor
   */
  var Pagination = function() {
    this.$pageNav = $('#page-nav');
    this.$extendPrev = this.$pageNav.find('.extend.prev');
    this.$extendNext = this.$pageNav.find('.extend.next');
  };

  Pagination.prototype = {
    /**
     * Run Pagination feature
     * @return {void}
     */
    run: function() {
      var self = this;
      self.$pageNav.children("*").each(function() {
        if ($(this).attr('href') === '/') {
          $(this).attr('href', '/#blog');
        }
      });

      this.$extendPrev.addClass('fa fa-lg fa-arrow-circle-left');
      this.$extendNext.addClass('fa fa-lg fa-arrow-circle-right');
    }

  };

  $(document).ready(function() {
    var pagination = new Pagination();
    pagination.run();
  });
})(jQuery);
