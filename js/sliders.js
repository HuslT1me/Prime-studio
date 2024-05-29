$(document).ready(function () {
  $('.offers__slider-left').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    speed: 1200,
    nextArrow: $('.btn-slider-left'),
  });
  $('.offers__slider-right').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    speed: 1200,
    nextArrow: $('.btn-slider-right'),
  });
});

$(document).ready(function () {
  $('.reviews__slider').slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    vertical: true,
    verticalSwiping: true,
    prevArrow: false,
    nextArrow: $('.reviews__slider-btn'),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
          vertical: false,
          verticalSwiping: false,
          dots: true,
        },
      },
    ],
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const videoList = Array.from(document.querySelectorAll('.reviews__video'));
  const btnList = Array.from(document.querySelectorAll('.button-video'));

  btnList.forEach((btn) => {
    btn.addEventListener('click', (evt) => {
      evt.stopPropagation();
      const slide = evt.target.closest('.reviews__slide');
      const video = slide.querySelector('.reviews__video');
      if (video.classList.contains('muted-video')) {
        video.classList.remove('muted-video');
        btn.classList.remove('btn-muted');
        video.muted = false;
      } else {
        video.classList.add('muted-video');
        btn.classList.add('btn-muted');
        video.muted = true;
      }
    });
  });

  const sliderContainer = document.querySelector('.reviews__slider');

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        videoList.forEach((video) => {
          if (video.closest('.slick-current')) {
            if ( video.readyState === 4 ) {
              video.play();
          } else {
            video.load();
            video.addEventListener('loadstart',() => addClass);
            video.addEventListener('canplay', () => removeClass);
            video.play();
          }
            // video.removeEventListener('loadstart', addClass);
            // video.removeEventListener('canplay', removeClass);
          }
        });
      } else {
        videoList.forEach((video) => {
          video.pause();
        });
      }
    });
  };

  function addClass() {
    const slideActive = sliderContainer.querySelector('.slick-current');
    const spinner = slideActive.querySelector('.spinner');
    spinner.classList.add('loading');
  }

  function removeClass() {
    const slideActive = sliderContainer.querySelector('.slick-current');
    const spinner = slideActive.querySelector('.spinner');
    console.log(spinner);
    spinner.classList.remove('loading');
  }

  const options = {
    rootMargin: '200px 0px 200px 0px',
    threshold: 1,
  };

  const observer = new IntersectionObserver(callback, options);

  observer.observe(sliderContainer);

  const slideshow = $('.reviews__slider');
  // Run when slides change
  slideshow.on('afterChange', function (event, slick, currentSlide) {
    console.log('change');

    videoList.forEach((video) => {
      if (video.closest('.slick-current')) {
        video.load();
        video.addEventListener('loadstart', addClass);
        video.addEventListener('canplay', removeClass);
        video.play();
        // video.removeEventListener('loadstart', addClass);
        // video.removeEventListener('canplay', removeClass);
      } else {
        video.load();
      }
    });
  });
});
