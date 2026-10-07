import {ClothFlag} from './cloth.js?v=3.4';
export const motionConfig={intensity:.8,gustStrength:1.8,portalZoom:.02,particlesDesktop:60,particlesMobile:36,petalFallRate:1.5};
export class WindSystem {
 constructor(scene){
  this.scene=scene;this.environment=scene.querySelector('.environment');this.backdrop=this.environment.querySelector('img');
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.mobile=matchMedia('(max-width:600px)');
  this.objects=[...scene.querySelectorAll('.hanging-art')].map((el,i)=>new ClothFlag(el,i));
  this.petals=[];this.frame=0;this.last=0;this.time=0;this.impulse=0;this.pointerX=0;this.paused=false;this.region=0;this.progress=0;this.accumulator=0;
  const holder=scene.querySelector('.petals');
  for(let i=0;i<motionConfig.particlesDesktop;i++){
   const el=document.createElement('i');el.className='petal';el.style.setProperty('--petal-size',`${6+(i%5)*2}px`);el.style.setProperty('--petal-opacity',`${.45+(i%4)*.12}`);holder.append(el);
   this.petals.push({el,x:(i*.173)%1,y:(i*.293)%1,speed:.025+(i%7)*.008,phase:i*2.23,depth:.6+(i%4)*.25});
  }
  scene.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'&&!this.reduced.matches)this.pointerX=e.clientX/innerWidth-.5;},{passive:true});
  scene.addEventListener('pointerleave',()=>{this.pointerX=0;});scene.addEventListener('pointerdown',()=>this.gust(),{passive:true});
  document.addEventListener('visibilitychange',()=>this.sync());this.reduced.addEventListener('change',()=>{this.sync();this.onChange?.();});
  this.backdrop.addEventListener('load',()=>this.mount());this.backdrop.decode().then(()=>this.mount()).catch(()=>{});
  this.tick=this.tick.bind(this);this.sync();
 }
 mount(){
  if(!this.backdrop.naturalWidth)return;
  const camera=this.scene.querySelector('.scene-camera'),cr=camera.getBoundingClientRect(),r=this.backdrop.getBoundingClientRect();
  const zoom=cr.width/camera.clientWidth||1,w=r.width/zoom,h=r.height/zoom,scale=Math.max(w/this.backdrop.naturalWidth,h/this.backdrop.naturalHeight);
  const position=getComputedStyle(this.backdrop).objectPosition.split(' ').map(parseFloat);
  const x=(r.left-cr.left)/zoom+(w-this.backdrop.naturalWidth*scale)*(position[0]/100),y=(r.top-cr.top)/zoom+(h-this.backdrop.naturalHeight*scale)*(position[1]/100);
  const portrait=this.backdrop.currentSrc.includes('mobile'),start=portrait?.31:.35,end=portrait?.69:.63,beamY=portrait?.229:.173,beamSlope=portrait?0:.034;
  const span=(end-start)*this.backdrop.naturalWidth*scale,width=Math.min(125,span*.24),height=Math.min(this.scene.clientHeight*.28,width*3.1);
  for(let i=0;i<this.objects.length;i++){
   const flag=this.objects[i],u=start+(end-start)*i/3,rope=width*(.35+(i%2)*.12);
   flag.el.style.left=`${x+u*this.backdrop.naturalWidth*scale-width/2}px`;flag.el.style.top=`${y+(beamY+beamSlope*i/3)*this.backdrop.naturalHeight*scale}px`;
   flag.el.style.width=`${width}px`;flag.el.style.height=`${height+rope}px`;flag.el.style.setProperty('--cord-length',`${rope}px`);flag.resize();
  }
 }
 gust(){if(!this.reduced.matches&&!this.paused)this.impulse=motionConfig.gustStrength;}
 setRegion(value){if(this.region!==value){this.region=value;this.sync();}}
 toggle(){this.paused=!this.paused;this.sync();}
 sync(){
  cancelAnimationFrame(this.frame);this.frame=0;this.last=0;this.accumulator=0;
  const stopped=this.paused||this.reduced.matches;this.scene.classList.toggle('motion-paused',stopped);this.environment.style.transform='';
  if(stopped)for(const flag of this.objects)flag.reset();
  if(!stopped&&!document.hidden&&this.region===0)this.frame=requestAnimationFrame(this.tick);
 }
 tick(now){
  const dt=this.last?Math.min((now-this.last)/1000,.05):1/60;this.last=now;this.time+=dt;this.accumulator+=dt;this.impulse*=Math.exp(-dt*1.3);
  const t=this.time,breeze=(Math.sin(t*.63)+Math.sin(t*1.13+1.6)*.45)*motionConfig.intensity+this.impulse+this.pointerX*.9;
  while(this.accumulator>=1/60){for(const flag of this.objects)flag.step(1/60,t,breeze);this.accumulator-=1/60;}
  if(!this.mobile.matches||!this.lastDraw||now-this.lastDraw>=30){for(const flag of this.objects)flag.draw();this.lastDraw=now;}
  const count=this.mobile.matches?motionConfig.particlesMobile:motionConfig.particlesDesktop;
  for(let i=0;i<this.petals.length;i++){
   const p=this.petals[i];p.el.hidden=i>=count;if(i>=count)continue;p.x+=dt*(.018+breeze*.018)*p.depth;p.y+=dt*p.speed*p.depth*motionConfig.petalFallRate;
   if(p.y>1.06){p.y=-.06;p.x=(i*.193+t*.087)%1;}if(p.x>1.1)p.x=-.1;if(p.x<-.1)p.x=1.1;
   const flutter=Math.sin(t*1.6+p.phase),x=p.x*this.scene.clientWidth+Math.sin(t*.8+p.phase)*28;
   p.el.style.transform=`translate3d(${x.toFixed(1)}px,${(p.y*this.scene.clientHeight+flutter*13).toFixed(1)}px,0) rotate(${(t*35+p.phase*80).toFixed(1)}deg) rotateY(${(flutter*70).toFixed(1)}deg) scale(${p.depth})`;
  }
  this.frame=requestAnimationFrame(this.tick);
 }
}
