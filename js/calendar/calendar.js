$(function () {
    var loaded = false;
    var p = navigator.platform;
    var iOS = false;
    var iOld = false;
    var iHeight = 0;
    var iWidth = 0;
    var iOrient = 0; //0=portrait
    var angle = 0;

    var height = 0;
    var width = 0;
    var contentHeight = 0;
    var sliderInstance;

    function doOnOrientationChange()
    {
        switch(window.orientation)
        {
            case -90:
            case 90:
                iOrient = 1;
                break;
            default:
                iOrient = 0;
                break;
        }
    }

    /* Show popup message */
    function ShowMessage(title, text, seo) {
        var pp = '<div class="msg-popup"><div class="pp-bg"></div><div class="pp-content"><div class="pp-wrp"><a href="" class="pp-close"></a><h3>[title]</h3><p>[content]</p></div></div></div>';

        if ($(".msg-popup").length > 0) {
            $(".msg-popup").empty().remove();
        }

        $("body").append(pp.replace("[title]", title).replace("[content]", text));

        if(typeof(seo) !== 'undefined' && seo == 1)
            $(".msg-popup").addClass("gray-popup");

        $(".msg-popup").fadeIn();
        var popMargTop = ($(".msg-popup .pp-content").height()) / 2;
        var popMargLeft = ($(".msg-popup .pp-content").width()) / 2;
        $(".msg-popup .pp-content").css({
            'margin-top' : -popMargTop,
            'margin-left' : -popMargLeft
        });

        //Close Popups and Fade Layer
        $('.msg-popup a.pp-close, .msg-popup .pp-bg').bind('click', function (e) {
            e.preventDefault();
            $('.msg-popup').fadeOut(function () {
                $('.msg-popup').remove();
            });
            return false;
        });
    }


    function updateCarousel() {
        if($(window).innerWidth() < 767){
            var defaultItemsPerMove = 1;
        }

        if ($(".touchcarousel").length > 0) {
            var itemsPerMove = 1;
            var btf = 0.0008;
            if ($(".timeline").length > 0){
                itemsPerMove = (defaultItemsPerMove != undefined) ? defaultItemsPerMove : 4;
            }
            /* TODO : Fix scroll behavior */
            $(".touchcarousel").bind("mousewheel", function(event, delta, deltaX, deltaY){
                var dX = 1 * delta * 40;
                if (navigator.appVersion.indexOf("Mac")!=-1)
                    dX = 0.13 * delta * 40;

                var end = sliderInstance.items[0].width * itemsPerMove + dX;
                if(delta != 0 && sliderInstance._getXPos() <= 0 && Math.abs(sliderInstance._getXPos())+dX <= sliderInstance._totalItemsWidth)
                    sliderInstance.setXPos(sliderInstance._getXPos() + dX);

                if(sliderInstance._getXPos() > 0)
                    sliderInstance.setXPos(0);

                if(Math.abs(sliderInstance._getXPos()) > sliderInstance._totalItemsWidth-sliderInstance.items[0].width*itemsPerMove)
                    sliderInstance.setXPos(-1 * (sliderInstance._totalItemsWidth-sliderInstance.items[0].width*itemsPerMove));

                //return false;
            });


            if (!sliderInstance) {
                try{
                    sliderInstance = $(".touchcarousel").touchCarousel({
                        itemsPerMove : itemsPerMove,
                        scrollbar : false,
                        pagingNav : false,
                        snapToItems : true,
                        scrollToLast : true,
                        useWebkit3d : true,
                        loopItems : false,
                        pagingNavControls : false,
                        directionNav : false,
                        keyboardNav : false
                    }).data("touchCarousel");
                }catch(ex){
                }

                if ($('.scroll-blocks, .scroll-arrows').length > 0) {
                    $('.scroll-blocks a[href="#prev"], .scroll-arrows.prev').click(function (e) {
                        e.preventDefault();
                        sliderInstance.prev();
                        return false;
                    });
                    $('.scroll-blocks a[href="#next"], .scroll-arrows.next').click(function (e) {
                        e.preventDefault();
                        var end = sliderInstance.items[0].width * sliderInstance.settings.itemsPerMove;
                        if(Math.abs(sliderInstance._getXPos()) + end < sliderInstance._totalItemsWidth)
                            sliderInstance.next();
                        return false;
                    });
                }
            } else {
                sliderInstance.updateCarouselSize();
            }
        }
    }

    function resize() {
        if(iOS){
            width = iWidth;
            height = iHeight;
        }else{
            width = window.innerWidth ? window.innerWidth : $(window).width();
            height = window.innerHeight ? window.innerHeight : $(window).height();
            height = (height < 550) ? 550 : height;
        }

        var headerHeight = 1;
        contentHeight = height - headerHeight;
        contentHeight = (contentHeight < 370) ? 370 : contentHeight;

        $(".page-content-wrp").css('paddingTop', headerHeight + 'px');
        $(".nav-left-block").height(contentHeight);
        if ($(".content-blocks").length > 0)
            $(".content-blocks").height(contentHeight);



        if ($(".size-fit").length > 0) {
            var x = $(".size-fit").css("max-height");
            var size = contentHeight;
            if (x != 0 && size > x)
                size = x;

            $(".size-fit").width(size).height(size);
        }
        if ($(".size-fit-half").length > 0) {
            $(".size-fit-half").width(contentHeight / 2).height(contentHeight / 2);
        }
        if ($(".team .content-blocks .block-item").length > 0) {
            var x = $(".team .content-blocks .block-item").css("max-width");
            var size = contentHeight/2;
            if (x != 0 && size > x)
                size = x;
            $(".team .content-blocks .block-item").width(size*2).height(size);
        }
        if ($(".content-blocks").length > 0) {
            $(".content-blocks .wrp").width($(".content-blocks .wrp .block-item").width() * ($(".content-blocks .wrp .block-item").length + 1));
        }

        if ($(".index-page .content-blocks").length > 0) {
            $(".content-blocks .block-item").width(width).height(contentHeight);
            $(".content-blocks .block-item .nav-right-block").height(contentHeight);
            $(".content-blocks .wrp").width("100%");

            $(".index-page .nav-left-block .sub-nav").css({
                "max-height" : contentHeight - $(".index-page .nav-left-block .purp").outerHeight(true)
            });

            if (!sliderInstance) {
                sliderInstance = $(".royalSlider").royalSlider({
                    slidesSpacing : 0,
                    loopRewind : true,
                    keyboardNavEnabled : true

                }).data('royalSlider');
                $(".royalSlider").bind("mousewheel", function(event, delta, deltaX, deltaY){
                    if(delta > 0)
                        sliderInstance.prev();
                    else
                        sliderInstance.next();
                });
                sliderInstance.updateSliderSize(false);
                if ($('.scroll-arrow').length > 0) {
                    $('a.scroll-arrow[href="#prev"]').click(function (e) {
                        e.preventDefault();
                        sliderInstance.prev();
                        return false;
                    });
                    $('a.scroll-arrow[href="#next"]').click(function (e) {
                        e.preventDefault();
                        sliderInstance.next();
                        return false;
                    });
                }
            } else {
                sliderInstance.updateSliderSize(true);
            }
        }

        if (!$(".news-popup").length) {
            updateCarousel();
        }

        if ($(".scroll-blocks").length > 0) {
            var h = contentHeight - $(".content-blocks .block-text").outerHeight();
            if (h > contentHeight / 2)
                h = contentHeight / 2;
            if (h > 240)
                h = 240;
            if ($(".size-fit-half").length > 0) {
                h = $(".content-blocks .block-item").outerHeight();
            }
            if ($(".about .block-item ").length > 0) {
                h = $(".content-blocks .block-item").outerHeight() / 2;
            }
            $(".scroll-blocks").width(h / 2).height(h);
        }

        if ($(".timeline .nav-left-block, .timeline .table-column").length > 0) {
            $(".timeline .nav-left-block, .timeline .table-column").height(contentHeight);
            $(".timeline .wrp").width($(".wrp .table-column").width() * ($(".wrp .table-column").length + 1));
        }

        /* Re-blur */
        if(!iOld && loaded){
            $('.blur').blurjs({
                source : '.block-item',
                radius : 30,
                optClass : 'blured',
                cacheKeyPrefix : 'blurjs-',
                cache : false
            });
        }
    }

    /* =TEAM */
    /* Team Items regroup */
    if ($(".team").length > 0) {

        /* Items regroup */
        var arr = [];
        var list = $('.team .block-item');
        for (var i = 0; i < list.length; i++) {
            if ((i + 1) % 2 != 0) {
                arr.push($("<li class='sub-wrp touchcarousel-item' />").append(list[i], list[i + 1]));
            }
        }
        $('.team .block-item').remove();
        $('.team .wrp').append($("<ul class='touchcarousel-container'/>").append(arr));

        /* TODO : Correct size calculations */
        $('.team .wrp ul').width(Math.ceil($(".team .wrp .sub-wrp").length) * ($(".team .wrp .sub-wrp").outerWidth() + 1));

        /* Managers dropdown */
        $('a[href="#managers"]').click(function (e) {
            e.preventDefault();
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(".dd-menu").slideUp();
            } else {
                $(this).addClass("active");
                $(".dd-menu").slideDown();
            }
            return false;
        });
    }
    /* !TEAM */

    /* =SHEDULE */
    if ($(".table-cell").length > 0){
        if($(".man-shedule-edit").length == 0) {
            /* Remove empty columns */
            $(".wrp .table-column").each(function () {
                if ($(".table-cell .one-prog", $(this)).length == 0)
                    $(this).remove();
            });
        }

        /* Line hover selection */
        $(".table-cell:not(.table-header)").hover(function () {
            var tdIndex = $(this).index();
            $(".table-cell").removeClass("selected").removeClass("off");
            $(".nav-left-block .table-cell:eq(" + tdIndex + ")").prev().addClass("off");
            $(".table-column").each(function () {
                $(".table-cell", this).eq(tdIndex).addClass("selected");
            });
        }, function () {
            $(".table-cell").removeClass("selected").removeClass("off");
            $(".table-cell:after").show();
        });

        /* Dropdown menu */
        $(".table-cell.table-header > a").click(function (e) {
            e.preventDefault();
            var top = $(".table-cell").height();
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $('.dd-menu').slideUp();
            } else {
                $(this).addClass("active")
                $('.dd-menu').css({
                    "top" : top + "px"
                }).slideDown();
            }
            return false;
        });
    }
    /* !SHEDULE */

    /* AFTER LOAD IMAGES */
    /* ================== */

    $(window).on('load', function () {
        /* Preloader */
        loaded = true;
        resize();

        /* First blur */
        if(!iOld){
            setTimeout(function(){
                $('.blur').blurjs({
                    source : '.block-item',
                    optClass : 'blured',
                    radius : 30,
                    cache: false
                });
            },100);

            setTimeout(function(){
                $('.blur').blurjs({
                    source : '.block-item',
                    optClass : 'blured',
                    radius : 30,
                    cache: false
                });
            },1000);
        }

    });
    /* !AFTER LOAD IMAGES */
    /* resize(); */
    if(!iOS)
        $(window).resize(resize);

    /* =======
     TRASH
     ========*/
    /* TIMELINE */
    if ($(".timeline .table-cell").length > 0) {
        function oneProgAction(e) {
            var cell = $(this).parents(".table-cell");
            var point = $(".timeline-point",this);
            var pw = point.get(0).clientWidth;
            var ph = point.get(0).clientHeight;
            var pleft=0,ptop = 0; //point window width

            var pp = point.position(); //point window left & top
            var po = point.offset();

            if (po.top + ph > height - 60) {
                ptop = (po.top + ph) - height;
            }

            point.css({
                "top" : 0 - Math.abs(ptop)
            });
            $(".one-prog").removeClass("active");
            $(this).addClass("active");

            return false;
        }
        if(!iOS)
            $(".one-prog").hover(oneProgAction, function (){$(".one-prog").removeClass("active");});
        else
            $(".one-prog").bind("touchstart",oneProgAction);
    }

    $(document).ready(function(){
        resize();
    });

});