import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

// The site's fade-in curve from globals.css: cubic-bezier(0.22, 1, 0.36, 1)
export const siteEase = CustomEase.create('siteBezier', '0.22, 1, 0.36, 1');
