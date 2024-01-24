gsap.registerPlugin(ScrollTrigger)

// Header Variables
const siteContainer = document.querySelector('.site-container')
const header = document.querySelector('.header')
const menu = document.querySelector('.menu')
const burgerButton = document.querySelector('.header__burger')
const closeBurgerButton = document.querySelector('.menu__close')
// Cell section Variables
const cellBullets = document.querySelectorAll('.cell__bullets-item')
const cellSlides = document.querySelectorAll('.cell__slides-item')
const cellSlidesCount = 5
let cellSlideCounter = 1

function initCellAnimate() {
  if (window.innerWidth >= 768) {
    let cellTl = gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: '.cell',
        start: 'top 15%',
        end: '+=7000',
        markers: true,
        scrub: true,
        pin: true,
        onUpdate: ({ progress }) => {
          console.log(Math.ceil((progress * 100) / 20 - 1))
          cellBullets.forEach((item) => {
            item.classList.remove('active')
          })
          cellBullets[Math.ceil((progress * 100) / 20 - 1)].classList.add(
            'active'
          )
        },
      },
    })

    cellSlides.forEach((item, index) => {
      document.querySelector(
        '.cell__slides'
      ).style = `height: ${item.offsetHeight}px`
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
    cellBullets[0].classList.add('active')
    gsap.set(cellSlides[0], {
      opacity: 1,
      ease: 'power3.out',
    })
    document.querySelector(
      '.cell__slides'
    ).style = `height: ${cellSlides[0].offsetHeight}px`
    // Handle click on bullets
    cellBullets.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (item.classList.contains('active')) {
          return
        }
        document.querySelector('.cell__slides').style = `height: ${
          cellSlides[index].offsetHeight + 1
        }px`
        cellBullets.forEach((item) => item.classList.remove('active'))
        cellSlides.forEach((item) => {
          gsap.to(item, {
            opacity: 0,
            duration: 0.3,
            ease: 'power3.out',
          })
          item.classList.remove('active')
        })
        item.classList.add('active')
        cellSlides[index].classList.add('active')
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
    // document.querySelector('.cell__slides').addEventListener('swipe-right')
    document
      .querySelector('.cell__slides')
      .addEventListener('touchstart', handleTouchStart, false)
    document
      .querySelector('.cell__slides')
      .addEventListener('touchmove', handleTouchMove, false)

    var xDown = null
    var yDown = null

    function swipeSlide(direction) {
      const currentSlide = document.querySelector('.cell__slides-item.active')
      const currentBullet = document.querySelector('.cell__bullets-item.active')
      let nextSlide
      let nextBullet
      if (direction === 'right') {
        // debugger
        nextSlide = currentSlide.nextElementSibling ?? null
        nextBullet = currentBullet.nextElementSibling ?? null
      } else {
        nextSlide = currentSlide.previousElementSibling ?? null
        nextBullet = currentBullet.previousElementSibling ?? null
      }

      if (nextSlide && nextBullet) {
        document.querySelector('.cell__slides').style = `height: ${
          nextSlide.offsetHeight + 1
        }px`

        currentSlide.classList.remove('active')
        gsap.to(currentSlide, {
          opacity: 0,
          ease: 'power3.out',
        })
        currentBullet.classList.remove('active')
        setTimeout(() => {
          nextSlide.classList.add('active')
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
            }
          )
          if (nextBullet.dataset.number === '4') {
            gsap.fromTo(
              '.cell__button',
              {
                opacity: 0,
              },
              {
                opacity: 1,
                ease: 'power3.out',
                delay: 1,
              }
            )
          }
          nextBullet.classList.add('active')
        }, 300)
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

      var xUp = evt.touches[0].clientX
      var yUp = evt.touches[0].clientY

      var xDiff = xDown - xUp
      var yDiff = yDown - yUp

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          /* right swipe */
          console.log('swipe right')
          swipeSlide('right')
        } else {
          /* left swipe */
          console.log('swipe left')
          swipeSlide('left')
        }
      } else {
        if (yDiff > 0) {
          /* down swipe */
        } else {
          /* up swipe */
        }
      }
      /* reset values */
      xDown = null
      yDown = null
    }
  }
}

// Header

burgerButton.addEventListener('click', (event) => {
  event.preventDefault()
  menu.classList.add('active')
  siteContainer.classList.add('overflow')
})
closeBurgerButton.addEventListener('click', (event) => {
  event.preventDefault()
  menu.classList.remove('active')
  siteContainer.classList.remove('overflow')
})

siteContainer.addEventListener('click', (event) => {
  if (event.target === siteContainer) {
    menu.classList.remove('active')
    siteContainer.classList.remove('overflow')
  }
})

function fixHeader() {
  if (!document.documentElement.scrollTop > 0) {
    header.classList.remove('fixed')
    return
  }
  header.classList.add('fixed')
}
function sloganAnimate() {
  let sloganTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.slogan',
      start: 'bottom bottom',
      end: 'bottom 30%',
      scrub: true,
    },
  })
  sloganTl.to('.slogan__title', {
    x: () =>
      document.documentElement.offsetWidth -
      document.querySelector('.slogan__title').scrollWidth,
  })
}
window.addEventListener('load', () => {
  fixHeader()
  sloganAnimate()
  initCellAnimate()
})
document.addEventListener('scroll', () => {
  fixHeader()
})
