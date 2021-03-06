(function($) {
  'use strict';

  // Open and close the sidebar by swiping the sidebar and the blog and vice versa

  /**
   * Sidebar
   * @constructor
   */
  var Sidebar = function() {
    this.$sidebar = $('#sidebar');
    this.$openBtn = $('#btn-open-sidebar');
    this.$searchToolsCol = $('.search-tools-col');
    // Elements where the user can click to close the sidebar
    this.$closeBtn = $('#main, .post-header-cover');
    // Elements affected by the swipe of the sidebar
    // The `pushed` class is added to each elements
    // Each element has a different behavior when the sidebar is opened
    this.$blog = $('.post-bottom-bar, #header, #main, .post-header-cover');
    // If you change value of `mediumScreenWidth`,
    // you have to change value of `$screen-min: (md-min)` too
    // in `source/_css/utils/variables.scss`
    this.$body = $('body');
    this.$main = $('#main');
    this.$canvas = $('.anm-canvas');
    this.$headProfile = $('.full-screen-head');
    this.mediumScreenWidth = 768;
  };

  Sidebar.prototype = {
    /**
     * Run Sidebar feature
     * @return {void}
     */
    run: function() {
      var self = this;
      // Detect the click on the open button
      this.$openBtn.click(function() {
        if (!self.$sidebar.hasClass('pushed')) {
          // hide the picture in full screen
          self.openSidebar();
        }
      });
      // Detect the click on close button
      this.$closeBtn.click(function() {
        if (self.$sidebar.hasClass('pushed')) {
          self.closeSidebar();
        }
      });
      // Detect resize of the windows
      $(window).resize(function() {
        // Check if the window is larger than the minimal medium screen value
        if ($(window).width() > self.mediumScreenWidth) {
          self.resetSidebarPosition();
          self.resetBlogPosition();
        }
        else {
          self.closeSidebar();
        }
        self.resetSearchToolsCol();
      });
    },

    /**
     * Open the sidebar by swiping to the right the sidebar and the blog
     * @return {void}
     */
    openSidebar: function() {
      this.removeMainHideClass();
      this.swipeBlogToRight();
      this.swipeSidebarToRight();
      this.pushSearchToolsCol();
      this.pushAniCanvas();
    },

    /**
     * push ani-canvas
     * @returns {void}
     */
    pushAniCanvas: function() {
      if (!this.$searchToolsCol.hasClass('hidden')) {
        this.$canvas.addClass('pushed');
      }
    },

    /**
     * remove hide class for main
     * @return {void}
     */
    removeMainHideClass: function() {
      this.$main.removeClass('hide');
    },

    /**
     * Close the sidebar by swiping to the left the sidebar and the blog
     * @return {void}
     */
    closeSidebar: function() {
      if (this.$searchToolsCol.hasClass('hide')) {
        this.swipeSidebarToLeft();
        this.swipeBlogToLeft();
        this.removeCanvasPushed();
        this.resetSearchToolsCol();
      }
    },

    /**
     * remove class 'pushed' for canvas
     * @returns {void}
     */
    removeCanvasPushed: function() {
      this.$canvas.removeClass('pushed');
    },

    /**
     * Reset sidebar position
     * @return {void}
     */
    resetSidebarPosition: function() {
      this.$sidebar.removeClass('pushed');
    },

    /**
     * Reset blog position
     * @return {void}
     */
    resetBlogPosition: function() {
      this.$blog.removeClass('pushed');
    },

    /**
     * Reset search tools col position
     * @return {void}
     */
    resetSearchToolsCol: function() {
      if (this.$searchToolsCol.hasClass('pushed')) {
        this.$searchToolsCol.removeClass('pushed');
      }
    },
    /**
     * Swipe the sidebar to the right
     * @return {void}
     */
    swipeSidebarToRight: function() {
      var self = this;
      // Check if the sidebar isn't swiped
      // and prevent multiple click on the open button with `.processing` class
      if (!this.$sidebar.hasClass('pushed') && !this.$sidebar.hasClass('processing')) {
        // Swipe the sidebar to the right
        this.$sidebar.addClass('processing pushed');
        // add overflow on body to remove horizontal scroll
        this.$body.css('overflow-x', 'hidden');
        setTimeout(function() {
          self.$sidebar.removeClass('processing');
        }, 250);
      }
    },

    /**
     * push the search tools col when sidebar pushed
     * @return {void}
     */
    pushSearchToolsCol: function() {
      if (!this.$searchToolsCol.hasClass('pushed')) {
        this.$searchToolsCol.addClass('pushed');
      }
    },

    /**
     * Swipe the sidebar to the left
     * @return {void}
     */
    swipeSidebarToLeft: function() {
      // Check if the sidebar is swiped
      // and prevent multiple click on the close button with `.processing` class
      if (this.$sidebar.hasClass('pushed') && !this.$sidebar.hasClass('processing')) {
        // Swipe the sidebar to the left
        var self = this;
        this.$sidebar.addClass('processing').removeClass('pushed processing');
        // go back to the default overflow
        setTimeout(function() {
          self.$body.css('overflow-x', 'auto');
        }, 250);
      }
    },

    /**
     * Swipe the blog to the right
     * @return {void}
     */
    swipeBlogToRight: function() {
      var self = this;
      // Check if the blog isn't swiped
      // and prevent multiple click on the open button with `.processing` class
      if (!this.$blog.hasClass('pushed') && !this.$blog.hasClass('processing')) {
        // Swipe the blog to the right
        this.$blog.addClass('processing pushed');

        setTimeout(function() {
          self.$blog.removeClass('processing');
        }, 250);
      }
    },

    /**
     * Swipe the blog to the left
     * @return {void}
     */
    swipeBlogToLeft: function() {
      var self = this;
      // Check if the blog is swiped
      // and prevent multiple click on the close button with `.processing` class
      if (self.$blog.hasClass('pushed') && !this.$blog.hasClass('processing')) {
        // Swipe the blog to the left
        self.$blog.addClass('processing').removeClass('pushed');

        setTimeout(function() {
          self.$blog.removeClass('processing');
        }, 250);
      }
    }
  };

  $(document).ready(function() {
    var sidebar = new Sidebar();
    sidebar.run();
  });
})(jQuery);
