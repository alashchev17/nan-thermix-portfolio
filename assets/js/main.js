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
  let cellTl = gsap.timeline({ defaults: { duration: 1 } })

  function showNextSlide() {
    const currentCellSlide = document.querySelector('.cell__slides-item.active')
    const currentCellBullet = document.querySelector(
      '.cell__bullets-item.active'
    )

    let nextCellSlide
    let nextCellBullet

    nextCellSlide = currentCellSlide.nextElementSibling
    nextCellBullet = currentCellBullet.nextElementSibling

    if (nextCellSlide && nextCellBullet) {
      cellSlideCounter++
      // Slides
      setTimeout(() => {
        cellTl
          .fromTo(
            currentCellSlide,
            {
              opacity: 1,
            },
            {
              opacity: 0,
              ease: 'power3.out',
            }
          )
          .fromTo(
            nextCellSlide,
            {
              y: '100%',
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              ease: 'back.out(1.2)',
              delay: 1,
              onComplete: () => showNextSlide(),
            },
            '<'
          )
        currentCellSlide.classList.remove('active')
        nextCellSlide.classList.add('active')

        // Bullets
        currentCellBullet.classList.remove('active')
        nextCellBullet.classList.add('active')
      }, 1500)
    } else {
      cellTl.to(
        '.cell__button',
        {
          opacity: 1,
          ease: 'power3.out',
        },
        '>50%'
      )
    }
  }

  if (window.innerWidth >= 768) {
    ScrollTrigger.create({
      animation: cellTl,
      trigger: '.cell',
      onEnter: () => {
        if (cellSlideCounter !== 1) {
          return
        }
        showNextSlide()
      },
    })
  } else {
    cellBullets.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (item.classList.contains('active')) {
          return
        }
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
          gsap.to('.cell__button', {
            opacity: 1,
            y: 0,
            delay: 1,
            ease: 'power3.out',
          })
        }
      })
    })
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
