import $ from 'jquery';
import MobileMenu from './modules/MobileMenu';
import Particles from './modules/Particles';
import RevealOnScroll from './modules/RevealOnScroll';
import Glider from './modules/Glider';

var glider = new Glider();
var mobileMenu = new MobileMenu();
var particles = new Particles();
new RevealOnScroll($(".feature-item"), "85%");
new RevealOnScroll($(".testimonial"), "60%"); 
