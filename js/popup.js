$(document).ready(function(){
	initPopups();
	initAjaxForms();
});

function initAjaxForms(){
    $('.ajax-form').on('submit', function(){
        var form = $(this),
            data = form.serialize(),
            formResult = form.find('.form-result');
        $.ajax({
            url: form.attr('action'),
            beforeSend: function() {
                form.addClass('sending');
                form.find('[type="submit"]').prop('disabled', true);
                form.find('.error-block').each(function() {
                    $(this).remove();
                });
                formResult.empty();
            },
            data: data,
            type: form.attr('method'),
            success: function(resp) {
                if (form.attr('data-form-name') == 'CardForm') {
                    gtag('event', 'form_sent', {'event_category': 'card'});
                }
                if (form.attr('data-form-name') == 'NewsForm') {
                    gtag('event', 'form_sent', {'event_category': 'promotion'});
                }
                if (form.attr('data-form-name') == 'ServiceForm') {
                    gtag('event', 'form_sent', {'event_category': 'service'});
                }
                if(resp.msg) {
                    form.removeClass('sending');
                    form.addClass('success-send');
                    formResult.html('<h4 class="result-msg">'+resp.msg+'</h4>');
                } else {
                    form.removeClass('sending');
                    form.find('.btn').prop('disabled', false);
                    if(resp.errors) {
                        var formName = $(this).attr('data-form-name');
                        $.each(resp.errors, function(key, val) {
                            var inputName = formName + '[' + key + ']';
                            $('[name="'+inputName+'"]').after("<div class=\"error-block\">"+val+"</div>");
                            if(key == 500) {
                                formResult.html('<h4 class="error-msg">'+resp.msg+'</h4>');
                            }
                        });
                    }
                }
            }
        });
        return false;
    });
}

function initPopups(){
    $('body')
        .popup({
            "opener":".open-card-callback-popup",
            "popup_holder":"#card-callback-popup",
            "beforeOpen": function(popup){
                var cardId = $(this).attr('data-card');
                popup.find('.form_card').val(cardId);
            }
        });
    // $('body')
    //     .popup({
    //         "opener":".open-direction-event-callback-popup",
    //         "popup_holder":"#direction-event-callback-popup",
    //         "beforeOpen": function(popup){
    //             var eventId = $(this).attr('data-event');
    //             popup.find('.form_event').val(eventId);
    //         }
    //     });
    // $('body')
    //     .popup({
    //         "opener": ".open-service-callback-popup",
    //         "popup_holder": "#service-callback-popup",
    //         "beforeOpen": function(popup){
    //             var serviceId = $(this).attr('data-service'),
    //                 subServiceId = $(this).attr('data-sub-service');

    //             popup.find('.form_service').val(serviceId);
    //             if(subServiceId) {
    //                 popup.find('.form_sub_service').val(subServiceId);
    //             }
    //         }
    //     })
}

$.fn.popup = function(o){
    if(o === 'show'){
        this.fadeIn();
        $(window).resize();
    }
    if(o === 'hide'){
        this.fadeOut();
    }
    var o = $.extend({
        "opener":".call-back a",
        "popup_holder":"#call-popup",
        "popup":".popup",
        "close_btn":".close-popup",
        "close":function(){},
        "beforeOpen": function(popup) {

        },
        "beforeOpenCallback": function(popup) {
            $(popup).css({}).hide();
        },

    },o);
    return this.each(function(){
        var container=$(this),
            opener=$(o.opener,container),
            popup_holder=$(o.popup_holder,container),
            popup=$(o.popup,popup_holder),
            close=$(o.close_btn,popup),
            bg=$('.bg',popup_holder);
        popup.css('margin',0);
        opener.click(function(e){
            o.beforeOpen.apply(this,[popup_holder]);
            o.beforeOpenCallback.apply(this, [popup_holder]);
            popup_holder.css('left',0);
            popup_holder.fadeIn(350);
            alignPopup();
            bgResize();
            e.preventDefault();
            $(window).resize();
        });
        function alignPopup(){
            var deviceAgent = navigator.userAgent.toLowerCase();
            var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/i);
            // if(agentID){
            //     if(popup.outerHeight()>window.innerHeight){
            //         popup.css({'top':$(window).scrollTop(),'left': ((window.innerWidth - popup.outerWidth())/2) + $(window).scrollLeft()});
            //         return false;
            //     }
            //     popup.css({
            //         // 'top': ((window.innerHeight-popup.outerHeight())/2) + $(window).scrollTop(),
            //         'left': ((window.innerWidth - popup.outerWidth())/2) + $(window).scrollLeft()
            //     });
            // } else {
            //     if(popup.outerHeight()>$(window).outerHeight()){
            //         popup.css({'top':$(window).scrollTop(),'left': (($(window).width() - popup.outerWidth())/2) + $(window).scrollLeft()});
            //         return false;
            //     }
            //     popup.css({
            //         // 'top': (($(window).height()-popup.outerHeight())/2) + $(window).scrollTop(),
            //         'left': (($(window).width() - popup.outerWidth())/2) + $(window).scrollLeft()
            //     });
            // }
        }
        function bgResize(){
            var _w=$(window).width(),
                _h=$(document).height();
            bg.css({"height":_h,"width":_w+$(window).scrollLeft()});
        }
        $(window).resize(function(){
            if(popup_holder.is(":visible")){
                bgResize();
                alignPopup();
            }
        });
        if(popup_holder.is(":visible")){
            bgResize();
            alignPopup();
        }
        close.add(bg).click(function(e){
            var closeEl=this;
            popup_holder.fadeOut(350,function(){
                o.close.apply(closeEl,[popup_holder]);
            });
            e.preventDefault();
        });
        $('body').keydown(function(e){
            if(e.keyCode=='27'){
                popup_holder.fadeOut(350);
            }
        });
    });
};


