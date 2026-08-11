const products = [...document.querySelectorAll('.product')];
const dots = [...document.querySelectorAll('.dot')];
let current = 0;
let timer;

function showSlide(index) {
  current = index;
  products.forEach((p,i) => p.classList.toggle('active', i === index));
  dots.forEach((d,i) => d.classList.toggle('active', i === index));
}

function restart() {
  clearInterval(timer);
  timer = setInterval(() => showSlide((current + 1) % products.length), 6200);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showSlide(i);
    restart();
  });
});

showSlide(0);
restart();
