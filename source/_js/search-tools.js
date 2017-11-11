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
    this.$resultsCount = this.$searchToolsCol.find('.results-count');
    this.$sidebarContainer = $('.sidebar-container');
    this.$postHeaderCover = $('.post-header-cover');
    this.$sidebar = $('#sidebar');
    this.$body = $('body');
    this.$articleTagListItem = $('.article-tag-list-item');
    this.$searchPostTags = $('span#search-post-tags');
    this.$searchTime = $('.search-time').find('span');
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

      self.setArticleTagListItemClick();
      self.setSearchPostTags();
      self.setSearchTime();
    },

    /**
     * set whitespace height
     * @returns {void}
     */
    setArticleTagListItemClick: function() {
      var self = this;
      self.$articleTagListItem.each(function() {
        $(this).click(function() {
          var tagName = '#' + $(this).text().trim();
          self.$searchInput.val(tagName);
          self.searchWithDom(tagName);
        });
      });
    },

    /**
     * set search post tags click function
     * @returns {void}
     */
    setSearchPostTags: function() {
      var self = this;
      self.$searchPostTags.each(function() {
        $(this).click(function() {
          var tagName = $(this).text().trim();
          self.$searchInput.val(tagName);
          self.$searchInput.focus();
          self.searchWithDom(tagName);
        });
      });
    },

    setSearchTime: function() {
      var self = this;
      self.$searchTime.each(function() {
        $(this).click(function() {
          var time = "*" + $(this).text().trim();
          self.$searchInput.val(time);
          self.$searchInput.focus();
          self.searchWithDom(time);
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
        self.searchWithJsonContent(val);
        // self.searchWithDom(val);
      });
    },

    /**
     * search and display the result
     * @param {String} val
     * @returns {void}
     */
    searchWithJsonContent: function(val) {
      var self = this;
      var html = '';
      if (self.$resultsCount.hasClass('hide')) {
        self.$resultsCount.removeClass('hide');
      }
      self.$results.html('');
      var temp = val.split(/[*#]/);

      var tagIndex = val.indexOf('#');
      var timeIndex = val.indexOf('*');

      var titleVal = temp[0];
      var tagVal = '';
      var timeVal = '';

      var type = 'title';

      if (tagIndex === -1 && timeIndex === -1) {
        tagVal = '';
        timeVal = '';
      } else if (timeIndex === -1) {
        tagVal = temp[1];
        if (titleVal === '') {
          type = 'tag';
        } else {
          type = 'titleTag';
        }
      } else if (tagIndex === -1) {
        timeVal = temp[1];
        if (titleVal === '') {
          type = 'time';
        } else {
          type = 'titleTime';
        }
      } else {
        if (titleVal === '') {
          type = 'timeTag';
        } else {
          type = 'titleTimeTag';
        }
        if (tagIndex > timeIndex) {
          tagVal = temp[2];
          timeVal = temp[1];
        } else {
          tagVal = temp[1];
          timeVal = temp[2];
        }
      }

      titleVal = titleVal.toLowerCase();
      timeVal = timeVal.toLowerCase();
      tagVal = '#' + tagVal.toLowerCase();

      // console.log('title:' + titleVal + ' --tag:' + tagVal + ' --time:' + timeVal);

      // console.log('legth: ' + children.length + 'type:' + type);
      var count = 0;

      $.getJSON("", function(result) {
        $.each(result, function(index, field) {
          var matchTitle = false;
          var matchTime = false;
          var matchTags = false;
          var matchTitleTime = false;
          var matchTitleTags = false;
          var matchTimeTags = false;
          var matchTitleTimeTags = false;
          var itemTitle = field.title.toLowerCase();
          var itemTime = field.date.toLowerCase();
          var itemPath = field.path;
          var itemTags = '';
          $(field.tags).each(function(i, tag) {
            itemTags += '#' + tag.name;
          });
          // console.log(itemTitle + "-----" + itemTime + "----" + itemTags);
          switch (type) {
            case 'title':
              if (itemTitle.indexOf(titleVal) > -1) {
                matchTitle = true;
                count++;
              }
              break;
            case 'time':
              if (itemTime.indexOf(timeVal) > -1) {
                matchTime = true;
                count++;
              }
              break;
            case 'tag':
              if (itemTags.indexOf(tagVal) > -1) {
                matchTags = true;
                count++;
              }
              break;
            case 'titleTime':
              if (titleVal !== '' && itemTitle.indexOf(titleVal) > -1 && itemTime.indexOf(timeVal) > -1) {
                matchTitleTime = true;
                count++;
              }
              break;
            case 'titleTag':
              if (titleVal !== '' && itemTitle.indexOf(titleVal) > -1 && itemTags.indexOf(tagVal) > -1) {
                matchTitleTags = true;
                count++;
              }
              break;
            case 'timeTag':
              if (itemTime.indexOf(timeVal) > -1 && itemTags.indexOf(tagVal) > -1) {
                matchTimeTags = true;
                count++;
              }
              break;
            case 'titleTimeTag':
              if (itemTitle.indexOf(titleVal) > -1 && itemTime.indexOf(timeVal) > -1 &&
                itemTags.indexOf(tagVal) > -1) {
                matchTitleTimeTags = true;
                count++;
              }
              break;
            default:
              break;
          }

          if (count > 0) {
            self.$resultsCount.text('result: ' + count + 'posts found.');
          } else if (count === 0) {
            self.$resultsCount.text('result: no post found.');
          }

          if (matchTitle || matchTime || matchTags || matchTitleTime ||
            matchTitleTags || matchTimeTags || matchTitleTimeTags) {
            html = self.contractHtml(html, itemTitle, itemTime, itemTags, itemPath);
            // console.log('htmlsssss: ' + html);
            self.$results.html(html);
          }
        });
      });
    },

    /**
     * @param {String} html
     * @param {String} itemTitle
     * @param {String} itemTime
     * @param {String} itemTags
     * @param {String} itemPath
     * @returns {String}
     */
    contractHtml: function(html, itemTitle, itemTime, itemTags, itemPath) {
      html += '<div class="media">';
      html += '<a class="search-title" href=' + itemPath + '>';
      html += '<i class="icon-quo-left icon"></i>';
      html += '<span id="search-post-title">' + itemTitle + '</span>';
      html += '</a>';
      html += '<p class="search-time">';
      html += '<i class="icon-calendar icon"></i>';
      html += '<span>' + itemTime.substr(0, 10) + '</span>';
      html += '</p>';
      html += '<p class="search-tag">';
      html += '<i class="icon-price-tags icon"></i>';

      var tags = itemTags.split('#');
      for (var i = 1; i < tags.length; i++) {
        html += '<span id="search-post-tags">';
        html += '#' + tags[i];
        html += '</span>';
      }

      html += '</p>';
      html += '<div class="clearfix"></div>';
      html += '</div>';

      return html;
    },

    /**
     * search with show dom or not
     * @param {String} val
     * @returns {void}
     */
    searchWithDom: function(val) {
      if (val === '') {
        return;
      }
      var self = this;

      var temp = val.split(/[*#]/);

      var tagIndex = val.indexOf('#');
      var timeIndex = val.indexOf('*');

      var titleVal = temp[0];
      var tagVal = '';
      var timeVal = '';

      var type = 'title';

      if (tagIndex === -1 && timeIndex === -1) {
        tagVal = '';
        timeVal = '';
      } else if (timeIndex === -1) {
        tagVal = temp[1];
        if (titleVal === '') {
          type = 'tag';
        } else {
          type = 'titleTag';
        }
      } else if (tagIndex === -1) {
        timeVal = temp[1];
        if (titleVal === '') {
          type = 'time';
        } else {
          type = 'titleTime';
        }
      } else {
        if (titleVal === '') {
          type = 'timeTag';
        } else {
          type = 'titleTimeTag';
        }
        if (tagIndex > timeIndex) {
          tagVal = temp[2];
          timeVal = temp[1];
        } else {
          tagVal = temp[1];
          timeVal = temp[2];
        }
      }

      titleVal = titleVal.toLowerCase();
      timeVal = timeVal.toLowerCase();
      tagVal = '#' + tagVal.toLowerCase();

      // console.log('title:' + titleVal + ' --tag:' + tagVal + ' --time:' + timeVal);

      var children = this.$results.children();
      // console.log('legth: ' + children.length + 'type:' + type);
      var count = 0;

      children.each(function() {
        var matchTitle = false;
        var matchTime = false;
        var matchTags = false;
        var matchTitleTime = false;
        var matchTitleTags = false;
        var matchTimeTags = false;
        var matchTitleTimeTags = false;
        var itemTitle = $(this).find('#search-post-title').text().toLowerCase();
        var itemTime = $(this).find('.search-time').text().trim().toLowerCase();
        var itemTags = $(this).find('#search-post-tags').text().trim().toLowerCase();

        switch (type) {
          case 'title':
            if (itemTitle.indexOf(titleVal) > -1) {
              matchTitle = true;
              count++;
            }
            break;
          case 'time':
            if (itemTime.indexOf(timeVal) > -1) {
              matchTime = true;
              count++;
            }
            break;
          case 'tag':
            if (itemTags.indexOf(tagVal) > -1) {
              matchTags = true;
              count++;
            }
            break;
          case 'titleTime':
            if (titleVal !== '' && itemTitle.indexOf(titleVal) > -1 && itemTime.indexOf(timeVal) > -1) {
              matchTitleTime = true;
              count++;
            }
            break;
          case 'titleTag':
            if (titleVal !== '' && itemTitle.indexOf(titleVal) > -1 && itemTags.indexOf(tagVal) > -1) {
              matchTitleTags = true;
              count++;
            }
            break;
          case 'timeTag':
            if (itemTime.indexOf(timeVal) > -1 && itemTags.indexOf(tagVal) > -1) {
              matchTimeTags = true;
              count++;
            }
            break;
          case 'titleTimeTag':
            if (itemTitle.indexOf(titleVal) > -1 && itemTime.indexOf(timeVal) > -1 &&
              itemTags.indexOf(tagVal) > -1) {
              matchTitleTimeTags = true;
              count++;
            }
            break;
          default:
            break;
        }

        if (count > 0) {
          if (self.$resultsCount.hasClass('hide')) {
            self.$resultsCount.removeClass('hide');
          }
          self.$resultsCount.text('result: ' + count + 'items found.');
        } else if (count === 0) {
          self.$resultsCount.text('result: no items found.');
        }

        // console.log('title:' + matchTitle + "  time:" + matchTime + '  tag:' + matchTags);
        // console.log('titleTime:' + matchTitleTime + "  titleTag:" + matchTitleTags + '  timeTag:' + matchTimeTags);
        // console.log('titleTimeTags:' + matchTitleTimeTags);
        // console.log('\n');
        if (matchTitle || matchTime || matchTags || matchTitleTime ||
          matchTitleTags || matchTimeTags || matchTitleTimeTags) {
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
      if (this.$main.hasClass('recover')) {
        this.$main.removeClass('recover');
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
