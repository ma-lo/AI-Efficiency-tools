/* AI 工具体系站 · 共享交互 V2 */
(function(){
  // 滚动进度
  var bar=document.getElementById('progress');
  if(bar){addEventListener('scroll',function(){
    var h=document.documentElement,p=scrollY/(h.scrollHeight-innerHeight);
    bar.style.width=(p*100)+'%';
  },{passive:true});}
  // reveal 入场
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);}})},{threshold:.08});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  // 数字滚动
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;var el=e.target,n=+el.dataset.n;
    if(!isFinite(n)){cio.unobserve(el);return;}
    var c=0,step=Math.max(1,Math.round(n/40));
    var t=setInterval(function(){c+=step;if(c>=n){c=n;clearInterval(t);}el.textContent=c;},30);
    cio.unobserve(el);
  })},{threshold:.4});
  document.querySelectorAll('.stat-card .num').forEach(function(el){cio.observe(el)});
  // 光标辉光
  var g=document.getElementById('cursorGlow');
  if(g){var gx=0,gy=0,tx=0,ty=0;
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;});
    (function loop(){gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;g.style.left=gx+'px';g.style.top=gy+'px';requestAnimationFrame(loop);})();}
  // 侧导航 scrollspy（页面内 TOC）
  var links=document.querySelectorAll('.sidenav a[href^="#"]');
  if(links.length){
    var secs=[].map.call(links,function(a){return document.querySelector(a.getAttribute('href'))});
    addEventListener('scroll',function(){
      var idx=0;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<170)idx=i;});
      links.forEach(function(a,i){a.classList.toggle('active',i===idx)});
    },{passive:true});
  }
  // 返回顶部
  var top=document.getElementById('topBtn');
  if(top){addEventListener('scroll',function(){top.classList.toggle('show',scrollY>600)},{passive:true});
    top.onclick=function(){scrollTo({top:0,behavior:'smooth'})};}
  // 移动端抽屉
  var nt=document.getElementById('navToggle'),sn=document.querySelector('.sidenav');
  if(nt&&sn){nt.onclick=function(){sn.classList.toggle('open')};
    sn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){sn.classList.remove('open')})});}
  // 锚点复制 + toast
  function toast(msg){var t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
    t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},1800);}
  document.querySelectorAll('.sec-title').forEach(function(h){
    var sec=h.closest('section');if(!sec||!sec.id)return;
    var b=document.createElement('span');b.className='anchor';b.textContent='🔗';b.title='复制本页锚点链接';
    b.onclick=function(){var url=location.href.split('#')[0]+'#'+sec.id;
      function ok(){toast('已复制锚点链接')}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(ok,function(){fallback()})}else fallback();
      function fallback(){var ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');ok()}catch(e){toast('复制失败')}ta.remove();}};
    h.appendChild(b);
  });
  // 卡片 tilt 微交互
  document.querySelectorAll('.stat-card').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      el.style.transform='translateY(-6px) scale(1.02) perspective(900px) rotateX('+(-y*3)+'deg) rotateY('+(x*3)+'deg)';
    });
    el.addEventListener('mouseleave',function(){el.style.transform='';});
  });
})();

/* V4：平滑滚动 + 已读标记 */
document.querySelectorAll('.sidenav a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var el=document.querySelector(a.getAttribute('href'));
    if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});
var _seen={};
window.addEventListener('scroll',function(){
  document.querySelectorAll('.sidenav a[href^="#"]').forEach(function(a){
    var el=document.querySelector(a.getAttribute('href'));
    if(el&&el.getBoundingClientRect().top<window.innerHeight*0.6){_seen[a.getAttribute('href')]=1;a.classList.add('done');}
  });
},{passive:true});

/* V6 · 卡片微倾斜扩展 */
document.querySelectorAll('.mech-card,.think-card,.pillar,.tcard').forEach(function(el){
  el.addEventListener('mousemove',function(e){
    var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.style.transform='translateY(-5px) perspective(900px) rotateX('+(-y*2.4)+'deg) rotateY('+(x*2.4)+'deg)';
  });
  el.addEventListener('mouseleave',function(){el.style.transform='';});
});
