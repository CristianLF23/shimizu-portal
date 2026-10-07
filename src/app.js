import {chapters,works,themes} from './content.js';
import {WindSystem,motionConfig} from './wind.js';

const $=s=>document.querySelector(s);
const wind=new WindSystem($('.scene'));
const sequence=$('.portal-sequence'),camera=$('.scene-camera'),scene=$('.scene'),paper=$('.passage-paper');
const homeCopy=$('.home-editorial'),homeBottom=$('.home-bottom');
const sections=[$('#inicio'),...chapters.map(c=>document.getElementById(c.id))];
let geometry=[],portalStart=0,portalTravel=1,pageTravel=1,queued=false,workIndex=0,menuOpen=false;
const clamp=v=>Math.max(0,Math.min(1,v));
const interval=(v,a,b)=>clamp((v-a)/(b-a));
const motionButton=$('#motion-toggle');
const menu=$('#chapter-index'),menuButton=$('.index-toggle');

function measure(){
 portalStart=sequence.offsetTop;portalTravel=Math.max(1,sequence.offsetHeight-innerHeight);
 geometry=sections.map(s=>s.offsetTop);
 pageTravel=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 requestPaint();
}
function paint(){
 queued=false;
 const y=window.scrollY,p=clamp((y-portalStart)/portalTravel);
 let active=0;for(let i=0;i<geometry.length;i++)if(y+innerHeight*.36>=geometry[i])active=i;
 wind.setRegion(active);wind.progress=p;
 document.body.dataset.chapter=sections[active].id;
 const reduced=wind.reduced.matches;
 document.documentElement.classList.toggle('reduced-motion',reduced);
 if(!reduced){
  camera.style.transform='translate3d('+(-p*8).toFixed(2)+'%,'+(-p*3).toFixed(2)+'%,0) scale('+(1+p*motionConfig.portalZoom).toFixed(3)+')';
  scene.style.opacity=(1-interval(p,motionConfig.portalFadeStart,motionConfig.portalFadeEnd)).toFixed(3);
  homeCopy.style.opacity=(1-interval(p,.03,.28)).toFixed(3);
  homeBottom.style.opacity=homeCopy.style.opacity;
  const phase=interval(p,motionConfig.paperStart,motionConfig.paperEnd);
  const envelope=Math.sin(phase*Math.PI);
  paper.style.opacity=String(clamp(envelope*4));
  paper.style.transform='translateX('+(-190+phase*430).toFixed(2)+'%) rotate('+(17-phase*30).toFixed(2)+'deg) scale('+(1+envelope*2.4).toFixed(3)+')';
 }else{camera.style.transform='';scene.style.opacity='';homeCopy.style.opacity='';homeBottom.style.opacity='';paper.style.opacity='0';}
 sequence.dataset.progress=p.toFixed(3);
 $('#current-section').textContent=String(active+1).padStart(2,'0');
 $('.page-progress i').style.transform='scaleY('+clamp(y/pageTravel).toFixed(4)+')';
 document.querySelectorAll('.desktop-nav a').forEach(a=>{if(a.hash==='#'+sections[active].id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
}
function requestPaint(){if(!queued){queued=true;requestAnimationFrame(paint);}}
addEventListener('scroll',requestPaint,{passive:true});
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(innerWidth>600&&menuOpen)closeMenu(false);measure();},100);},{passive:true});
new ResizeObserver(measure).observe(sequence);
document.fonts.ready.then(measure);
addEventListener('load',measure,{once:true});

function closeMenu(restore=true){menuOpen=false;menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');document.body.classList.remove('menu-open');$('#experience').inert=false;$('.site-footer').inert=false;if(restore)menuButton.focus({preventScroll:true});}
menuButton.addEventListener('click',()=>{if(menuOpen){closeMenu();return;}menuOpen=true;menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Fechar menu');document.body.classList.add('menu-open');$('#experience').inert=true;$('.site-footer').inert=true;menu.querySelector('a').focus();});
menu.addEventListener('click',e=>{const link=e.target.closest('a');if(!link)return;closeMenu(false);const section=document.querySelector(link.hash);if(section){section.setAttribute('tabindex','-1');section.focus({preventScroll:true});}});
document.addEventListener('keydown',e=>{
 if(menuOpen&&e.key==='Escape'){e.preventDefault();closeMenu();}
 if(menuOpen&&e.key==='Tab'){const focusables=[menuButton,...menu.querySelectorAll('a')],i=focusables.indexOf(document.activeElement);if((e.shiftKey&&i<=0)||(!e.shiftKey&&i===focusables.length-1)){e.preventDefault();focusables[e.shiftKey?focusables.length-1:0].focus();}}
});
function updateMotion(){const off=wind.paused||wind.reduced.matches;motionButton.textContent=wind.reduced.matches?'MOVIMENTO REDUZIDO':off?'VENTO EM PAUSA':'VENTO ATIVO';motionButton.setAttribute('aria-pressed',String(off));motionButton.setAttribute('aria-label',wind.reduced.matches?'Movimento reduzido pelo dispositivo':off?'Ativar movimento':'Pausar movimento');document.documentElement.classList.toggle('reduced-motion',wind.reduced.matches);measure();}
motionButton.addEventListener('click',()=>{if(!wind.reduced.matches)wind.toggle();updateMotion();});wind.onChange=updateMotion;

function showWork(index){
 workIndex=(index+works.length)%works.length;const w=works[workIndex],img=$('#work-image');
 img.src='assets/art/'+w.image+'.webp';img.alt=w.alt;
 $('.work-count').textContent=String(workIndex+1).padStart(2,'0')+' / '+String(works.length).padStart(2,'0');
 $('.work-title').textContent=w.title;
 document.querySelectorAll('[data-work-select]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.workSelect)===workIndex)));
 if(!wind.reduced.matches)img.animate([{opacity:.5,transform:'translateX(7px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'});
 $('#page-status').textContent='Trabalho '+(workIndex+1)+' de '+works.length+': '+w.title;
}
document.querySelectorAll('[data-work]').forEach(b=>b.addEventListener('click',()=>showWork(workIndex+Number(b.dataset.work))));
document.querySelectorAll('[data-work-select]').forEach(b=>b.addEventListener('click',()=>showWork(Number(b.dataset.workSelect))));
$('#trabalhos').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showWork(workIndex+(e.key==='ArrowRight'?1:-1));}});
let touchX=0,touchY=0;
$('.work-hero').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY;},{passive:true});
$('.work-hero').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.6)showWork(workIndex+(dx<0?1:-1));},{passive:true});
document.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.theme),t=themes[i];$('.oriental-art img').src='assets/art/'+t.image+'.webp';$('.theme-description').textContent=t.text;document.querySelectorAll('[data-theme]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));$('#page-status').textContent=t.name;}));
updateMotion();measure();

