(function(){
  function tagsHtml(tags){return tags.map(t=>`<span class="tag ${t==='Octobotics'?'octo':'pier'}">${t}</span>`).join('')}
  function setupQA(root){
    const scope=root.dataset.scope||'all'; const input=root.querySelector('.qa-input'); const btn=root.querySelector('.browse-btn'); const dd=root.querySelector('.qa-dropdown'); const opts=root.querySelector('.qa-options'); const answer=root.querySelector('.answer-panel'); const tabs=[...root.querySelectorAll('.qa-tab')]; let filter=scope==='all'?'all':scope;
    function data(){return approvedQuestions.filter(q=>scope==='all'||q.tags.includes(scope)).filter(q=>filter==='all'||q.tags.includes(filter)).filter(q=>!input.value.trim()||q.question.toLowerCase().includes(input.value.toLowerCase())||q.answer.toLowerCase().includes(input.value.toLowerCase())||q.tags.join(' ').toLowerCase().includes(input.value.toLowerCase()))}
    function render(){const rows=data(); opts.innerHTML=rows.length?rows.map(q=>`<div class="qa-option" role="option" data-id="${q.id}"><div class="qa-question">${q.question}</div><div class="tags">${tagsHtml(q.tags)}</div></div>`).join(''):`<div class="no-results">No question matches that search.</div>`; opts.querySelectorAll('.qa-option').forEach(el=>el.onclick=()=>select(+el.dataset.id));}
    function open(){dd.hidden=false;btn.classList.add('open');btn.setAttribute('aria-expanded','true');render()}
    function close(){dd.hidden=true;btn.classList.remove('open');btn.setAttribute('aria-expanded','false')}
    function select(id){const q=approvedQuestions.find(x=>x.id===id);if(!q)return;input.value=q.question;answer.innerHTML=`<div class="answer-card"><div class="tags answer-tags">${tagsHtml(q.tags)}</div><h3>${q.question}</h3><p>${q.answer}</p></div>`;close()}
    btn.onclick=()=>dd.hidden?open():close(); input.onfocus=open; input.oninput=open; tabs.forEach(t=>t.onclick=()=>{filter=t.dataset.filter;tabs.forEach(x=>x.classList.toggle('active',x===t));render()}); document.addEventListener('click',e=>{if(!root.contains(e.target))close()});
    render();
  }
  document.querySelectorAll('.qa-widget').forEach(setupQA);
  const navLinks=[...document.querySelectorAll('.nav-links a[href^="#"]')]; const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean); if(sections.length){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-25% 0px -65%'});sections.forEach(s=>io.observe(s));}
})();
