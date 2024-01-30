$(document).ready(function () {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)
  gsap.registerPlugin(CustomEase)

  const lenis = new Lenis()

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  // Header Variables
  const siteContainer = $('.site-container')
  const header = $('.header')
  const menu = $('.menu')
  const burgerButton = $('.header__burger')
  const closeBurgerButton = $('.menu__close')

  // Header
  burgerButton.on('click', (event) => {
    event.preventDefault()
    menu.addClass('active')
    siteContainer.addClass('overflow')
  })

  closeBurgerButton.on('click', (event) => {
    event.preventDefault()
    menu.removeClass('active')
    siteContainer.removeClass('overflow')
  })

  siteContainer.on('click', (event) => {
    if ($(event.target).is(siteContainer)) {
      menu.removeClass('active')
      siteContainer.removeClass('overflow')
    }
  })

  function fixHeader() {
    if ($(document.documentElement).scrollTop() <= 0) {
      header.removeClass('fixed')
    } else {
      header.addClass('fixed')
    }
  }

  // Slogan
  function sloganAnimate() {
    if ($(window).width() > 768) {
      let sloganTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.slogan',
          start: 'bottom bottom',
          end: 'bottom 15%',
          scrub: 1.2,
        },
      })
      sloganTl.to('.slogan__title', {
        x: () => document.documentElement.offsetWidth - document.querySelector('.slogan__title').scrollWidth,
        ease: 'power3.inOut',
      })
    }
  }

  // Cell section Variables
  const cellBullets = $('.cell__bullets-item')
  const cellSlides = $('.cell__slides-item')
  let cellSlideCounter = 1
  let isCellSlideAnimating = false // only for mobile

  function initCellAnimate() {
    if ($(window).width() >= 1024) {
      let cellTl = gsap.timeline({
        defaults: { duration: 1 },
      })

      ScrollTrigger.create({
        animation: cellTl,
        trigger: '.cell',
        start: 'top 15%',
        end: '+=3500px',
        scrub: 1.2,
        pin: true,
        onUpdate: ({ progress }) => {
          let currentProgress = Math.ceil((progress * 100) / 20 - 1) >= 0 ? Math.ceil((progress * 100) / 20 - 1) : 0
          $('.cell__slides').css('height', `${cellSlides[3].offsetHeight}px`)
          cellBullets.removeClass('active')
          cellBullets.eq(currentProgress).addClass('active')
        },
      })

      cellTl.from('.cell__wrapper', {
        x: 100,
        opacity: 0,
      })

      cellSlides.each(function (index, item) {
        $('.cell__slides').css('height', `${item.offsetHeight}px`)
        if (index == 4) {
          cellTl
            .fromTo(
              item,
              {
                y: '100%',
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
              },
              '<'
            )
            .fromTo(
              '.cell__button',
              {
                opacity: 0,
              },
              {
                opacity: 1,
              },
              '>'
            )
          return
        }
        cellTl
          .fromTo(
            item,
            {
              y: '100%',
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
            },
            '<'
          )
          .to(
            item,
            {
              opacity: 0,
            },
            '>'
          )
          .fromTo(
            cellSlides[index + 1],
            {
              y: '100%',
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
            },
            '>'
          )
      })
    } else {
      // Mobile
      cellBullets.eq(0).addClass('active')
      gsap.set(cellSlides.eq(0), {
        opacity: 1,
        ease: 'power3.out',
      })

      $('.cell__slides').css('height', `${cellSlides[0].offsetHeight}px`)

      // Handle click on bullets
      cellBullets.each(function (index, item) {
        $(item).on('click', () => {
          if ($(item).hasClass('active')) {
            return
          }
          if (isCellSlideAnimating) return
          isCellSlideAnimating = true
          $('.cell__slides').css('height', `${cellSlides[index].offsetHeight + 1}px`)
          cellSlideCounter = index + 1
          $('.cell__wrapper-current').text(cellSlideCounter)

          cellBullets.removeClass('active')
          cellSlides.each(function (index, item) {
            gsap.to(item, {
              opacity: 0,
              duration: 0.3,
              ease: 'power3.out',
            })
            $(item).removeClass('active')
          })

          $(item).addClass('active')
          cellSlides.eq(index).addClass('active')

          gsap.fromTo(
            cellSlides[item.dataset.number],
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              delay: 0.6,
              ease: 'power3.out',
              onComplete: () => {
                isCellSlideAnimating = false
              },
            }
          )

          if (item.dataset.number === '4') {
            gsap.fromTo(
              '.cell__button',
              {
                opacity: 0,
              },
              {
                opacity: 1,
                delay: 1,
                ease: 'power3.out',
                onComplete: () => {
                  isCellSlideAnimating = false
                },
              }
            )
          }
        })
      })

      $('.cell__slides').on('touchstart', handleTouchStart)
      $('.cell__slides').on('touchmove', handleTouchMove)

      let xDown = null
      let yDown = null

      function swipeSlide(direction) {
        if (!isCellSlideAnimating) {
          isCellSlideAnimating = true
          const currentSlide = $('.cell__slides-item.active')
          const currentBullet = $('.cell__bullets-item.active')
          let nextSlide
          let nextBullet
          if (direction === 'right') {
            nextSlide = currentSlide.next() ?? null
            nextBullet = currentBullet.next() ?? null
          } else {
            nextSlide = currentSlide.prev() ?? null
            nextBullet = currentBullet.prev() ?? null
          }

          if (nextSlide && nextBullet) {
            cellSlideCounter = Number(nextBullet.data('number')) + 1
            $('.cell__wrapper-current').text(cellSlideCounter)
            $('.cell__slides').css('height', `${nextSlide[0].offsetHeight + 1}px`)

            currentSlide.removeClass('active')
            gsap.to(currentSlide, {
              opacity: 0,
              ease: 'power3.out',
            })
            currentBullet.removeClass('active')

            setTimeout(() => {
              nextSlide.addClass('active')
              gsap.fromTo(
                nextSlide,
                {
                  opacity: 0,
                  y: 20,
                },
                {
                  opacity: 1,
                  y: 0,
                  ease: 'power3.out',
                  delay: 0.5,
                  onComplete: () => {
                    isCellSlideAnimating = false
                  },
                }
              )
              if (nextBullet.data('number') == '4') {
                gsap.fromTo(
                  '.cell__button',
                  {
                    opacity: 0,
                  },
                  {
                    opacity: 1,
                    ease: 'power3.out',
                    delay: 1,
                    onComplete: () => {
                      isCellSlideAnimating = false
                    },
                  }
                )
              }

              nextBullet.addClass('active')
            }, 300)
          }
          return false
        }
        return false
      }

      function getTouches(evt) {
        return evt.touches
      }

      function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0]
        xDown = firstTouch.clientX
        yDown = firstTouch.clientY
      }

      function handleTouchMove(evt) {
        if (!xDown || !yDown) {
          return
        }

        let xUp = evt.touches[0].clientX
        let yUp = evt.touches[0].clientY

        let xDiff = xDown - xUp
        let yDiff = yDown - yUp

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (xDiff > 0) {
            swipeSlide('right')
          } else {
            swipeSlide('left')
          }
        } else {
          if (yDiff > 0) {
          } else {
          }
        }

        xDown = null
        yDown = null
      }
    }
  }

  // System
  let tlSystem
  if ($(window).width() >= 768) {
    tlSystem = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power3.out',
      },
    })
    tlSystem
      .from('.system__title', {
        opacity: 0,
        y: '100%',
      })
      .from(
        '.system__descr',
        {
          opacity: 0,
        },
        '>20%'
      )
      .from(
        '.system__text',
        {
          opacity: 0,
          rotation: 10,
          y: '100%',
        },
        '>10%'
      )
      .from(
        '.system__label',
        {
          opacity: 0,
        },
        '>10%'
      )
      .from(
        '.system__container--second .system__column--left',
        {
          opacity: 0,
          x: '-100%',
        },
        '>10%'
      )
      .from(
        '.system__container--second .system__column--right .system__information',
        {
          opacity: 0,
          x: '100%',
          stagger: 0.6,
        },
        '>10%'
      )
    if ($(window).width() >= 1024) {
      ScrollTrigger.create({
        animation: tlSystem,
        trigger: '.system',
        start: '+=3300',
        once: true,
      })
    } else {
      ScrollTrigger.create({
        animation: tlSystem,
        trigger: '.system',
        start: 'center 15%',
        end: 'bottom top',
        once: true,
      })
    }
  } else {
    // Mobile animation
  }

  // Advantages

  function initAdvantagesAnimation() {
    if ($(window).width() > 1024) {
      let advantagesTl = gsap.timeline({
        defaults: { duration: 1, ease: 'power3.out' },
      })

      advantagesTl
        .from('.advantages__title', {
          x: '-100%',
          opacity: 0,
        })
        .from(
          '.advantages__link',
          {
            x: '100%',
            opacity: 0,
          },
          '<'
        )
        .from('.advantages__slider-item', {
          opacity: 0,
          duration: 0.6,
        })
        .from(
          '.advantages__slider-item',
          {
            x: (index) => {
              const marginRight = 10
              return -$('.advantages__slider-item').outerWidth() * index - (index === 0 ? 0 : marginRight * index)
            },
            ease: CustomEase.create(
              'custom',
              'M0,0 C0.083,0.294 0.161,0.712 0.418,0.964 0.458,1.003 0.528,1.025 0.619,1.015 0.849,0.989 0.863,1 1,1 '
            ),
            stagger: false,
            duration: 1.5,
          },
          '>25%'
        )
        .fromTo(
          '.advantages__slider-item',
          {
            boxShadow: '0px 0px 0px 0px rgba(61, 62, 72, 0.15)',
          },
          {
            boxShadow: '25px 40px 60px 0px rgba(61, 62, 72, 0.15)',
          },
          '<'
        )
        .from(
          '.advantages__slider-controls--desktop',
          {
            visibility: 'hidden',
            opacity: 0,
          },
          '<'
        )
      ScrollTrigger.create({
        animation: advantagesTl,
        trigger: '.advantages',
        start: 'top center',
        once: true,
      })
    } else {
      // Mobile animation
    }
  }

  let isReinitializedOnMobile = false

  function destroyAndReinitializeAdvantagesSlider() {
    const advantagesSlider = $('.advantages__slider-wrapper')
    if ($(window).width() > 1024) {
      if (isReinitializedOnMobile) isReinitializedOnMobile = false // необходимо для очистки флага инициализации слайдера на мобильном устройстве
      if (advantagesSlider.hasClass('slick-initialized')) {
        advantagesSlider.slick('unslick')
      }
      advantagesSlider.slick({
        nextArrow: $('.advantages__slider-controls--desktop .advantages__slider-button--next'),
        prevArrow: $('.advantages__slider-controls--desktop .advantages__slider-button--prev'),
        infinite: false,
        adaptiveHeight: true,
        draggable: false,
        slidesToShow: 4,
        slidesToScroll: 2,
        responsive: [
          {
            breakpoint: 1270,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
        ],
      })
    } else {
      if (!isReinitializedOnMobile) {
        if (!advantagesSlider.hasClass('slick-initialized')) {
          isReinitializedOnMobile = true
          advantagesSlider.slick({
            nextArrow: $('.advantages__slider-controls--mobile .advantages__slider-button--next'),
            prevArrow: $('.advantages__slider-controls--mobile .advantages__slider-button--prev'),
            infinite: false,
            adaptiveHeight: true,
            swipe: true,
            swipeToSlide: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: 960,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 650,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  variableWidth: true,
                },
              },
            ],
          }) // переназначаем настройки слайдера если окно браузера < 1024px
        } else {
          advantagesSlider.slick('unslick')
        }
      }
    }
  }

  destroyAndReinitializeAdvantagesSlider()

  $(window).on('resize', function () {
    destroyAndReinitializeAdvantagesSlider()
  })

  // Discovery

  function initDiscoveryAnimation() {
    if ($(window).width() >= 1024) {
      let discoveryTl = gsap.timeline({
        defaults: {
          duration: 1,
        },
      })

      discoveryTl
        .from('.discovery__title--first', {
          x: '-100%',
          opacity: 0,
        })
        .from('.discovery__title-word', {
          x: '-100%',
          opacity: 0,
        })
        .from('.discovery__title-wrapper', {
          rotation: -10,
          y: '100%',
          opacity: 0,
        })
        .from('.discovery__text', {
          rotation: -10,
          y: '100%',
          opacity: 0,
        })
        .from(
          '.discovery__descr',
          {
            rotation: -10,
            y: '100%',
            opacity: 0,
          },
          '<'
        )
        .from('.discovery__year', {
          opacity: 0,
        })

      ScrollTrigger.create({
        animation: discoveryTl,
        trigger: '.discovery',
        start: 'top 10%',
        end: '+=3300',
        pin: true,
        scrub: 1.2,
      })
    }
  }

  // Applications
  const applicationsSlider = $('.applications__slider')

  applicationsSlider.slick({
    nextArrow: $('.applications__controls-button--next'),
    prevArrow: $('.applications__controls-button--prev'),
    infinite: false,
    adaptiveHeight: true,
    draggable: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1270,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
    ],
  })

  const applicationsSliderItemBodies = $('.applications__slider-item-body')
  const applicationsSliderItemInners = $('.applications__slider-item-inner')
  $('.applications__slider-item-more').each(function (index, item) {
    $(item).on('click', (event) => {
      event.preventDefault()
      let cardTl = gsap.timeline({ defaults: { duration: 0.3 } })
      cardTl
        .to(applicationsSliderItemBodies[index], {
          opacity: 0,
        })
        .to(
          applicationsSliderItemBodies[index],
          {
            display: 'none',
          },
          '>'
        )
        .to(
          $('.applications__slider-item')[index],
          {
            height: '100%',
            ease: 'power3.out',
          },
          '<'
        )
        .to(
          $('.applications__slider-item')[index],
          {
            minHeight: '100%',
            ease: 'power3.out',
          },
          '>'
        )
        .to(
          applicationsSliderItemInners[index],
          {
            display: 'flex',
          },
          '<'
        )
        .to(
          applicationsSliderItemInners[index],
          {
            opacity: 1,
          },
          '<'
        )
    })
  })
  $('.applications__slider-back').each(function (index, item) {
    $(item).on('click', (event) => {
      event.preventDefault()
      let cardTl = gsap.timeline({ defaults: { duration: 0.3 } })
      cardTl
        .to(applicationsSliderItemInners[index], {
          opacity: 0,
        })
        .to(
          applicationsSliderItemInners[index],
          {
            display: 'none',
          },
          '>'
        )
        .to(
          applicationsSliderItemBodies[index],
          {
            display: 'flex',
          },
          '>'
        )
        .to(
          applicationsSliderItemBodies[index],
          {
            opacity: 1,
          },
          '<'
        )
      setTimeout(() => {
        $('.applications__slider-item')[index].style.height = ''
        $('.applications__slider-item')[index].style.minHeight = ''
      }, 400)
    })
  })

  // Testimonials
  function initializeTestimonialsSlider() {
    const testimonialsSlider = $('.testimonials__slider')
    const testimonialsSlides = $('.testimonials__slider-item')

    if (testimonialsSlides.length < 3) {
      $('.testimonials').addClass('non-slick')
      return
    }

    testimonialsSlider.innerHTML += `123123123`

    testimonialsSlider.slick({
      nextArrow: $('.testimonials__controls--desktop .testimonials__controls-button--next'),
      prevArrow: false,
      infinite: true,
      speed: 1000,
      adaptiveHeight: true,
      variableWidth: true,
      draggable: false,
      centerMode: true,
      slidesToShow: testimonialsSlides.length - 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            nextArrow: $('.testimonials__controls--mobile .testimonials__controls-button--next'),
            prevArrow: $('.testimonials__controls--mobile .testimonials__controls-button--prev'),
            centerMode: false,
            infinite: false,
            slidesToShow: 1,
            swipe: true,
            swipeToSlide: true,
          },
        },
      ],
    })
  }

  $(window).on('load', () => {
    fixHeader()
    sloganAnimate()
    initCellAnimate()
    initAdvantagesAnimation()
    initDiscoveryAnimation()
    initializeTestimonialsSlider()
  })

  // responsive: [
  //   {
  //     breakpoint: 1270,
  //     settings: {
  //       slidesToShow: 3,
  //       slidesToScroll: 1,
  //     },
  //   },
  //   {
  //     breakpoint: 1024,
  //     settings: {
  //       slidesToShow: 3,
  //       slidesToScroll: 1,
  //     },
  //   },
  //   {
  //     breakpoint: 960,
  //     settings: {
  //       slidesToShow: 2,
  //       slidesToScroll: 1,
  //       variableWidth: true,
  //     },
  //   },
  //   {
  //     breakpoint: 650,
  //     settings: {
  //       slidesToShow: 1,
  //       slidesToScroll: 1,
  //       variableWidth: true,
  //     },
  //   },
  // ],

  $(document).on('scroll', () => {
    fixHeader()
  })
  // $(window).on('resize', destroyAndinitializeAdvantagesSlider)
})
