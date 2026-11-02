'use strict';
(() => {
  const endpoint = 'https://nvc-ai.tw0909806010.workers.dev/analyze';
  const el = id => document.getElementById(id);
  const safe = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let latest = null;
  el('ai-form').addEventListener('submit', async event => {
    event.preventDefault();
    const text=el('ai-input').value.trim();
    if(text.length<5||text.length>1200){el('ai-status').textContent='請輸入 5 至 1200 字的練習內容。';return;}
    if(!el('ai-adult').checked||!el('ai-consent').checked){el('ai-status').textContent='請先確認年齡及資料處理說明。';return;}
    latest=null;el('ai-output').innerHTML='';el('ai-submit').disabled=true;el('ai-status').textContent='正在整理，請稍候……';el('ai-output').setAttribute('aria-busy','true');
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),32000);
    try {
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,adult:true,consent:true}),signal:controller.signal,credentials:'omit'});
      let data;try{data=await response.json();}catch{throw new Error('AI 服務尚未準備完成，請先使用下方圖卡練習。');}
      if(!response.ok)throw new Error(typeof data.error==='string'?data.error:'暫時無法整理，請稍後再試。');
      const r=data.result;
      if(!r||['observation','request','draft','advice'].some(k=>typeof r[k]!=='string')||['feelings','needs','questions'].some(k=>!Array.isArray(r[k])||r[k].some(x=>typeof x!=='string'))||typeof r.safetyConcern!=='boolean')throw new Error('AI 回覆格式不完整，請稍後再試。');
      latest=r;
      const box=(title,body)=>`<article class="ai-card"><h4>${title}</h4><p>${safe(body||'資訊還不夠，可以先補充具體情況。')}</p></article>`;
      el('ai-output').innerHTML=`<p class="ai-note">以下是 AI 的整理與推測，請依自己的經驗確認及修改。</p>${r.safetyConcern?'<p class="ai-safety">先照顧安全與界線，現在不必急著與對方對話。</p>':''}<div class="ai-grid">${box('觀察到的事件',r.observation)}${box('可能的感受',r.feelings.join('、'))}${box('可能的需要',r.needs.join('、'))}${box('可以討論的請求',r.request)}</div>${box('給你的建議',r.advice)}${r.questions.length?box('可以再釐清的事',r.questions.join('\n')):''}${r.draft&&!r.safetyConcern?box('表達草稿',r.draft):''}${!r.safetyConcern&&(r.observation||r.feelings.length||r.needs.length||r.request)?'<button type="button" class="button" id="ai-apply">用這些建議開始練習 →</button>':''}`;
      el('ai-status').textContent='整理完成。建議不代表對方的想法，請先確認是否符合你的情況。';
    } catch(error){el('ai-status').textContent=controller.signal.aborted?'整理時間較長，請稍後再試。你的文字仍保留在輸入框。':error instanceof TypeError?'無法連上 AI 服務，請先使用原有圖卡。你的文字仍保留。':error.message;}
    finally{clearTimeout(timer);el('ai-submit').disabled=false;el('ai-output').setAttribute('aria-busy','false');}
  });
  el('ai-output').addEventListener('click',event=>{
    if(!event.target.closest('#ai-apply')||!latest||latest.safetyConcern)return;
    document.dispatchEvent(new CustomEvent('nvc-ai-apply',{detail:latest}));
  });
})();
