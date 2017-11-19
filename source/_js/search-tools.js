/* eslint-disable brace-style,guard-for-in,no-unused-vars,require-jsdoc,max-len */
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
      '.post-header, #search-post-title');
    this.topWhitespace = $('.sidebar-top-whitespace');
    this.bottomWhitespace = $('.sidebar-bottom-whitespace');
    this.$searchInput = $('.search-ipt');
    this.$results = this.$searchToolsCol.find('.search-result');
    this.$noResults = this.$searchToolsCol.find('.no-result');
    this.$resultsCount = this.$searchToolsCol.find('.results-count');
    this.$sidebarContainer = $('.sidebar-container');
    this.$postHeaderCover = $('.post-header-cover');
    this.$postBottomBar = $('.post-bottom-bar');
    this.$sidebar = $('#sidebar');
    this.$body = $('body');
    this.$articleTagListItem = $('.article-tag-list-item');
    this.algolia = algoliaIndex;
  };

  SearchToolsColModal.prototype = {
    /**
     * Run feature
     * @returns {void}
     */
    run: function() {
      var self = this;

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

      self.setArticleTagListItemClick();
      self.setSearchPostTags();
      self.setSearchDate();
    },

    /**
     * set whitespace height
     * @returns {void}
     */
    setArticleTagListItemClick: function() {
      var self = this;
      self.$articleTagListItem.each(function() {
        $(this).click(function() {
          var tagName = $(this).text().trim();
          self.$searchInput.val(tagName);
          self.searchWithAloglia(tagName);
        });
      });
    },

    /**
     * set search post tags click function
     * @returns {void}
     */
    setSearchPostTags: function() {
      var self = this;
      self.$results.find('span#search-post-tags').each(function() {
        $(this).click(function() {
          var tagName = $(this).text().trim();
          self.$searchInput.val(tagName);
          self.$searchInput.focus();
          self.searchWithAloglia(tagName);
        });
      });
    },

    setSearchDate: function() {
      var self = this;
      self.$results.find('span#search-post-date').each(function() {
        $(this).click(function() {
          var time = $(this).text().trim();
          self.$searchInput.val(time);
          self.$searchInput.focus();
          self.searchWithAloglia(time);
        });
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
      this.hideOverFlow();
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
      this.recoverPostBottomBar();
      this.showOverflow();
    },

    /**
     * handle search and display results
     * @returns {void}
     */
    handleSearch: function() {
      var self = this;
      self.$searchInput.on('input propertychange', function() {
        var val = $(this).val();
        self.searchWithAloglia(val);
      });
    },

    searchWithAloglia: function(val) {
      var self = this;
      this.algolia.search(val, function(err, content) {
        if (!err) {
          self.showResults(content.hits);
          self.showResultsCount(content.nbHits);
        }
      });
    },

    /**
     * Display results
     * @param {Array} posts
     * @returns {void}
     */
    showResults: function(posts) {
      var html = '';
      posts.forEach(function(post) {
        html += '<div class="media">';
        html += '<a class="search-title" href="' + post.path + '">';
        html += '<i class="fa fa-quote-left"></i>';
        html += '<span id="search-post-title">' + post.title + '</span>';
        html += '</a>';
        html += '<p class="search-time">';
        html += '<i class="icon-calendar icon"></i>';
        html += '<span id="search-post-date" style="padding-left: 4px">' + post.date.substr(0, 10) + '</span>';
        html += '</p>';
        html += '<p class="search-tag">';
        html += '<i class="icon-price-tags icon"></i>';
        post.tags.forEach(function(tag) {
          html += '<span id="search-post-tags">';
          html += '#' + tag + ' ';
          html += '</span>';
        });

        html += '</p>';
        html += '<div class="clearfix"></div>';
        html += '</div>';
      });
      this.$results.html(html);
      this.setSearchPostTags();
      this.setSearchDate();
    },

    /**
     * Display messages and counts of results
     * @param {Number} count
     * @returns {void}
     */
    showResultsCount: function(count) {
      var string = '';
      if (count < 1) {
        string = this.$resultsCount.data('message-zero');
        this.$noResults.show();
      }
      else if (count === 1) {
        string = this.$resultsCount.data('message-one');
        this.$noResults.hide();
      }
      else if (count > 1) {
        string = this.$resultsCount.data('message-other').replace(/\{n\}/, count);
        this.$noResults.hide();
      }
      this.$resultsCount.html(string);
    },

    removeHideClass: function() {
      if (this.$searchToolsCol.hasClass('hide')) {
        this.$searchToolsCol.removeClass('hide');
        this.$searchToolsCol.addClass('show');
      }
      if (this.$canvas.hasClass('hidden')) {
        this.$canvas.removeClass('hidden');
      }
    },
    
    /**
     * Show search modal
     * @returns {void}
     */
    showSearchToolsCol: function() {
      this.removeHideClass();
      // TODO optimize
      this.thinMainCol();
      this.thinHeader();
      this.thinPostHeaderCover();
      this.thinBottomBar();
      this.$body.css('overflow-x', 'hidden');
    },

    /**
     * thin post bottom bar
     * @returns {void}
     */
    thinBottomBar: function() {
      this.$postBottomBar.addClass('show');
    },

    /**
     * thin post header cover
     * @returns {void}
     */
    thinPostHeaderCover: function() {
      this.$postHeaderCover.addClass('show');
      this.$postHeaderCover.removeClass('fade-in');
    },

    /**
     * thin post header cover
     * @returns {void}
     */
    recoverPostHeaderCover: function() {
      var self = this;
      if (this.$postHeaderCover.hasClass('show')) {
        this.$postHeaderCover.removeClass('show');
        this.$postHeaderCover.addClass('recover');
      }
      setTimeout(function() {
        self.$postHeaderCover.removeClass('recover');
      }, 1000);
    },

    /**
     * Hide search modal
     * @returns {void}
     */
    hideSearchToolsCol: function() {
      var self = this;
      if (this.$searchToolsCol.hasClass('show')) {
        this.$searchToolsCol.removeClass('show');
        this.$searchToolsCol.addClass('recover');
        setTimeout(function() {
          self.$searchToolsCol.removeClass('recover');
          self.$searchToolsCol.addClass('hide');
        }, 500);
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
      var self = this;
      if (this.$main.hasClass('show')) {
        this.$main.removeClass('show');
        this.$main.addClass('recover');
      }
      setTimeout(function() {
        self.$main.removeClass('recover');
      }, 1000);
    },

    /**
     * thin header for search
     * @returns {void}
     */
    thinHeader: function() {
      if (!this.$header.hasClass('show')) {
        this.$header.addClass('show');
        this.$header.removeClass('fade-in');
      }
    },

    /**
     * recover header for search
     * @returns {void}
     */
    recoverHeader: function() {
      if (this.$header.hasClass('show')) {
        var self = this;
        this.$header.removeClass('show');
        this.$header.addClass('recover');
        setTimeout(function() {
          self.$header.removeClass('recover');
        }, 1000);
      }
    },

    /**
     * recover header for search
     * @returns {void}
     */
    recoverPostBottomBar: function() {
      if (this.$postBottomBar.hasClass('show')) {
        var self = this;
        this.$postBottomBar.removeClass('show');
        this.$postBottomBar.addClass('recover');
        setTimeout(function() {
          self.$postBottomBar.removeClass('recover');
        }, 1000);
      }
    },

    /**
     * show over flow
     * @returns {void}
     */
    hideOverFlow: function() {
      $('body').css('overflow', 'hidden');
    },

    /**
     * show over flow
     * @returns {void}
     */
    showOverflow: function() {
      var self = this;
      setTimeout(function() {
        if (self.$sidebar.hasClass('pushed')) {
          $('body').css({'overflow-x': 'hidden', 'overflow-y': 'auto'});
        } else {
          $('body').css('overflow', 'auto');
        }
      }, 1000);
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
