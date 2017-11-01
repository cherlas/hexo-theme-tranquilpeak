/* eslint-disable brace-style,guard-for-in,no-unused-vars,require-jsdoc */
(function($) {
  'use strict';

  /**
   * Open search modal
   * @constructor
   */
  var SearchToolsColModal = function() {
    this.$searchToolsCol = $('.search-tools-col');
    this.$openButton = $('.open-search-col, .btn-open-search');
    this.$main = $('#main');
    this.$canvas = $('#anm-canvas');
    this.$header = $('#header');
    this.$closeButton = $('#main, .sidebar-top-whitespace, .sidebar-bottom-whitespace,' +
      '.post-header');
    this.topWhitespace = $('.sidebar-top-whitespace');
    this.bottomWhitespace = $('.sidebar-bottom-whitespace');
    this.$searchInput = $('.search-ipt');
    this.$results = this.$searchToolsCol.find('.search-result-ul');
    this.$resultsCount = this.$searchToolsCol.find('.results-count');
    this.$sidebarContainer = $('.sidebar-container');
    this.$postHeaderCover = $('.post-header-cover');
    this.$sidebar = $('#sidebar');
    this.$body = $('body');
  };

  SearchToolsColModal.prototype = {
    /**
     * Run feature
     * @returns {void}
     */
    run: function() {
      var self = this;

      self.searchWithDom(self.$searchInput.val());
      self.$resultsCount.addClass('hide');

      self.handleSearch();

      self.setWhiteSpace();

      // open modal when open button is clicked
      self.$openButton.click(function() {
        self.open();
      });

      // open modal when `s` button is pressed
      $(document).keyup(function(event) {
        var target = event.target || event.srcElement;
        // exit if user is focusing an input or textarea
        var tagName = target.tagName.toUpperCase();
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          return;
        }

        if (event.keyCode === 83 && !self.$searchToolsCol.is(':visible')) {
          self.open();
        }
      });

      // // close button when overlay is clicked
      self.$searchToolsCol.click(function(e) {
        if (e.target === this) {
          self.close();
        }
      });

      // close modal when close button is clicked
      self.$closeButton.click(function(e) {
        self.close();
      });

      // close modal when `ESC` button is pressed
      $(document).keyup(function(e) {
        if (e.keyCode === 27 && self.$searchToolsCol.is(':visible')) {
          self.close();
        }
      });

      // Detect resize of the windows
      $(window).resize(function() {
        self.setWhiteSpace();
      });
    },

    /**
     * set whitespace height
     * @returns {void}
     */
    setWhiteSpace: function() {
      var topWhitespaceHeight = this.$sidebarContainer.position().top;
      var bottomWhitespaceHeight = $(window).height() - this.$sidebarContainer.height() -
        topWhitespaceHeight;
      this.topWhitespace.css('height', topWhitespaceHeight + 'px');
      this.bottomWhitespace.css('height', bottomWhitespaceHeight + 'px');
    },

    /**
     * Open search modal and display overlay
     * @returns {void}
     */
    open: function() {
      this.showSearchToolsCol();
      this.ani();
    },

    /**
     * Close search modal and overlay
     * @returns {void}
     */
    close: function() {
      this.hideSearchToolsCol();
      this.recoverMainCol();
      this.recoverHeader();
      this.recoverPostHeaderCover();
    },

    /**
     * handle search and display results
     * @returns {void}
     */
    handleSearch: function() {
      var self = this;
      self.$searchInput.on('input propertychange', function() {
        var val = $(this).val();
        self.searchWithDom(val);
      });
    },

    /**
     * search and display the result
     * @param {String} val
     * @returns {void}
     */
    searchWithJsonContent: function(val) {
      $.getJSON("/assets/js/content.json", function(result) {

      });
    },

    searchWithDom: function(val) {
      var self = this;

      val = (val || '').toLowerCase();
      var type = 'title';
      if (val.indexOf('#') === 0) {
        val = val.substr(1, val.length);
        type = 'tag';
      }
      if (val.indexOf('*') === 0) {
        val = val.substr(1, val.length);
        type = 'time';
      }

      var children = this.$results.children();
      var count = 0;

      children.each(function() {
        var matchTitle = false;
        var matchTime = false;
        var matchTags = false;
        var itemTitle = $(this).find('#search-post-title').text().toLowerCase();
        var itemTime = $(this).find('.search-time').text().trim().toLowerCase();
        var itemTags = $(this).find('#search-post-tags').text().trim().toLowerCase();

        if (type === 'title' && itemTitle.indexOf(val) > -1) {
          matchTitle = true;
          count++;
        } else if (type === 'time' && itemTime.indexOf(val) > -1) {
          matchTime = true;
          count++;
        } else if (type === 'tag' && itemTags.indexOf(val) > -1) {
          matchTags = true;
          count++;
        }
        if (count > 0) {
          if (self.$resultsCount.hasClass('hide')) {
            self.$resultsCount.removeClass('hide');
          }
          self.$resultsCount.text('result: ' + count + 'items');
        } else if (count === 0) {
          self.$resultsCount.text('result: no items found');
        }

        if (matchTitle || matchTime || matchTags) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    },

    /**
     * Show search modal
     * @returns {void}
     */
    showSearchToolsCol: function() {
      if (this.$searchToolsCol.hasClass('hide')) {
        this.$searchToolsCol.removeClass('hide');
        this.$searchToolsCol.addClass('show');
      }
      if (this.$searchToolsCol.hasClass('recover')) {
        this.$searchToolsCol.removeClass('recover');
      }
      if (this.$canvas.hasClass('hidden')) {
        this.$canvas.removeClass('hidden');
      }
      this.$body.css('overflow-x', 'hidden');
      // TODO optimize
      this.thinMainCol();
      this.thinHeader();
      this.thinPostHeaderCover();
    },

    /**
     * thin post header cover
     * @returns {void}
     */
    thinPostHeaderCover: function() {
      this.$postHeaderCover.addClass('show');
    },

    /**
     * thin post header cover
     * @returns {void}
     */
    recoverPostHeaderCover: function() {
      this.$postHeaderCover.removeClass('show');
    },

    /**
     * Hide search modal
     * @returns {void}
     */
    hideSearchToolsCol: function() {
      if (this.$searchToolsCol.hasClass('show')) {
        this.$searchToolsCol.removeClass('show');
        this.$searchToolsCol.addClass('hide');
        this.$searchToolsCol.addClass('recover');
      }
      if (!this.$canvas.hasClass('hidden')) {
        this.$canvas.addClass('hidden');
      }
    },

    /**
     * thin main col for search
     * @returns {void}
     */
    thinMainCol: function() {
      if (this.$main.hasClass('hide')) {
        this.$main.removeClass('hide');
      }
      if (!this.$main.hasClass('show')) {
        this.$main.addClass('show');
      }
    },

    /**
     * recover main col for search
     * @returns {void}
     */
    recoverMainCol: function() {
      if (this.$main.hasClass('show')) {
        this.$main.removeClass('show');
      }
      // if (!this.$main.hasClass('hide')) {
      //   this.$main.addClass('hide');
      // }
    },

    /**
     * thin header for search
     * @returns {void}
     */
    thinHeader: function() {
      if (!this.$header.hasClass('show')) {
        this.$header.addClass('show');
      }
    },

    /**
     * recover header for search
     * @returns {void}
     */
    recoverHeader: function() {
      if (this.$header.hasClass('show')) {
        this.$header.removeClass('show');
        this.$header.addClass('recover');
      }
    },

    /**
     * Show overlay
     * @returns {void}
     */
    showOverlay: function() {
      ('body').append('<div class="overlay"></div>');
      $('.overlay').fadeIn();
      $('body').css('overflow', 'hidden');
    },

    /**
     * Hide overlay
     * @returns {void}
     */
    hideOverlay: function() {
      $('.overlay').fadeOut(function() {
        $(this).remove();
        $('body').css('overflow', 'auto');
      });
    },

    /**
     * animation for search modal
     * @returns {void}
     */
    ani: function() {
      var self = this;
      var width;
      var height;
      var largeHeader;
      var canvas;
      var ctx;
      var circles;
      var target;
      var animateHeader = true;
      var sidebarWidth;

      // Main
      initHeader();
      addListeners();

      // initial for animation
      function initHeader() {
        target = {x: 0, y: height};

        drawCanvas();
        ctx = canvas.getContext('2d');
        createCircles();
        animate();
      }

      function createCircles() {
        // create particles
        circles = [];
        for (var x = 0; x < width * 0.5; x++) {
          var c = new Circle();
          circles.push(c);
        }
      }

      // Event handling
      function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
      }

      function drawCanvas() {
        largeHeader = document.getElementById('container');
        canvas = document.getElementById('anm-canvas');

        sidebarWidth = $('#sidebar').width();
        width = window.innerWidth;
        height = window.innerHeight;

        largeHeader.style.height = height + 'px';

        canvas.height = height;
        canvas.width = width;
      }

      function scrollCheck() {
        if (document.body.scrollTop > height) {
          animateHeader = false;
        } else {
          animateHeader = true;
        }
      }

      function resize() {
        drawCanvas();
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (var i in circles) {
            circles[i].draw();
          }
        }
        requestAnimationFrame(animate);
      }

      // Canvas manipulation
      function Circle() {
        var _this = this;

        // constructor
        (function() {
          _this.pos = {};
          init();
          // console.log(_this);
        })();

        function init() {
          _this.pos.x = Math.random() * width;
          _this.pos.y = height + Math.random() * 100;
          _this.alpha = 0.1 + Math.random() * 0.3;
          _this.scale = 0.1 + Math.random() * 0.3;
          _this.velocity = Math.random();
        }

        this.draw = function() {
          if (_this.alpha <= 0) {
            init();
          }
          _this.pos.y -= _this.velocity;
          _this.alpha -= 0.0005;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.scale * 10, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(255,255,255,' + _this.alpha + ')';
          ctx.fill();
        };
      }
    }
  };

  $(document).ready(function() {
    var searchToolsColModal = new SearchToolsColModal();
    searchToolsColModal.run();
  });
})(jQuery);
