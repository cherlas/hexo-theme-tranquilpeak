(function($) {
  'use strict';

  // Hide the header when the user scrolls down, and show it when he scrolls up

  /**
   * HeaderCover
   * @constructor
   */
  var HeaderCover = function() {
    this.$postHeaderCover = $('.post-header-cover');
    this.postHeaderHeight = this.$postHeaderCover.height();
    // CSS class located in `source/_css/layout/_header.scss`
    this.delta = 5;
    this.lastScrollTop = 0;
  };

  HeaderCover.prototype = {

    /**
     * Run HeaderCover feature
     * @return {void}
     */
    run: function() {
      var self = this;
      var didScroll;

      // Detect if the user is scrolling
      $(window).scroll(function() {
        didScroll = true;
      });

      // Check if the user scrolled every 250 milliseconds
      setInterval(function() {
        if (didScroll) {
          self.animate();
          didScroll = false;
        }
      }, 250);
    },

    /**
     * Animate the header
     * @return {void}
     */
    animate: function() {
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();
      var opacity = (windowHeight - scrollTop) / windowHeight;
      this.$postHeaderCover.css('opacity', opacity);
    }
  };

  $(document).ready(function() {
    var headerCover = new HeaderCover();
    headerCover.run();
  });
})(jQuery);
