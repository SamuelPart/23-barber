import React, {useEffect, useRef} from 'react';
import {ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Plus} from 'lucide-react';

const looks = [
 {name:'Mid Fade', sub:'PRECISIÓN EN CADA DETALLE', img:'/modelo-fade-transparente.png', service:0},
 {name:'Clásico moderno', sub:'UN ESTILO QUE TRASCIENDE', img:'/modelo-clasico-transparente.png', service:1},
 {name:'Crop texturizado', sub:'ACTITUD EN CADA ÁNGULO', img:'/modelo-crop-transparente.png', service:0},
 {name:'Fade texturizado', sub:'HECHO A TU MEDIDA', img:'/modelo-fade-transparente.png', service:0},
 {name:'Pompadour', sub:'VOLUMEN CON CARÁCTER', img:'/modelo-clasico-transparente.png', service:1},
 {name:'Crop Fade', sub:'DETALLES QUE DEFINEN', img:'/modelo-crop-transparente.png', service:0},
];
const KX=[1.2,.744,.496,.346,.235,.15,.085], KF=[1.14,.89,.777,.704,.651,.616,.59], KH=[1.18,.832,.574,.436,.334,.258,.19], KB=[0,0,1.5,4,8,12,17], KO=[1,1,1,1,.86,.5,0];
const wrap=(x,n)=>((x%n)+n)%n, clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export default function Runway({services, add}){
 const stage=useRef(null), rail=useRef(null), models=useRef([]), cards=useRef([]), roll=useRef(null), pos=useRef({p:0,target:0}), drag=useRef(null), timer=useRef(null);
 useEffect(()=>{
  let raf, last=0, dead=false; const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function paint(){
   const el=stage.current, track=rail.current;if(!el||!track)return;
   const w=el.clientWidth,h=el.clientHeight, base=h*1.2,p=pos.current.p, mobile=window.innerWidth<=820;
   models.current.forEach((model,i)=>{if(!model)return;let d=wrap(i-p,6);if(d>5)d-=6;let k=clamp(d+1,0,6),a=Math.floor(k),b=Math.min(6,a+1),t=k-a,mix=arr=>arr[a]+(arr[b]-arr[a])*t;const height=mix(KH)*h,scale=height/base,width=height*(2/3),x=mix(KX)*w-width/2,y=mix(KF)*h-height; model.style.width=`${base*2/3}px`;model.style.height=`${base}px`;model.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`;model.style.filter=`blur(${mix(KB)/scale}px)`;model.style.opacity=mix(KO);model.style.zIndex=100-Math.round(d*10)});
   const cardSize=mobile?180:track.clientHeight/3, all=cardSize*looks.length;
   cards.current.forEach((card,i)=>{if(!card)return;let y=wrap(i*cardSize-p*cardSize,all);if(y>all-cardSize)y-=all;card.style.transform=mobile?`translate3d(${y}px,0,0)`:`translate3d(0,${y}px,0)`;card.style.height=mobile?'100%':`${cardSize}px`});
   if(roll.current)roll.current.style.transform=`translate3d(0,${-wrap(p,6)*100/7}%,0)`;
  }
  function animate(now){if(dead)return;const dt=Math.min(50,now-last)||16;last=now;let {p,target}=pos.current;p=reduced.matches?target:p+(target-p)*(1-Math.exp(-dt*.0072));if(Math.abs(target-p)<.0004)p=target;pos.current.p=p;paint();raf=requestAnimationFrame(animate)}
  raf=requestAnimationFrame(animate);return()=>{dead=true;cancelAnimationFrame(raf);clearTimeout(timer.current)};
 },[]);
 const change=delta=>{pos.current.target=Math.round(pos.current.target)+delta};
 const pointerDown=e=>{if(e.target.closest('a,button'))return;drag.current={x:e.clientX,start:pos.current.target,moved:0};e.currentTarget.setPointerCapture(e.pointerId)};
 const pointerMove=e=>{if(!drag.current)return;const dx=e.clientX-drag.current.x;drag.current.moved=Math.max(drag.current.moved,Math.abs(dx));pos.current.target=drag.current.start+dx/Math.max(150,stage.current.clientWidth*.2)};
 const pointerUp=e=>{if(!drag.current)return;const d=drag.current;if(d.moved<6){const hit=document.elementsFromPoint(e.clientX,e.clientY).find(x=>x.dataset?.look);if(hit){const index=Number(hit.dataset.look)-1;let diff=Math.round(wrap(index-pos.current.target,6));if(diff>0&&diff<6)pos.current.target=Math.round(pos.current.target)+diff}}else pos.current.target=Math.round(pos.current.target);drag.current=null};
 const wheel=e=>{e.preventDefault();pos.current.target+=clamp(e.deltaY+e.deltaX,-120,120)/420;clearTimeout(timer.current);timer.current=setTimeout(()=>pos.current.target=Math.round(pos.current.target),150)};
 useEffect(()=>{const el=stage.current;el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel)},[]);
 return <section className="runway" aria-label="Galería interactiva de cortes"><div className="runway-stage" ref={stage} tabIndex="0" aria-label="Galería de estilos. Arrastra, desplaza o usa las flechas para cambiar de corte." onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onKeyDown={e=>{if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();change(1)}else if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();change(-1)}}}>
 <div className="runway-intro"><div className="eyebrow"><span className="gold-line"/> 23 BARBERÍA / TRUJILLO</div><h1>Tu estilo.<br/><em>Tu esencia.</em></h1><p>La precisión de un buen corte. La actitud de ser tú. Descubre el look que habla por ti.</p></div>
 <div className="runway-models" aria-hidden="true">{looks.map((look,i)=><div className="runway-model" data-look={i+1} ref={el=>models.current[i]=el} key={i}><img src={look.img} alt="" draggable="false"/></div>)}</div>
 <div className="runway-bottom"><div className="runway-label">EL LOOK <span className="number-window"><span className="number-roll" ref={roll}>{[1,2,3,4,5,6,1].map((n,i)=><b key={i}>{String(n).padStart(2,'0')}</b>)}</span></span></div><a href="#carta">DESCUBRE TU CORTE <ArrowUpRight size={13}/></a></div>
 <div className="runway-controls"><button onClick={()=>change(-1)} aria-label="Estilo anterior"><ArrowLeft size={18}/></button><button onClick={()=>change(1)} aria-label="Estilo siguiente"><ArrowRight size={18}/></button><span>ARRASTRA PARA EXPLORAR</span></div><a className="runway-scroll" href="#carta">BAJA PARA EXPLORAR <ArrowDown size={15}/></a></div>
 <aside className="runway-rail" ref={rail} aria-label="Cortes destacados">{looks.map((look,i)=><article className="runway-card" ref={el=>cards.current[i]=el} key={i}><div className="runway-card-img"><img src={look.img} alt=""/></div><div className="runway-card-info"><span>{look.sub}</span><h3>{look.name}</h3><p>{services[look.service].name} · {services[look.service].time}</p><strong>S/ {services[look.service].price.toFixed(2)}</strong></div><button onClick={()=>add(services[look.service])} aria-label={`Agregar ${services[look.service].name} a tu selección`}><Plus size={19}/></button></article>)}</aside></section>
}
