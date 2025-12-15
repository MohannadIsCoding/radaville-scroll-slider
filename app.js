gsap.registerPlugin(SplitText);

const slideDataImages = [
  { title: "Aromir Arquitectes", image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/a79022238820311.691f560714a04.png" },
  { title: "Countryside Villa", image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/2b39de235784099.68de4be6bb892.jpg" },
  { title: "Tim van de Velde", image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9d884c186697551.6579e3ed13c8c.jpg" },
  { title: "KESELMAN ARCH STUDIO", image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/b9e390237470497.690137e94391a.jpg" },
  { title: "Peiffer architektur", image: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/d721a9239767629.693046ff9d922.jpg" },
]

const container = document.querySelector('.container')
const slider = document.querySelector('.slider')

let frontSlideIndex = 0
let isSliderAnimating = false

function initializingSlider() {
  slideDataImages.forEach((data, i) => {
    const slide = document.createElement('div')
    slide.className = 'slide'
    slide.innerHTML = `
            <img src="${data.image}" alt="${data.title}" class="slide-image" />
            <h1 class="slide-title">${data.title}</h1>
        `
    slider.appendChild(slide)
  })
  let slides = document.querySelectorAll('.slide')
  slides.forEach((slide) => {
    const title = slide.querySelector('.slide-title')
    new SplitText(title, {
      type: "words",
      mask: "words"
    })
  })
  slides.forEach((slide, i) => {
    gsap.set(slide, {
      y: `${(9 * i)}%`,
      z: 11 * i,
      opacity: i * (1 / (slideDataImages.length - 1))
    })
  })
}

document.addEventListener('DOMContentLoaded', () => initializingSlider())

let wheelAccumulator = 0
const wheelThreshold = 100
let isWheelActive = false
const timeout = 1200;
container.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    if (isSliderAnimating || isWheelActive) return;
    wheelAccumulator += Math.abs(e.deltaY)
    if (wheelAccumulator >= wheelThreshold) {
      isWheelActive = true
      wheelAccumulator = 0
      const direction = e.deltaY > 0 ? 'down' : 'up'
      changeSlideDirection(direction)
      setTimeout(() => {
        isWheelActive = false
      }, timeout);
    }
  },
  { passive: false }
)

let touchStartCords = { x: 0, y: 0 }
let isTouchActive = false;
const touchThreshold = 50;

container.addEventListener('touchstart', (e) => {
  if (isSliderAnimating || isTouchActive) return;
  touchStartCords.y = e.touchs[0].clientY;
  touchStartCords.x = e.touchs[0].clientX;
}, { passive: true })

container.addEventListener('touched', (e) => {
  if (isSliderAnimating || isTouchActive) return;
  const touchEndCords = { y: e.changedTouchs[0].clientY, x: e.changedTouchs[0].clientX }
  const deltaCords = { y: touchStartCords.y - touchEndCords.y, x: Math.abs(touchStartCords.x - touchEndCords.x) }
  if (Math.abs(deltaCords.y) > deltaCords.x && Math.abs(deltaCords.y) > touchThreshold) {
    isTouchActive = true;
    const direction = deltaCords.y > 0 ? 'down' : 'up'
    changeSlideDirection(direction)
    setTimeout(() => {
      isTouchActive = false
    }, timeout);
  }
}, { passive: false })

const changeSlideDirection = (direction = 'down') => {
  if (isSliderAnimating) return;
  isSliderAnimating = true

  if (direction == 'down')
    scrollDown()
  else
    scrollUp()
}

const scrollDown = () => {
  let slides = document.querySelectorAll('.slide')
  let firstSlide = slides[0]
  frontSlideIndex = (frontSlideIndex + 1) % slideDataImages.length
  let newBackIndex = (frontSlideIndex + (slideDataImages.length - 1)) % slideDataImages.length
  let nextSlideData = slideDataImages[newBackIndex]

  const nextSlide = document.createElement('div')
  nextSlide.className = 'slide'
  nextSlide.innerHTML = `
      <img src="${nextSlideData.image}" alt="${nextSlideData.title}" class="slide-image" />
      <h1 class="slide-title">${nextSlideData.title}</h1>
    `
  let nextTitle = nextSlide.querySelector('.slide-title')
  let split = new SplitText(nextTitle, {
    type: 'words',
    mask: 'words'
  })
  gsap.set(split.words, { yPercent: 100 })
  slider.appendChild(nextSlide)
  gsap.set(nextSlide, {
    y: `${(9 * slideDataImages.length)}%`,
    z: 11 * slideDataImages.length,
    opacity: 0
  })
  let updatedSlides = document.querySelectorAll('.slide')
  updatedSlides.forEach((slide, i) => {
    let targetPosition = i - 1;
    gsap.to(slide, {
      y: `${(9 * targetPosition)}%`,
      z: 11 * targetPosition,
      opacity: targetPosition < 0 ? 0 : 1,
      duration: 0.75,
      ease: 'power3.inOut',
      onComplete: () => {
        if (i == 0) {
          firstSlide.remove()
          isSliderAnimating = false
        }
      }
    })
  })
  gsap.to(split.words, {
    yPercent: 0,
    duration: 0.75,
    ease: 'power4.out',
    stagger: 0.15,
    delay: 0.5
  })
}

const scrollUp = () => {
  let slides = document.querySelectorAll('.slide')
  frontSlideIndex = (frontSlideIndex - 1 + slideDataImages.length) % slideDataImages.length
  let lastSlide = slides[slideDataImages.length - 1]
  let prevSlideData = slideDataImages[frontSlideIndex]

  const nextSlide = document.createElement('div')
  nextSlide.className = 'slide'
  nextSlide.innerHTML = `
      <img src="${prevSlideData.image}" alt="${prevSlideData.title}" class="slide-image" />
      <h1 class="slide-title">${prevSlideData.title}</h1>
    `
  let nextTitle = nextSlide.querySelector('.slide-title')
  let split = new SplitText(nextTitle, {
    type: 'words',
    mask: 'words'
  })
  gsap.set(split.words, { yPercent: 100 })

  slider.prepend(nextSlide)
  gsap.set(nextSlide, {
    y: `${(9 * -1)}%`,
    z: 11 * -1,
    opacity: 0
  })
  let slideQueue = Array.from(slider.querySelectorAll('.slide'))
  slideQueue.forEach((slide, i) => {
    let targetPosition = i;
    gsap.to(slide, {
      y: `${(9 * targetPosition)}%`,
      z: 11 * targetPosition,
      opacity: targetPosition > 4 ? 0 : 1,
      duration: 0.75,
      ease: 'power3.inOut',
      onComplete: () => {
        if (i == slideQueue.length - 1) {
          lastSlide.remove()
          isSliderAnimating = false
        }
      }
    })
  })
  gsap.to(split.words, {
    yPercent: 0,
    duration: 0.75,
    ease: 'power4.out',
    stagger: 0.15,
    delay: 0.5
  })
}