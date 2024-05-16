$(document).ready(function(){
    $('.offers__slider-left').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      speed: 1200,
      nextArrow: $('.btn-slider-left')
    });
    $('.offers__slider-right').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      speed: 1200,
      nextArrow: $('.btn-slider-right')
    });
  });

 