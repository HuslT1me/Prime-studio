let isSendForm = false;

$(document).ready(function(){
	initPopups();
	initAjaxForms();
    $('input[type="tel"], input.tel').inputmask({
        mask: '+7 (999) 999-99-99',
        showMaskOnHover: false
    });
});

function initAjaxForms(){
    $('body').on('beforeSubmit', '.ajax-form', function (e) {
        e.preventDefault();

        const form = $(this),
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
            cache: false,
            success: function(resp) {
                if(resp.success === true) {
                    console.log('success ok');

                    form.removeClass('sending');
                    form.addClass('success-send');
                    formResult.html('<h4 class="result-msg">'+resp.message+'</h4>');
                    isSendForm = true;
                } else {
                    console.log('success false');

                    form.removeClass('sending');
                    form.find('.btn').prop('disabled', false);

                    if(resp.errors) {
                        $.each(form.find(".help-block"), function() {
                            $(this).empty();
                            $(this).closest(".form-group").removeClass("has-error");
                        });
                        $.each(resp.errors, function(key, val) {
                            form.find(".field-" + key +" .help-block").empty().html(val);
                            form.find(".field-" + key).addClass("has-error");
                        });
                    }
                }
            },
            error: function(resp){
                if(resp.status && resp.status === 500) {
                    formResult.html('<h4 class="error-msg">'+resp.responseJSON.message+'</h4>');
                }
                console.log(data);
            }
            /*statusCode: {
                500: function(data) {
                    alert(data);
                }
            }*/
        });
        return false;
    });

    $('body').on('beforeSubmit', 'form.pay-form', function (e) {
        e.preventDefault();

        const form = $(this),
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
            cache: false,
            success: function(resp) {
                if(resp.success === true && resp.confirm_url) {
                    console.log('success ok');

                    form.removeClass('sending');
                    form.addClass('success-send');
                    formResult.html('<h4 class="result-msg">'+resp.message+'</h4>');

                    window.location = resp.confirm_url;
                    // window.open(resp.confirm_url, '_blank').focus();
                } else {
                    console.log('success false');

                    form.removeClass('sending');
                    form.find('.btn').prop('disabled', false);

                    if(resp.error && resp.error.description) {
                        formResult.html('<h4 class="error-msg">'+resp.error.description+'</h4>');
                    }

                    if(resp.errors) {
                        console.log('asdasd');

                        $.each(form.find(".help-block"), function() {
                            $(this).empty();
                            $(this).closest(".form-group").removeClass("has-error");
                        });
                        $.each(resp.errors, function(key, val) {
                            form.find(".field-" + key +" .help-block").empty().html(val);
                            form.find(".field-" + key).addClass("has-error");
                        });
                    }
                }
            },
            error: function(resp){
                if(resp.status && resp.status === 500) {
                    formResult.html('<h4 class="error-msg">'+resp.responseJSON.message+'</h4>');
                }
                console.log(data);
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

    $('body')
        .popup({
            "opener":".open-pay-card-callback-popup",
            "popup_holder":"#pay-card-callback-popup",
            "beforeOpen": function(popup) {
                popup.find('#productTitleBox').empty().html($(this).attr('data-product_title'));
                popup.find('#bundleTitleBox').empty().html($(this).attr('data-bundle_title'));

                popup.find('#customer-product_id').val($(this).attr('data-product_id'));
                popup.find('#customer-bundle_id').val($(this).attr('data-bundle_id'));
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

