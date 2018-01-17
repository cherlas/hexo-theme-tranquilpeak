(function($) {
  'use strict';

  // Hide the post bottom bar when the post footer is visible by the user,
  // and show it when the post footer isn't visible by the user

  /**
   * PostBottomThumbnailImg
   * @constructor
   */
  var PostBottomThumbnailImg = function() {
    this.$postShortenThumbnailimgBottom = $('.postShorten--thumbnailimg-bottom');
    this.$postBottomThumb = this.$postShortenThumbnailimgBottom.find('.postShorten-thumbnailimg');
    this.$postBottomImg = this.$postBottomThumb.find('img');
    this.$sidebar = $('#sidebar');
  };

  PostBottomThumbnailImg.prototype = {

    /**
     * Run PostBottomThumbnailImg feature
     * @return {void}
     */
    run: function() {
      var self = this;
      setTimeout(function() {
        self.resize();
      }, 100);
      // resize postShorten--thumbnailimg when window is resized
      $(window).resize(function() {
        self.resize();
      });
    },

    resize: function() {
      var self = this;
      self.$postBottomImg.each(function() {
        var windowWidth = $(window).width();
        var sidebarWidth = self.$sidebar.width();

        if (self.$sidebar.css('left') < 0) {
          sidebarWidth = 0;
        }
        var width = (windowWidth - sidebarWidth) * 2 / 3 * 0.98 / 3;
        if (width > 200) {
          width = 200;
        }
        self.$postBottomImg.css('height', width);
      });
    }
  };

  $(document).ready(function() {
    var postBottomThumbnailImg = new PostBottomThumbnailImg();
    postBottomThumbnailImg.run();
  });
})(jQuery);
