'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lessons=[
['先認識 NVC','理解自己，也聆聽彼此。','非暴力溝通（NVC）是一種重視感受與需要的溝通方式。可以從觀察、感受、需要、請求四個面向練習，也讓對方有機會表達。','重點是建立理解；對方仍然可以有不同的想法。'],
['觀察','先說發生了什麼。','把能具體描述的事件，與自己對事件的解讀分開。時間、行為與次數，能讓對方更容易理解你在說哪一件事。','「你總是拖拖拉拉」與「約好九點出門，現在九點十分，我們還在家裡」。哪一句比較接近觀察？',['第一句','第二句'],1,'第二句指出具體時間與情況。第一句的「總是」與「拖拖拉拉」包含概括與評價。'],
['感受','留意自己的心情。','試著說出擔心、失望、開心或煩躁。一件事可以同時帶來多種感受，也可以暫時找不到合適的詞。','「我感到焦慮」與「我覺得你很自私」。哪一句是在表達感受？',['第一句','第二句'],0,'「焦慮」描述自己的心情；「你很自私」是在評價對方。'],
['需要','找到自己在意的事。','感受背後可能有休息、理解、自主或連結等需要。需要與具體做法可以分開探索，同一份需要往往有多種滿足方式。','我想要你每天陪我通話，背後可能是我重視連結；除了通話，也能一起討論其他做法。'],
['請求','把期待說得具體。','試著提出具體、可行的行動，並聆聽對方是否願意。對方拒絕時，可以再理解原因、討論其他方式，或說明自己的界線。','「你可以在今天下午五點前告訴我是否參加嗎？」比「你要積極一點」更容易理解。'],
['先停一下','先照顧此刻的自己。','如果現在很激動，可以先暫停、喝水或休息。等自己準備好，再決定是否開始對話。','你可以說：「我現在需要一點時間整理，晚點再一起談，好嗎？」'],
['同理聆聽','用核對代替猜測。','可以試著問：「你是不是有點擔心，因為希望事情能順利完成？」讓對方確認、修正或補充。','對方的感受與需要，由對方確認。你可以理解對方，同時保留自己的不同意見。'],
['保持彈性','句型是練習的扶手。','不一定每次都要依序說完四個部分。熟悉之後，可以使用符合自己習慣的語氣，持續關心彼此的理解。','面對拒絕，可以問：「你有什麼顧慮？我們能不能找另一種做法？」']
];
let lessonIndex=0;
function showLesson(i){lessonIndex=i;$('lesson-menu').innerHTML=lessons.map((l,n)=>`<button type="button" data-lesson="${n}" class="${n===i?'active':''}" aria-pressed="${n===i}">${String(n+1).padStart(2,'0')}　${l[0]}</button>`).join('');const l=lessons[i];$('lesson').innerHTML=`<h3>${l[1]}</h3><p>${l[2]}</p><div class="example">${l[3]}</div>${l[4]?`<div class="quiz">${l[4].map((s,n)=>`<button type="button" data-answer="${n}">${s}</button>`).join('')}</div><p class="feedback" id="feedback" role="status">選一個答案，看看說明。</p>`:`<div class="controls"><span class="small">${i+1} ／ ${lessons.length}</span><button class="secondary" data-lesson="${(i+1)%lessons.length}">${i===7?'重新閱讀':'下一張 →'}</button></div>`}`;}
const scenarios=[
['朋友相處','又臨時改約了','原本期待見面，卻在出發前收到改期訊息。','我們約好今天下午見面，你在約定時間前通知要改期。',['失望','煩躁'],['可預期的安排','體諒'],'下次確定要改期時，提早通知我，讓我們一起重新安排'],
['家庭生活','家事好像都落在我身上','回家看到水槽裡的碗盤，心裡有點累。','今天晚餐後，水槽裡還放著沒有清洗的碗盤。',['疲累','煩躁'],['合作','休息'],'今天晚上幫忙洗碗，並和我討論之後怎麼分工'],
['工作協作','等不到需要的資料','交件時間快到了，資料還沒到齊。','我們約定今天中午提供資料，現在下午兩點，我還沒收到。',['焦慮','擔心'],['合作','清楚的資訊'],'告訴我目前的進度，以及預計可以提供資料的時間'],
['伴侶相處','說話時，你一直看手機','想分享今天的事，卻不知道對方有沒有在聽。','剛才我分享今天的事情時，你看了幾次手機。',['失落','難過'],['傾聽','連結'],'現在留十分鐘放下手機，聽我分享今天的事'],
['校園日常','小組分工卡住了','報告快截止了，分工項目仍未完成。','我們約定昨天完成簡報初稿，目前還有兩頁沒有內容。',['焦慮','無奈'],['合作','公平'],'今晚八點前一起確認未完成的內容與後續分工'],
['自我照顧','我想拒絕，卻說不出口','行程已經很滿，又收到幫忙的邀請。','這週我已經安排三個晚上處理工作，今天又收到支援邀請。',['疲累','為難'],['休息','自主'],'這次先找其他人協助，我需要保留今晚休息的時間']
];
const feelings=['開心','平靜','期待','感動','失望','煩躁','焦慮','擔心','疲累','難過','失落','無奈','為難','困惑'];
const needs=['理解','傾聽','連結','休息','自主','合作','公平','尊重','安全','信任','體諒','可預期的安排','清楚的資訊'];
let step=0;
let state={observation:'',feelings:[],needs:[],extraFeeling:'',extraNeed:'',request:''};
const stepNames=['先停一下','觀察','感受','需要','請求','表達卡'];
function getTerms(key){return [...state[key],state[key==='feelings'?'extraFeeling':'extraNeed'].trim()].filter(Boolean).join('、');}
function resultText(){return `當${state.observation.trim()}\n我感到${getTerms('feelings')}，因為我重視${getTerms('needs')}。\n你願意${state.request.trim().replace(/[？?。！!]+$/,'')}嗎？\n如果有其他想法，我也想聽聽你的考量。`;}
function saveInputs(){const names=['observation','extraFeeling','extraNeed','request'];for(const name of names){const el=$(name);if(el)state[name]=el.value;}}
function validStep(){if(step===1)return !!state.observation.trim();if(step===2)return !!getTerms('feelings');if(step===3)return !!getTerms('needs');if(step===4)return !!state.request.trim();return true;}
function chips(key,items){return `<div class="chips">${items.map(t=>`<button type="button" class="chip" data-key="${key}" data-term="${t}" aria-pressed="${state[key].includes(t)}">${t}</button>`).join('')}</div>`;}
function renderPractice(){ $('steps').innerHTML=stepNames.map((n,i)=>`<li><button data-step="${i}" class="${step===i?'active':''}" ${i>step?'disabled':''} aria-current="${i===step?'step':'false'}">${i===0?'◌':i} ${n}</button></li>`).join('');let content='';
if(step===0)content='<p class="eyebrow">先給自己一點空間</p><h3>你現在準備好整理了嗎？</h3><p>不必急著開始對話。你可以放鬆肩膀、慢慢呼吸，或先離開讓你緊繃的現場。</p><div class="example">想一件你在意的事。接下來，我們會一步一步整理自己的觀察、感受、需要與請求。</div><div class="controls"><button class="secondary" data-action="pause">我想晚點再說</button><button class="button" data-action="next">準備好了，開始整理 →</button></div>';
if(step===1)content=`<h3>發生了什麼事？</h3><p>試著描述具體的時間與行為，先把「總是」、「故意」等解讀放到一旁。</p><label for="observation">我觀察到的事情</label><textarea id="observation" maxlength="600" placeholder="例如：我們約好九點出門，現在九點十分，我們還在家裡。">${esc(state.observation)}</textarea>`;
if(step===2)content=`<h3>此刻，你有什麼感受？</h3><p>可以複選，選擇比較貼近自己的詞就好。</p>${chips('feelings',feelings)}<label for="extraFeeling">或用自己的話補充</label><input id="extraFeeling" maxlength="100" value="${esc(state.extraFeeling)}" placeholder="例如：有點不知所措">`;
if(step===3)content=`<h3>這背後，你在意什麼？</h3><p>同一種感受可能連結不同的需要。可以複選，也能自己補充。</p>${chips('needs',needs)}<label for="extraNeed">或寫下自己重視的事</label><input id="extraNeed" maxlength="100" value="${esc(state.extraNeed)}" placeholder="例如：能專心工作的空間">`;
if(step===4)content=`<h3>你希望接下來怎麼做？</h3><p>寫下一個具體、可行的行動與時間，並保留讓對方表達意願的空間。</p><label for="request">你願意……</label><textarea id="request" maxlength="600" placeholder="例如：今晚八點和我一起花十五分鐘討論分工">${esc(state.request)}</textarea><p class="small">想一想：對方能理解要做什麼嗎？如果對方拒絕，你願意繼續討論嗎？</p>`;
if(step===5)content=`<p class="eyebrow">給對話一個開始</p><h3>這是你整理出的表達。</h3><p>讀一遍，再調整成自己的語氣。這份草稿不代表對方一定會同意。</p><label for="result">我的表達卡（可直接修改）</label><textarea id="result" style="min-height:190px" maxlength="2200">${esc(resultText())}</textarea><div class="controls"><button class="secondary" data-action="back">← 返回修改</button><button class="secondary" data-action="copy">複製文字</button><button class="button" data-action="download">下載圖卡 ↓</button></div><details style="margin-top:20px"><summary>如果對方沒有答應呢？</summary><p>可以問：「你有什麼顧慮？」再討論其他做法。你也可以說明自己的界線，或暫停這段對話。</p></details><button class="text-link secondary" style="margin-top:18px" data-action="reset">開始另一個練習</button>`;
if(step>0&&step<5)content+='<p id="validation" class="feedback" role="status"></p><div class="controls"><button class="secondary" data-action="back">← 上一步</button><button class="button" data-action="next">'+(step===4?'完成我的表達卡':'下一步 →')+'</button></div>';
$('editor').innerHTML=content;}
function toast(message){$('toast').textContent=message;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',3500);}
function wrapText(ctx,text,width){const lines=[];for(const para of text.split('\n')){let line='';for(const c of para){if(ctx.measureText(line+c).width>width){lines.push(line);line='';}line+=c;}lines.push(line);}return lines;}
function downloadCard(){const text=$('result').value.trim();if(!text){toast('請先填寫表達內容。');return;}const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');canvas.width=1080;ctx.font='32px sans-serif';const lines=wrapText(ctx,text,870);canvas.height=Math.max(780,lines.length*58+340);ctx.fillStyle='#f8f7f2';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#245849';ctx.font='24px sans-serif';ctx.fillText('好好說 ／ 我的表達卡',100,105);ctx.fillRect(100,155,65,5);ctx.font='32px sans-serif';lines.forEach((line,i)=>ctx.fillText(line,100,240+i*58));ctx.font='22px sans-serif';ctx.fillStyle='#6d7770';ctx.fillText('先理解，再表達。給彼此一點空間。',100,canvas.height-70);canvas.toBlob(blob=>{if(!blob){toast('下載未成功，請改用複製文字。');return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='好好說-我的表達卡.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/png');}
$('lesson-menu').addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(b)showLesson(Number(b.dataset.lesson));});
$('lesson').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.lesson!==undefined)showLesson(Number(b.dataset.lesson));if(b.dataset.answer!==undefined){const l=lessons[lessonIndex];$('feedback').textContent=(Number(b.dataset.answer)===l[5]?'是的。':'再留意一下。')+l[6];}});
$('scenario-grid').innerHTML=scenarios.map((s,i)=>`<button type="button" class="scenario" data-scenario="${i}"><span class="category">${s[0]} ／ ${String(i+1).padStart(2,'0')}</span><h3>${s[1]}</h3><p>${s[2]}</p><span class="go">試著好好說 ↗</span></button>`).join('');
$('scenario-grid').addEventListener('click',e=>{const b=e.target.closest('[data-scenario]');if(!b)return;if(Object.values(state).some(v=>Array.isArray(v)?v.length:String(v).trim())&&!confirm('載入情境會取代目前的練習內容。要繼續嗎？'))return;const s=scenarios[Number(b.dataset.scenario)];state={observation:s[3],feelings:[...s[4]],needs:[...s[5]],extraFeeling:'',extraNeed:'',request:s[6]};step=1;renderPractice();location.hash='practice';toast('已載入示例，你可以依自己的想法修改。');});
$('steps').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b&&!b.disabled){saveInputs();step=Number(b.dataset.step);renderPractice();}});
$('editor').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;saveInputs();if(b.dataset.term){const list=state[b.dataset.key],t=b.dataset.term;const i=list.indexOf(t);if(i<0)list.push(t);else list.splice(i,1);b.setAttribute('aria-pressed',String(i<0));return;}switch(b.dataset.action){case 'next':if(!validStep()){$('validation').textContent='請先填寫內容，或選擇至少一個比較貼近自己的詞。';return;}step++;renderPractice();break;case 'back':step--;renderPractice();break;case 'pause':toast('可以先休息，等你準備好再回來。');break;case 'copy':try{await navigator.clipboard.writeText($('result').value);toast('已複製表達內容。');}catch{$('result').select();toast('請使用鍵盤或長按，複製已選取的文字。');}break;case 'download':downloadCard();break;case 'reset':if(confirm('要清除目前內容，開始新的練習嗎？')){state={observation:'',feelings:[],needs:[],extraFeeling:'',extraNeed:'',request:''};step=0;renderPractice();}break;}});
showLesson(0);renderPractice();
