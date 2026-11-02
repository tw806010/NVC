const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
const elements={};const events=[];let requested;
const element=id=>elements[id]??={value:'',checked:false,innerHTML:'',textContent:'',disabled:false,listeners:{},addEventListener(name,fn){this.listeners[name]=fn;},setAttribute(){}};
const result={observation:'<img src=x onerror=alert(1)>',feelings:['擔心'],needs:['合作'],request:'說明進度',draft:'我想了解進度。',questions:[],advice:'請確認。',safetyConcern:false};
const sandbox={document:{getElementById:element,dispatchEvent:e=>events.push(e)},fetch:async(url,opts)=>{requested={url,opts};return Response.json({result});},setTimeout,clearTimeout,AbortController,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail;}}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('ai.js','utf8'),sandbox);
const submit=()=>element('ai-form').listeners.submit({preventDefault(){}});
element('ai-input').value='虛構情境：小組作業尚未完成。';
await submit();assert.equal(requested,undefined,'未同意時不得送出');
element('ai-adult').checked=true;element('ai-consent').checked=true;
await submit();assert.ok(requested.url.endsWith('/analyze'));assert.equal(JSON.parse(requested.opts.body).adult,true);assert.ok(!element('ai-output').innerHTML.includes('<img'));assert.ok(element('ai-output').innerHTML.includes('&lt;img'));assert.equal(element('ai-submit').disabled,false);
element('ai-output').listeners.click({target:{closest:()=>true}});assert.equal(events.length,1);assert.equal(events[0].type,'nvc-ai-apply');
sandbox.fetch=async()=>Response.json({error:'額度用完'},{status:429});await submit();assert.equal(element('ai-input').value,'虛構情境：小組作業尚未完成。');assert.equal(element('ai-status').textContent,'額度用完');assert.equal(element('ai-output').innerHTML,'');assert.equal(element('ai-submit').disabled,false);
console.log('通過：AI 同意檢查、請求格式、安全顯示、套用事件與失敗後保留輸入。');
})().catch(e=>{console.error(e);process.exitCode=1;});
