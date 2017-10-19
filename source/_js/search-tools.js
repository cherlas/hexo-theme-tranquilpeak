/* eslint-disable brace-style,guard-for-in,no-unused-vars */
(function($) {
  'use strict';

    /**
     * Open search modal
     * @constructor
     */
  var SearchToolsColModal = function() {
    this.$searchToolsColModal = $('.search-tools-col');
    this.$openButton = $('.open-search-col');
    this.$container = $('#container');
    this.$main = $('#main');
    this.$header = $('#header');
    this.$searchButton = this.$searchToolsColModal.find('.icon-search');
    this.$closeButton = this.$searchToolsColModal.find('.icon-close');
    this.$searchInput = $('.search-ipt');
    this.$jsonContentFalse = $('.json-content-false');
    this.$results = this.$searchToolsColModal.find('.search-result-ul');
    this.$resultsCount = this.$searchToolsColModal.find('.results-count');
  };

  SearchToolsColModal.prototype = {
    /**
     * Run feature
     * @returns {void}
     */
    run: function() {
      var self = this;

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

        if (event.keyCode === 83 && !self.$searchToolsColModal.is(':visible')) {
          self.open();
        }
      });

      // close button when overlay is clicked
      self.$searchToolsColModal.click(function(e) {
        if (e.target === this) {
          self.close();
        }
      });

      // close modal when close button is clicked
      self.$closeButton.click(function() {
        self.close();
      });

      // close modal when `ESC` button is pressed
      $(document).keyup(function(e) {
        if (e.keyCode === 27 && self.$searchToolsColModal.is(':visible')) {
          self.close();
        }
      });

      // send search when form is submitted
      // self.$searchForm.submit(function(event) {
      //   event.preventDefault();
      //   self.search(self.$searchInput.val());
      // });
    },

    /**
     * Open search modal and display overlay
     * @returns {void}
     */
    open: function() {
      this.showSearchToolsCol();
      // this.showOverlay();
      this.ani();
      // this.$searchInput.focus();
    },

    /**
     * Close search modal and overlay
     * @returns {void}
     */
    close: function() {
      this.hideSearchToolsCol();
      this.hideOverlay();
      this.$searchInput.blur();
    },

    /**
     * Search with Algolia API and display results
     * @param {String} search
     * @returns {void}
     */
    search: function(search) {
      var self = this;
      this.algolia.search(search, function(err, content) {
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
        var lang = window.navigator.userLanguage || window.navigator.language || post.lang;

        html += '<div class="media">';
        if (post.thumbnailImageUrl) {
          html += '<div class="media-left">';
          html += '<a class="link-unstyled" href="' + (post.link || post.permalink) + '">';
          html += '<img class="media-image" ' +
                        'src="' + post.thumbnailImageUrl + '" ' +
                        'width="90" height="90"/>';
          html += '</a>';
          html += '</div>';
        }

        html += '<div class="media-body">';
        html += '<a class="link-unstyled" href="' + (post.link || post.permalink) + '">';
        html += '<h3 class="media-heading">' + post.title + '</h3>';
        html += '</a>';
        html += '<span class="media-meta">';
        html += '<span class="media-date text-small">';
        html += moment(post.date).locale(lang).format('ll');
        html += '</span>';
        html += '</span>';
        html += '<div class="media-content hide-xs font-merryweather">' + post.excerpt + '</div>';
        html += '</div>';
        html += '<div style="clear:both;"></div>';
        html += '<hr>';
        html += '</div>';
      });
      this.$results.html(html);
    },

    /**
     * Show search modal
     * @returns {void}
     */
    showSearchToolsCol: function() {
      if (this.$searchToolsColModal.hasClass('hide')) {
        this.$searchToolsColModal.removeClass('hide');
        this.$searchToolsColModal.addClass('show');
      }
      // TODO optimise
      this.addBackground();
      this.thinMainCol();
      this.thinHeader();
    },

    /**
     * thin main col for search
     * @returns {void}
     */
    thinMainCol: function() {
      if (!this.$main.hasClass('show')) {
        this.$main.addClass('show');
      }
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
     * Hide search modal
     * @returns {void}
     */
    hideSearchToolsCol: function() {
      this.$searchToolsColModal.fadeOut();
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

    /**
     * Show overlay
     * @returns {void}
     */
    showOverlay: function() {
      $('body').append('<div class="overlay"></div>');
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

      function initHeader() {
        sidebarWidth = $('#sidebar').width();
        width = window.innerWidth - sidebarWidth;
        height = window.innerHeight;
        target = {x: 0, y: height};

        largeHeader = document.getElementById('container');

        console.log(sidebarWidth + "---" + window.innerWidth);
        largeHeader.style.height = height + 'px';

        canvas = document.getElementById('anm-canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.marginLeft = sidebarWidth + 'px';
        ctx = canvas.getContext('2d');

        // create particles
        circles = [];
        for (var x = 0; x < width * 0.5; x++) {
          var c = new Circle();
          circles.push(c);
        }
        animate();
      }

      // Event handling
      function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
      }

      function scrollCheck() {
        if (document.body.scrollTop > height) {
          animateHeader = false;
        } else {
          animateHeader = true;
        }
      }

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height + 'px';
        canvas.width = width;
        canvas.height = height;
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
