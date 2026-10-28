const fs=require('fs'),vm=require('vm'),assert=require('assert');
const saved={};function boot(){const nodes={},listeners={};const get=s=>nodes[s]??={innerHTML:'',textContent:'',style:{},classList:{toggle(){}},focus(){},value:''};const ctx={console,document:{querySelector:get,addEventListener:(k,f)=>(listeners[k]??=[]).push(f),createElement:()=>({click(){}})},window:{scrollTo(){},setTimeout,clearTimeout},location:{href:'https://test.example/',hash:'',reload(){}},navigator:{},localStorage:{getItem:k=>saved[k],setItem:(k,v)=>saved[k]=v,removeItem:k=>delete saved[k]},setTimeout,clearTimeout,FormData:class{constructor(f){this.values=f.values}get(k){return this.values[k]}},URL,Blob,btoa};vm.createContext(ctx);vm.runInContext(fs.readFileSync('data.js','utf8'),ctx);vm.runInContext(fs.readFileSync('public-data.js','utf8'),ctx);vm.runInContext(fs.readFileSync('public.js','utf8'),ctx);vm.runInContext(fs.readFileSync('app.js','utf8'),ctx);const run=s=>vm.runInContext(s,ctx);const submit=(id,values)=>listeners.submit[0]({preventDefault(){},target:{id,values}});return{get,run,submit,listeners}}
let t=boot();assert(t.get('#app').innerHTML.includes('모든 이야기에는'));
t.submit('login',{uid:'contractor',pw:'glass0518'});assert(!t.run('S.auth'));
t.submit('login',{uid:'denise72',pw:'dlgpfla0704!'});assert(t.run('S.auth'));assert(t.get('#app').innerHTML.includes('denise72'));assert(!t.get('#app').innerHTML.includes('증거 보관함'));
t.run(`publicPage();loginModal()`);assert(t.get('#app').innerHTML.includes('워크스페이스'));assert(t.run('S.auth'));assert(!t.get('#modal').innerHTML.includes('id="login"'));
t.run('publicPage()');t=boot();assert(t.run('S.auth'));assert(t.get('#app').innerHTML.includes('워크스페이스로 돌아가기'));t.run('loginModal()');assert(t.get('#content').innerHTML.includes('작업 인수인계'));
assert(t.run('DOCS.length')>=50);assert(t.run('DOCS.every(d=>d.author&&d.author.name&&d.author.department&&d.author.role&&!d.links)'));
t.run(`openDoc('A-217')`);assert(!t.get('#content').innerHTML.includes('연결 자료'));assert(!t.get('#content').innerHTML.includes('data-open='));assert(!t.get('#content').innerHTML.includes('data-pin'));
t.run(`query='이수현';navigate('search')`);assert(t.get('#content').innerHTML.includes('W-301'));
t.run(`openDoc('W-301');openDoc('P-001');navigate('case')`);assert(t.run('S.case'));
t.submit('supplierRequest',{company:'한결인쇄',requestText:'행사 음료 제공 내역을 확인해 주세요.'});assert(!t.run('S.sponsor'));
t.submit('supplierRequest',{company:'다온차',requestText:'대표에게 별도 병 음료를 제공한 사실이 있는지 확인해 주세요.'});assert(t.run('S.sponsor'));assert(!t.get('#requestStatus').textContent.includes('M-303'));
t.run(`openDoc('M-303');openDoc('M-201');openDoc('M-202');openDoc('W-202');openDoc('F-002');navigate('report')`);assert(!t.get('#content').innerHTML.includes('변조'));assert(!t.get('#content').innerHTML.includes('<option'));
const reason='문정우는 원고 권리를 확보하지 않은 사실을 감추기 위해 수령 동의를 변조하고 별도 병 음료를 보냈습니다. 협찬사는 병 제품을 제공하지 않았습니다.';
t.submit('report',{suspect:'서해준',reason,references:'F-002,M-201,M-202,W-202,M-303,P-001'});assert(!t.run('S.solved'));
t.submit('report',{suspect:'문정우',reason,references:'F-002,W-202'});assert(!t.run('S.solved'));assert(!t.get('#reporterror').textContent.includes('협찬'));
t.submit('report',{suspect:'문정우',reason,references:'F-002,M-201,M-202,W-202,M-303,P-001'});assert(t.run('S.solved'));assert(t.get('#content').innerHTML.includes('이름을 돌려주는 일.'));
for(const v of ['home','entries','inquiries','mail','work','files','people','search','report','help','case']){t.run(`navigate('${v}')`);assert(!t.get('#app').innerHTML.includes('증거 보관함'));assert(!t.get('#content').innerHTML.includes('data-pin'));}
t.run(`navigate('mail');listTerm='인쇄';writer='정민서';renderContent()`);assert(t.get('#content').innerHTML.includes('정민서 / 디자인팀 / 디자이너'));assert(!t.get('#content').innerHTML.includes('data-open="M-201"'));
assert(!fs.readFileSync('app.js','utf8').includes('data-pin'));
console.log('PASS: new/old credentials, main-workspace return, session reload, 54 author-labelled records, no related links/bookmarks, search/filters, supplier request, neutral report rejection, complete ending, all routes');
const pubPages=['home','about','books','book','events','event','notices','notice','contact','privacy'];
const urls=['home.html','about.html','books.html','books.html?genre='+encodeURIComponent('에세이'),'books.html?q='+encodeURIComponent('느린'),'book.html?id=visitor','book.html?id=afternoon','book.html?id=wind','book.html?id=shelf','events.html','event.html?id=ending','event.html?id=afternoon-club','event.html?id=wind-review','notices.html','notice.html?id=event-schedule','notice.html?id=serial-schedule','notice.html?id=delivery-may','notice.html?id=reading-club','notice.html?id=site-maintenance','contact.html','privacy.html'];
for(const url of urls){t.run(`location.href=${JSON.stringify('https://test.example/'+url)};publicPage(publicRoute())`);const page=t.get('#app').innerHTML;assert(!page.includes('허구의 웹 탐색 추리 게임'));assert(page.includes('company-footer'));assert(!page.includes('data-action="about"'));for(const m of page.matchAll(/href="([^"#]+)"/g)){const target=m[1].split('?')[0];if(!target.startsWith('http'))assert(fs.existsSync(''+target),'Missing linked page: '+target)}}
t.run(`location.href='https://test.example/book.html?id=missing';publicPage(publicRoute())`);assert(t.get('#app').innerHTML.includes('요청하신 자료를 찾지 못했습니다.'));
assert(!fs.readFileSync('app.js','utf8').includes('허구의 웹 탐색 추리 게임'));
console.log('PASS: 21 public-page routes, catalog filters, detail contents, all local navigation targets, missing item fallback, removed phrase');

