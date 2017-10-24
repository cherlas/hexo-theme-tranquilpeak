(function($) {
  'use strict';

  /**
  * Sidebar
  * @constructor
  */
  var HeadProfile = function() {
    this.$sidebar = $('#sidebar');
    this.$main = $('#main');
    this.$blogButton = $('.blog-button-full-screen');
    this.$headProfile = $('.full-screen-head');
    this.$cover = $('#cover');
    this.$firstPageDesc = $('.first-page-desc-container');
  };

  HeadProfile.prototype = {
    /**
    * Run Sidebar feature
    * @return {void}
    */
    run: function() {
      var self = this;
      // Detect the click on the open button
      self.$blogButton.click(function() {
        if (location.hash && location.hash === "#blog") {
          return;
        }
        self.removeFullScreen();
      });

      /* first page*/
      if (window.location.hash === "" && window.location.pathname === "/") {
        this.$cover.css('z-index', '100');
        this.$headProfile.removeClass('hidden');
        this.$firstPageDesc.removeClass('hidden');
        return;
      }

      if (window.location.hash && window.location.hash === "#blog") {
        self.removeFullScreen();
        return;
      }
      if (window.location.hash === "") {
        self.removeFullScreen();
      }
      // self.removeFullScreen();
      // console.log("common");
      // console.log(window.location.hash);
    },

    removeFullScreen: function() {
      this.changeZIndex();
        // this.moveHeadPortrait();
      this.removeHiddenClass();
    },

    /**
    * remove hidden class for #main, #sidebar
    * @return {void}
    */
    removeHiddenClass: function() {
      // this.$main.css('display', 'block');
      if (this.$firstPageDesc.hasClass('hidden')) {
        this.$firstPageDesc.removeClass('hidden');
      }
      if (this.$main.hasClass('hidden')) {
        this.$main.removeClass('hidden');
      }
      if (this.$sidebar.hasClass('hidden')) {
        this.$sidebar.removeClass('hidden');
      }
    },

      /**
       *  change cover's z-index from 1050 to -1
       *  @return {void}
       */
    changeZIndex: function() {
      this.$cover.css('z-index', '-1');
    }
  };

  $(document).ready(function() {
    var headProfile = new HeadProfile();
    headProfile.run();
  });
})(jQuery);
