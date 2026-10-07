export const motionConfig = {
  intensity: .3, direction: 1, spring: 10, damping: 3.7,
  gustStrength: 2, turbulence: .2, parallax: 2,
  portalZoom: .035,
  paperStart: .25, paperEnd: .94,
  particlesDesktop: 8, particlesMobile: 4
};

export class WindSystem {
  constructor(scene) {
    this.scene=scene; this.environment=scene.querySelector('.environment');
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.mobile=matchMedia('(max-width:600px)');
    this.objects=[...scene.querySelectorAll('.hanging-art')].map((el,i)=>({el,angle:0,velocity:0,mass:.9+i*.17,phase:i*1.93}));
    this.petals=[]; this.frame=0; this.last=0; this.time=0; this.impulse=0; this.pointerX=0; this.pointerY=0;this.paused=false;this.region=0;this.progress=0;
    this.processPaper=document.querySelector('.process-detail');
    const holder=scene.querySelector('.petals');
    for(let i=0;i<motionConfig.particlesDesktop;i++){const el=document.createElement('i');el.className='petal';holder.append(el);this.petals.push({el,x:(i*.137)%1,y:(i*.237)%1,speed:.018+i*.0017,phase:i*2.23});}
    scene.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||this.reduced.matches)return;this.pointerX=e.clientX/innerWidth-.5;this.pointerY=e.clientY/innerHeight-.5;},{passive:true});
    scene.addEventListener('pointerleave',()=>{this.pointerX=0;this.pointerY=0;});
    document.addEventListener('visibilitychange',()=>this.sync());
    this.reduced.addEventListener('change',()=>{this.sync();this.onChange?.()});
    this.tick=this.tick.bind(this);this.sync();
  }
  gust(){if(!this.reduced.matches&&!this.paused)this.impulse=motionConfig.gustStrength;}
  setRegion(value){if(this.region!==value){this.region=value;this.sync();}}
  toggle(){this.paused=!this.paused;this.sync();}
  sync(){cancelAnimationFrame(this.frame);this.last=0;
    const stop=this.paused||this.reduced.matches||document.hidden||this.region===1||this.region===2||this.region>=4;
    this.scene.classList.toggle('motion-paused',this.paused||this.reduced.matches);
    if(this.reduced.matches||this.paused){this.environment.style.transform='';for(const o of this.objects){o.el.style.transform='';o.angle=0;o.velocity=0;}this.processPaper?.style.removeProperty('--sway');}
    if(!stop)this.frame=requestAnimationFrame(this.tick);
  }
  tick(now){const dt=this.last?Math.min((now-this.last)/1000,.032):.016;this.last=now;this.time+=dt;
    const t=this.time,c=motionConfig;
    this.impulse*=Math.exp(-dt*2.5);
    const field=(Math.sin(t*.43)+Math.sin(t*.79+1.6)*.42+Math.sin(t*1.17)*.19)*c.intensity;
    for(let i=0;i<this.objects.length&&this.region===0;i++){const o=this.objects[i];const flutter=Math.sin(t*1.37+o.phase)*c.turbulence;
      const target=(field+flutter+this.impulse/(1+i*.22)+this.pointerX*.5)*(1+this.progress*2.3)*(this.mobile.matches?.55:1);
      o.velocity+=((target-o.angle)*c.spring/o.mass-o.velocity*c.damping)*dt;o.angle+=o.velocity*dt;
      o.el.style.transform=`rotate(calc(var(--lean) + ${o.angle.toFixed(3)}deg)) rotateY(${(o.angle*.9).toFixed(2)}deg)`;
    }
    if(!this.mobile.matches&&this.region===0)this.environment.style.transform=`translate3d(${(-this.pointerX*c.parallax).toFixed(2)}px,${(-this.pointerY*c.parallax).toFixed(2)}px,0)`;
    if(this.region===3)this.processPaper?.style.setProperty('--sway',`${(field*.22).toFixed(3)}deg`);
    const count=this.region===0?(this.mobile.matches?c.particlesMobile:c.particlesDesktop):0;
    for(let i=0;i<count;i++){const p=this.petals[i];p.x+=dt*(p.speed+this.impulse*.008);p.y+=dt*p.speed*.55;if(p.x>1.1){p.x=-.1;p.y=(i*.193+t*.027)%1;}if(p.y>1.1)p.y=-.1;
      p.el.style.transform=`translate3d(${(p.x*innerWidth).toFixed(1)}px,${(p.y*innerHeight+Math.sin(t+p.phase)*15).toFixed(1)}px,0) rotate(${(t*21+p.phase*80).toFixed(1)}deg)`;
    }
    this.frame=requestAnimationFrame(this.tick);
  }
}
