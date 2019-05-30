import $ from 'jquery';
import MobileMenu from './modules/MobileMenu';
import Particles from './modules/Particles';
import RevealOnScroll from './modules/RevealOnScroll';
import Glider from './modules/Glider';
import Modernizr from './modules/Modernizr';
import Main from './modules/Main';

var glider = new Glider();
var main = new Main();
var modernizr = new Modernizr();
var mobileMenu = new MobileMenu();
var particles = new Particles();
new RevealOnScroll($(".feature-item"), "85%");
new RevealOnScroll($(".testimonial"), "60%"); 
