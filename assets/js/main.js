$(document).ready(function () {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)

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
        x: () =>
          document.documentElement.offsetWidth -
          document.querySelector('.slogan__title').scrollWidth,
        ease: 'power3.inOut',
      })
    }
  }

  // Cell section Variables
  const cellBullets = $('.cell__bullets-item')
  const cellSlides = $('.cell__slides-item')
  const cellSlidesCount = 5
  let cellSlideCounter = 1
  let isCellSlideAnimating = false // only for mobile

  function initCellAnimate() {
    if ($(window).width() > 768) {
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
          let currentProgress =
            Math.ceil((progress * 100) / 20 - 1) >= 0
              ? Math.ceil((progress * 100) / 20 - 1)
              : 0
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
          $('.cell__slides').css(
            'height',
            `${cellSlides[index].offsetHeight + 1}px`
          )
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
            $('.cell__slides').css(
              'height',
              `${nextSlide[0].offsetHeight + 1}px`
            )

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
    ScrollTrigger.create({
      animation: tlSystem,
      trigger: '.system',
      start: '+=3300',
      once: true,
      markers: true,
    })
  } else {
    // Mobile animation
  }

  // ScrollTrigger.create({})

  $(window).on('load', () => {
    fixHeader()
    sloganAnimate()
    initCellAnimate()
  })

  $(document).on('scroll', () => {
    fixHeader()
  })
})
