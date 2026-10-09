/* A short ritual on each document load. Navigation and bfcache never replay it. */
export function initEntrance({wind,atelier}){
 const root=document.documentElement,screen=document.querySelector('.entrance-screen');
 let timeline,finished=false,revealed=false,watchdog;
 const locked=new Map();
 const reveal=()=>{
  if(revealed)return;revealed=true;
  root.classList.add('entrance-revealing');root.dataset.entrance='revealing';
  document.dispatchEvent(new Event('shimizu:entrance-reveal'));
  if((!location.hash||location.hash==='#inicio')&&!wind.reduced.matches&&!wind.paused){
   wind.impulse=3.2;
   const scene=document.querySelector('.scene');
   atelier.atmosphere.burst(scene.clientWidth*.67,scene.clientHeight*.84);
  }
 };
 function finish(){
  if(finished)return;finished=true;
  clearTimeout(watchdog);timeline?.kill();
  reveal();
  root.classList.remove('entrance-pending','entrance-revealing');root.dataset.entrance='complete';
  screen.hidden=true;
  for(const [element,previous] of locked)element.inert=previous;
  window.removeEventListener('keydown',onKey,true);
  window.removeEventListener('wheel',blockScroll,true);
  window.removeEventListener('touchmove',blockScroll,true);
  document.removeEventListener('visibilitychange',onHidden);
  document.removeEventListener('shimizu:entrance-expired',finish);
  wind.reduced.removeEventListener('change',finish);
  screen.removeEventListener('pointerdown',finish);
 }
 function onKey(event){
  if(event.key==='Tab'){finish();return;}
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish();return;}
  if(['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(event.key)){
   event.preventDefault();event.stopImmediatePropagation();
  }
 }
 function blockScroll(event){event.preventDefault();}
 function onHidden(){if(document.hidden)finish();}
 window.addEventListener('pageshow',event=>{if(event.persisted)finish();});
 if(!root.classList.contains('entrance-pending')||document.hidden){finish();return{finish};}
 document.addEventListener('shimizu:entrance-expired',finish);
 document.addEventListener('visibilitychange',onHidden);
 wind.reduced.addEventListener('change',finish);
 screen.addEventListener('pointerdown',finish);
 window.addEventListener('keydown',onKey,true);
 window.addEventListener('wheel',blockScroll,{capture:true,passive:false});
 window.addEventListener('touchmove',blockScroll,{capture:true,passive:false});
 for(const element of document.querySelectorAll('.masthead,#experience,.chapter-rail,#whatsapp-floating,.skip-link')){
  locked.set(element,element.inert);element.inert=true;
 }
 // Independent of GSAP callbacks, so a stalled animation cannot lock the site.
 watchdog=setTimeout(finish,2200);
 const gsap=window.gsap;
 if(!gsap){finish();return{finish};}
 try{
  if(wind.reduced.matches||wind.paused){
   timeline=gsap.timeline({paused:true,onComplete:finish}).to(screen,{opacity:0,duration:.16});
  }else{
   const mark=screen.querySelector('.entrance-mark'),seal=screen.querySelector('.entrance-seal');
   const name=screen.querySelector('.entrance-name'),stroke=screen.querySelector('.entrance-stroke path');
   const length=stroke.getTotalLength();
   gsap.set(stroke,{strokeDasharray:length,strokeDashoffset:length});
   timeline=gsap.timeline({paused:true,defaults:{ease:'power3.out'},onComplete:finish});
   timeline.addLabel('stamp',.04)
    .fromTo(seal,{opacity:0,scale:1.45,rotate:-13},{opacity:1,scale:1,rotate:-4,duration:.3,ease:'back.out(1.4)'},'stamp')
    .fromTo('.entrance-ink i',{opacity:0,scale:.15},{opacity:.55,scale:1,duration:.26,stagger:.012},'stamp+=.08')
    .addLabel('brush',.27)
    .fromTo(name,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.57,ease:'power2.inOut'},'brush')
    .to(stroke,{strokeDashoffset:0,duration:.48,ease:'power2.inOut'},'brush+=.1')
    .fromTo('.entrance-caption',{opacity:0,y:5},{opacity:1,y:0,duration:.3},'brush+=.24')
    .addLabel('gust',.96)
    .call(reveal,[],'gust')
    .to(mark,{x:28,opacity:0,duration:.32,ease:'power2.in'},'gust')
    .to('.entrance-curtain',{clipPath:'polygon(106% 0,100% 0,100% 100%,108% 100%,105% 85%,110% 72%,104% 57%,109% 43%,105% 28%,108% 14%)',duration:.84,ease:'power2.inOut'},'gust')
    .fromTo('.entrance-petals i',{x:-100,y:40,opacity:0,rotate:-30},{x:()=>innerWidth*.7,y:-160,opacity:.8,rotate:180,duration:.59,stagger:.024,ease:'power2.in'},'gust')
    .to('.entrance-petals',{opacity:0,duration:.18},1.62);
  }
  requestAnimationFrame(()=>{if(!finished){root.dataset.entrance='playing';timeline.play(0);}});
 }catch{finish();}
 return{finish};
}
