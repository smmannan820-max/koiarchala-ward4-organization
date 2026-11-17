import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getFirestore,collection,getDocs,addDoc,query,where}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import{firebaseConfig}from"./firebase-config.js";
const db=getFirestore(initializeApp(firebaseConfig)), $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function card(m,extra=""){return `<article class="item person">${m.photoUrl?`<img class="avatar" src="${esc(m.photoUrl)}" alt="">`:`<div class="avatar placeholder">ছবি নেই</div>`}<div><h3>${esc(m.name||"")}</h3>${extra?`<b>${esc(extra)}</b>`:""}<p>${esc(m.phone||"")}</p><p>${esc(m.address||"")}</p>${m.blood?`<small>রক্ত: ${esc(m.blood)}</small>`:""}${m.profession?`<small>পেশা: ${esc(m.profession)}</small>`:""}${m.memberId?`<small>সদস্য নম্বর: ${esc(m.memberId)}</small>`:""}</div></article>`}
async function load(col,target,render,empty="এখনো কোনো তথ্য যোগ করা হয়নি।"){try{const snap=await getDocs(collection(db,col));$(target).innerHTML=snap.empty?`<p>${empty}</p>`:snap.docs.map(d=>render(d.data())).join("");return snap.size}catch(e){$(target).innerHTML=`<p>তথ্য লোড হয়নি: ${esc(e.message)}</p>`;return 0}}
let members=[];
async function init(){
 const [mc,cc,ac]=await Promise.all([
 load("members","membersList",m=>card(m), "এখনো অনুমোদিত সদস্য নেই।"),
 load("committee","committeeList",m=>card(m,m.position), "কমিটির তথ্য শিগগির যোগ করা হবে।"),
 load("advisers","advisersList",m=>card(m,m.position||"উপদেষ্টা"), "উপদেষ্টাদের তথ্য শিগগির যোগ করা হবে।")
 ]);
 $("memberCount").textContent=mc;$("committeeCount").textContent=cc;$("adviserCount").textContent=ac;
 try{const s=await getDocs(collection(db,"members"));members=s.docs.map(d=>d.data())}catch{}
 $("search").addEventListener("input",e=>{let term=e.target.value.toLowerCase();$("membersList").innerHTML=members.filter(m=>[m.name,m.blood,m.memberId].join(" ").toLowerCase().includes(term)).map(m=>card(m)).join("")||"<p>কোনো সদস্য পাওয়া যায়নি।</p>"});
 await load("activities","activitiesList",m=>`<article class="item">${m.photoUrl?`<img class="widephoto" src="${esc(m.photoUrl)}">`:""}<h3>${esc(m.title)}</h3><small>${esc(m.date||"")}</small><p>${esc(m.details||"")}</p>${m.recipient?`<p>সহায়তা পেয়েছেন: ${esc(m.recipient)}</p>`:""}</article>`);
 try{let s=await getDocs(collection(db,"finance")),income=0,expense=0,rows=[];s.forEach(d=>{let x=d.data();if(x.kind==="income")income+=Number(x.amount||0);else expense+=Number(x.amount||0);rows.push(`<p>${esc(x.date||"")} · ${esc(x.person||"")} · ${Number(x.amount||0)} টাকা (${x.kind==="income"?"জমা":"ব্যয়"}) ${esc(x.details||"")}</p>`)});$("financeSummary").innerHTML=`<b>মোট জমা: ${income} টাকা</b><b>মোট ব্যয়: ${expense} টাকা</b><b>অবশিষ্ট: ${income-expense} টাকা</b>`;$("financeList").innerHTML=rows.join("")||"<p>এখনো কোনো আর্থিক লেনদেন যোগ করা হয়নি।</p>"}catch(e){$("financeSummary").textContent="হিসাব লোড করা যায়নি।"}
 await load("gallery","galleryList",m=>`<figure><img src="${esc(m.url)}" alt=""><figcaption>${esc(m.caption||"")}</figcaption></figure>`,"এখনো কোনো ছবি যোগ করা হয়নি।");
}
$("applyForm").addEventListener("submit",async e=>{e.preventDefault();let f=Object.fromEntries(new FormData(e.target));try{await addDoc(collection(db,"applications"),{...f,status:"pending",createdAt:new Date().toISOString()});$("applyMsg").textContent="আপনার আবেদন জমা হয়েছে। অ্যাডমিন অনুমোদনের পর সদস্য তালিকায় যুক্ত হবে।";e.target.reset()}catch(err){$("applyMsg").textContent="আবেদন জমা হয়নি: "+err.message}});
init();