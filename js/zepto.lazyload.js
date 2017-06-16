/**
 * Zepto picLazyLoad Plugin v1.0
 * by iwenli
 * 2017年6月16日14:23:22
 * example: $(_this).find(".m-lazy").lazyload({ threshold: 180, container: '#page-index-index .content' });
 */
; (function ($) {
    $.fn.lazyload = function (settings) {
        var $this = $(this)
            , _winScrollTop = 0
            , _winHeight = $(window).height();
        settings = $.extend({
            container: 'window',
            threshold: 0,
            placeholder: 'data:image/png;base64,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'
        }, settings || {});
        lazyload();
        $(settings.container).on('scroll', function () {
            _winScrollTop = $(this).scrollTop();
            lazyload();
        });
        function lazyload() {
            $this.each(function () {
                var $self = $(this);
                if ($self.is('img')) {
                    if ($self.attr('data-original')) {
                        var _offsetTop = $self.offset().top;
                        if ((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)) {
                            $self.attr('src', $self.attr('data-original'));
                            $self.removeAttr('data-original');
                        }
                    }
                } else {
                    if ($self.attr('data-original')) {
                        if ($self.css('background-image') == 'none') {
                            $self.css('background-image', 'url(' + settings.placeholder + ')');
                        }
                        var _offsetTop = $self.offset().top;
                        if ((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)) {
                            $self.css('background-image', 'url(' + $self.attr('data-original') + ')');
                            $self.removeAttr('data-original');
                        }
                    }
                }
                $self.height($self.width());  //动态设置图片高宽为（方图）
            });
        }
    }
})(Zepto);
