/*
Author : Raphaël Dardeau


Setup exemple : 

$(function() {
    $("body").textShare({
        filters: 'p, span, .heading',
        minChars: 3,
        maxChars: 140,
        tpl: '<div class="share js-textShare"><a href="#" class="share__icon share__icon--twitter" data-share="twitter"></a></div>',
        onload: function(element, text) {
            console.log(text);
        }
    });
*/

;(function ( $, window, document, undefined ) {
    var pluginName = "textShare",
        defaults = {
        	filters: '*',
            minChars: false,
        	maxChars: false,
            tpl: '<div class="js-textShare"></div>',
			onload: function() {}
        };		

    function Plugin( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {

        init: function() {
			this.$element = $(this.element);
			if (typeof window.getSelection != "undefined")
                this.setEvents();
		},

		setEvents: function() {
            this.$element.on("mouseup", $.proxy(function (e) {
                setTimeout($.proxy(function() {
                    var _this = this;
                    var $target = $(e.target);
                    if (!$target.parents(".js-textShare").length) {
                        var sel = window.getSelection();
                        var selContainer = document.createElement("div");
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            selContainer.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                        var text = selContainer.innerHTML;
                        if ($target.filter(this.settings.filters).length && text && (!this.settings.minChars || text.length > this.settings.minChars) && (!this.settings.maxChars || text.length < this.settings.maxChars)) {
                            sRange = sel.getRangeAt(0);
                            sPos = sRange.getBoundingClientRect();
							$target.after(this.settings.tpl);
							var $textShare = $target.next(".js-textShare");
                            $textShare.css({position:'fixed', zIndex:1000, top:sPos.top +'px', marginTop:sPos.height +'px', left:sPos.left +'px'});
                            var marginLeft = sPos.width / 2 - $textShare.outerWidth() / 2;
                            var lineHeight = isNaN(parseInt($target.css("lineHeight"))) ? $target.height() : parseInt($target.css("lineHeight"));
                            if (sPos.height > lineHeight + 2)
                                marginLeft = 0;
                            $textShare.css({marginLeft: marginLeft});
							this.settings.onload($textShare, text);
                        }
                    }
                }, this), 10);
            }, this));
            $(document).on("mousedown", $.proxy(function (e) {
                var $target = $(e.target);
                if ($(".js-textShare").length && !$target.parents(".js-textShare").length && !$target.hasClass("js-textShare"))
                    $(".js-textShare").remove();
            }, this));
            $(window).on("scroll", function (e) {
                if ($(".js-textShare").length)
                    $(".js-textShare").remove();
            });
		}
		
    });

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );