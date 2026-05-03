// grab the button and nav -- gonna toggle a class on click
var hamburger = document.getElementById('hamburger-btn');
var nav = document.querySelector('.main-nav');

hamburger.addEventListener('click', function () {
  // toggle nav-open -- css does the actual showing/hiding
  nav.classList.toggle('nav-open');
  // tell screen readers if the nav is open or not
  hamburger.setAttribute('aria-expanded', nav.classList.contains('nav-open'));
});
