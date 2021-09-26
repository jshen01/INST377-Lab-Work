let slidePosotion = 0;
const slides = document.querySelectorAll('.carousel_item');
const totalSlides = slides.length;

document.querySelector('#carousel_button--next')
    .addEventListener('click', function () {
        showNextSlide();
    })

document.querySelector('#carousel_button--prev')
    .addEventListener('click', function () {
        showPreviousSlide();
    })

function showNextSlide() {
    if (slidePosotion === totalSlides - 1) {
        slidePosotion = 0;
    } else {
        slidePosotion++;
    }

    updateSlidePosition();
}

function showPreviousSlide() {
    if (slidePosotion === 0) {
        slidePosotion = totalSlides - 1;
    } else {
        slidePosotion--;
    }

    updateSlidePosition();
}

function updateSlidePosition() {
    for (let slide of slides) {
        slide.classList.remove('carousel_item--visible');
        slide.classList.add('carousel_item-hidden');
    }

    slides[slidePosotion].classList.add('carousel_item--visible');
}