(() => {
"use strict";

const META = {
  grammar:"Grammar B1/B2",
  vocabulary:"Airport vocabulary",
  reading:"Reading comprehension",
  dialogue:"Passenger interaction",
  instructions:"Security instructions"
};
const LETTERS=["A","B","C","D"];
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
function q(id,cat,question,correct,wrong,explanation,context=""){
  const options=shuffle([correct,...wrong]);
  return {id,cat,question,options,answer:options.indexOf(correct),explanation,context};
}

const BANK=[];

// 30 grammar
[
["Passengers ___ follow the instructions given by security staff.","must",["must to","are must","to must"],"'Must' is followed by the base form without 'to'."],
["If you ___ any liquids, please take them out of your bag.","have",["had had","having","has"],"With 'you', use 'have'."],
["The officer asked the passenger ___ wait.","to",["for","at","that"],"'Ask someone to do something'."],
["This bag ___ be checked again.","needs to",["needs","need to","is need"],"'Needs to be checked' expresses necessity in the passive structure."],
["I have worked here ___ two years.","for",["since","from","during"],"Use 'for' with a period of time."],
["She has been on duty ___ 6 a.m.","since",["for","during","from"],"Use 'since' with a starting point."],
["If the alarm rings, the officer ___ the procedure.","follows",["follow","will following","followed always"],"Zero/first conditional style: present simple is natural for procedures."],
["You ___ leave your bag unattended.","must not",["don't must","mustn't to","not must"],"'Must not' expresses prohibition."],
["The passengers ___ waiting for the gate to open.","are",["is","be","has"],"Plural subject + 'are'."],
["By the time we arrived, the flight ___ already departed.","had",["has","have","was"],"Past perfect: 'had departed'."],
["Could you please ___ your jacket?","remove",["removed","removing","to remove"],"After 'could you please', use the base verb."],
["There ___ several people in the queue.","are",["is","was being","has"],"Plural noun: 'there are'."],
["The supervisor said that the area ___ closed.","was",["were","be","has"],"Reported speech in the past: 'was closed'."],
["You may collect your belongings once the check ___.","is complete",["complete","will complete","has completing"],"Passive/state expression: 'is complete'."],
["If I ___ the answer, I would tell you.","knew",["know","will know","had know"],"Second conditional: if + past simple."],
["The bag was heavier ___ expected.","than",["then","that","as"],"Comparative: 'heavier than'."],
["Neither the passenger nor the officer ___ injured.","was",["were","be","have"],"With the nearest singular noun 'officer', 'was' is standard."],
["We need ___ whether the document is valid.","to check",["checking to","check to","to checking"],"'Need to' + base verb."],
["The passenger asked where the gate ___.","was",["is it","did it","has"],"Indirect questions use statement word order."],
["The team worked efficiently ___ the heavy traffic.","despite",["although of","despite of","because"],"'Despite' + noun phrase."],
["You should speak ___ so that everyone can understand.","clearly",["clear","clearness","cleared"],"An adverb modifies 'speak'."],
["This is the person ___ bag was selected for an additional check.","whose",["who's","which","whom"],"'Whose' shows possession."],
["The officer was responsible ___ checking the access point.","for",["of","to","at"],"Collocation: 'responsible for'."],
["We have not received the update ___.","yet",["already","still not ever","since"],"'Yet' is common in negative present perfect sentences."],
["The queue moved more quickly ___ we expected.","than",["then","as","that"],"Comparison uses 'than'."],
["The procedure ___ recently.","has been updated",["has updated","was update","is updating by"],"Present perfect passive."],
["He is used to ___ night shifts.","working",["work","worked","to work"],"'Be used to' + -ing/noun."],
["I would rather ___ the instruction again.","check",["to check","checking","checked"],"'Would rather' + base verb."],
["There is no point in ___ with an angry passenger.","arguing",["argue","to argue","argued"],"'No point in' + -ing."],
["The supervisor asked me ___ I was available on Sunday.","whether",["that","what","which"],"'Whether' introduces an indirect yes/no question."]
].forEach((x,i)=>BANK.push(q(`G${i+1}`,"grammar",x[0],x[1],x[2],x[3])));

// 25 vocabulary
[
["What does 'restricted area' mean?","An area with controlled access",["A public waiting area","A baggage reclaim area","A public car park"]],
["What is the closest meaning of 'remain calm'?","Stay composed",["Leave immediately","Speak loudly","Move quickly"]],
["What does 'belongings' mean?","Personal items",["Colleagues","Documents only","Uniforms"]],
["What does 'unattended baggage' mean?","Baggage left without someone looking after it",["Damaged baggage","Checked baggage","Heavy baggage"]],
["What is a 'security checkpoint'?","A place where security checks are carried out",["A ticket office","A restaurant","A boarding gate only"]],
["What does 'prohibited item' mean?","An item that is not allowed",["An expensive item","A lost item","A fragile item"]],
["What is the opposite of 'authorized'?","Unauthorized",["Organized","Available","Identified"]],
["What does 'screening' mean in an airport security context?","A security examination or check",["Selling tickets","Cleaning aircraft","Loading meals"]],
["What does 'to comply with' mean?","To follow or obey",["To question aggressively","To postpone","To ignore"]],
["What does 'to report an incident' mean?","To inform the appropriate person about an event",["To hide an event","To solve it privately","To leave the area"]],
["What does 'shift' mean in a work context?","A scheduled period of work",["A passenger queue","A security device","A flight delay"]],
["What is a 'night shift'?","A work period during nighttime hours",["A cancelled flight","A break between flights","An early check-in"]],
["What does 'access badge' mean?","An identification card used for controlled access",["A boarding pass","A baggage tag","A passport stamp"]],
["What does 'queue' mean?","A line of people waiting",["A restricted door","A document check","A luggage belt"]],
["What does 'supervisor' mean?","A person responsible for overseeing work",["A passenger","A visitor","A pilot only"]],
["What does 'additional check' mean?","A further security examination",["A free service","A boarding announcement","A luggage delivery"]],
["What does 'procedure' mean?","An established way of carrying out a task",["A personal opinion","A random choice","A passenger request"]],
["What does 'accurate' mean?","Correct and precise",["Very fast","Friendly only","Uncertain"]],
["What does 'alert' mean when describing a worker?","Attentive and ready to notice problems",["Tired","Uninterested","Late"]],
["What does 'reliable' mean?","Dependable and trustworthy",["Easily distracted","Temporary","Untrained"]],
["What does 'to escalate an issue' mean?","To refer it to a higher or appropriate level",["To ignore it","To make it secret","To solve it outside procedure"]],
["What does 'valid document' mean?","A document that is current and acceptable",["Any photocopy","An expired document","A handwritten note"]],
["What does 'to verify' mean?","To check that something is correct or true",["To assume","To postpone","To replace"]],
["What does 'crowded' mean?","Full of many people",["Completely empty","Very quiet","Restricted"]],
["What does 'duty' mean in 'on duty'?","Working and responsible at that time",["Travelling as a passenger","On holiday","Waiting at home"]]
].forEach((x,i)=>BANK.push(q(`V${i+1}`,"vocabulary",x[0],x[1],x[2],`Correct: ${x[1]}.`)));

// 25 dialogue
[
["A passenger asks: 'Where should I put my laptop?'","Please take it out of your bag and place it in the tray.",["Keep it in your pocket.","Leave it on the floor.","You don't need to do anything."]],
["A passenger says: 'I don't understand.'","Of course. I'll explain it again.",["That's not my problem.","Just move.","You should know already."]],
["A passenger asks: 'Why do I need another check?'","I can explain the procedure. Please follow my instructions.",["Because I said so.","You don't need it.","Go away, please."]],
["A passenger says: 'I'm going to miss my flight!'","I understand. We still need to complete the required check.",["Then skip the check.","Run through the checkpoint.","Argue with the other passengers."]],
["You need a passenger to wait.","Please wait here for a moment.",["You wait now there.","Waiting you here.","Stay because I say."]],
["You need the passenger to open a bag.","Could you please open your bag?",["Open bag you.","You opening this.","Bag must open yourself."]],
["You need the passenger to empty pockets.","Please empty your pockets.",["Please remove your pockets.","Please finish your pockets.","Please leave your clothes."]],
["The passenger has finished the check.","You can collect your belongings now.",["You can delete your belongings.","Your belongings are forbidden.","Leave everything here."]],
["You did not understand what the passenger said.","Could you repeat that, please?",["Speak normal.","Say again fast.","I don't care."]],
["You want to confirm ownership of a bag.","Is this your bag?",["Are this bag you?","This bag have you?","You is bag owner?"]],
["A passenger asks if they can go.","Yes, the check is complete. You may proceed.",["Proceed before check.","You can go maybe no.","Go if you want."]],
["You need someone to step back.","Please take one step back.",["Please make a back.","Go backwards because.","Step your body."]],
["A passenger asks where to go next.","Please follow the signs to your gate.",["Find somewhere.","Go outside first.","Ask another passenger."]],
["You notice the passenger still has a phone in a pocket.","Please remove your phone from your pocket.",["Phone is pocket no.","Destroy your phone.","Leave your phone there."]],
["You need the passenger to stay calm.","Please remain calm and follow my instructions.",["Stop being difficult.","Calm yourself immediately!","You are causing problems."]],
["A passenger asks what 'liquids' means.","It includes drinks, gels and similar liquid products.",["It only means water.","It means electronic devices.","It means documents."]],
["You need to ask for a document.","May I see your document, please?",["Give document.","Show me now.","Document is mine."]],
["A passenger is speaking too quickly.","Could you speak a little more slowly, please?",["Speak less English.","Stop talking.","Say only yes or no."]],
["You need to ask if a bag belongs to them.","Does this bag belong to you?",["This bag belongs?","You belong this bag?","Is you bag?"]],
["The passenger thanks you.","You're welcome. Have a good flight.",["No problem you.","Go now.","Finished."]],
["You need a passenger to raise their arms.","Please raise your arms.",["Please grow your arms.","Put arms highing.","Make your arms up."]],
["You want to reassure a cooperative passenger.","Thank you for your cooperation.",["You finally understood.","Good, now hurry.","You caused a delay."]],
["A passenger asks if they can keep their jacket on.","Please remove your jacket for the check.",["Jacket is no.","Keep it if you want.","Throw it away."]],
["You need to call a colleague for assistance.","Please wait here while I ask a colleague to assist us.",["Wait; I disappear.","Solve it yourself.","Go to another queue without asking."]],
["You need to explain a short delay.","There may be a short delay while we complete the check.",["Delay because people.","You wait unknown.","Maybe go later."]]
].forEach((x,i)=>BANK.push(q(`D${i+1}`,"dialogue",x[0],x[1],x[2],`Best professional response: ${x[1]}`)));

// 15 instructions
[
["Choose the clearest instruction.","Please place all metal items in the tray.",["Put metals somewhere.","All metal is bag.","Tray needs your things maybe."]],
["Choose the clearest instruction.","Please walk through the metal detector when I tell you.",["Walk detector now maybe.","Go machine when.","Metal walk please."]],
["Choose the clearest instruction.","Please keep your boarding pass with you.",["Boarding pass keep yes.","Pass doesn't matter.","Lose the boarding pass."]],
["Choose the clearest instruction.","Please do not leave your bags unattended.",["Bags no watching.","Leave bags anywhere.","Your bags must go away."]],
["Choose the clearest instruction.","Please wait behind the line until you are called.",["Wait line until call.","Stand wherever.","Cross the line now."]],
["Choose the clearest instruction.","Please remove large electronic devices from your bag.",["Electronics big outside bag please.", "Keep every device hidden.", "Large devices are passengers."]],
["Choose the clearest instruction.","Please follow the officer's instructions.",["Do officer things.","Instructions are optional.","Ask another passenger instead."]],
["Choose the clearest instruction.","Please place your bag flat on the belt.",["Bag flat belt please.","Hold the bag in the air.","Put it under the belt."]],
["Choose the clearest instruction.","Please move forward when the area is clear.",["Move whenever.","Go through other people.","Wait forever."]],
["Choose the clearest instruction.","Please stand still for a moment.",["Stay stilling.","Walk around.","Sit on the floor."]],
["Choose the clearest instruction.","Please take off your belt if requested.",["Belt off maybe when request.","Never remove anything.","Give your belt to another passenger."]],
["Choose the clearest instruction.","Please keep the entrance clear.",["Entrance no people place.","Block the entrance.","Leave bags in the doorway."]],
["Choose the clearest instruction.","Please show me the item you mentioned.",["Item show please now thing.","Hide the item.","Give it to another passenger."]],
["Choose the clearest instruction.","Please remain in this area until the check is complete.",["Stay here until finish check.","Walk away during the check.","Change queue without telling anyone."]],
["Choose the clearest instruction.","Please tell me if you need assistance.",["Need help say me.","Never ask for help.","Assistance is not possible."]]
].forEach((x,i)=>BANK.push(q(`I${i+1}`,"instructions",x[0],x[1],x[2],`Clear professional wording: ${x[1]}`)));

// 25 reading questions across 5 passages
const readings = [
{
text:"Airport security staff must balance efficiency with accuracy. During busy periods, queues can become longer, but required checks should still be completed correctly. Clear communication can reduce confusion and help passengers understand what is expected of them.",
qs:[
["What is the main idea of the passage?","Security staff should remain accurate even when the airport is busy.",["Long queues mean checks should be skipped.","Communication is unnecessary during busy periods.","Passengers should carry out security checks themselves."]],
["What can clear communication help reduce?","Confusion",["Staffing levels","Flight distance","Baggage weight"]],
["According to the passage, what should happen during busy periods?","Required checks should still be completed correctly.",["Checks should automatically be cancelled.","Only fast passengers should be checked.","Accuracy becomes less important."]],
["The word 'balance' is closest in meaning to:","manage two needs at the same time",["cancel one activity","measure luggage","change a timetable"]],
["Which statement is supported by the passage?","Efficiency and accuracy are both important.",["Only speed matters.","Queues are always caused by staff.","Passengers should decide the procedure."]]
]},
{
text:"A new employee begins an early shift at 5:30 a.m. Before starting work, she checks the latest operational notices and confirms her assigned position. During the shift, she notices that one instruction has recently changed, so she asks her supervisor to confirm the updated procedure.",
qs:[
["What does the employee do before starting work?","She checks operational notices and her assigned position.",["She changes the procedure herself.","She waits for a passenger complaint.","She leaves the workplace."]],
["Why does she speak to her supervisor?","To confirm an updated procedure.",["To request a holiday.","To report a lost suitcase.","To change her shift immediately."]],
["What quality does the employee demonstrate?","Attention to updated instructions",["Refusal to follow procedures","Impatience with colleagues","Preference for guessing"]],
["At what time does the shift begin?","5:30 a.m.",["3:50 a.m.","5:30 p.m.","6:30 a.m."]],
["Which action would be least consistent with the passage?","Continuing with the old procedure without checking",["Reading notices","Confirming an assignment","Asking for clarification"]]
]},
{
text:"A passenger becomes frustrated because an additional check is taking longer than expected. The security officer listens, explains that the check must be completed, and keeps a calm tone. The passenger remains unhappy but follows the instructions.",
qs:[
["Why is the passenger frustrated?","The additional check is taking longer than expected.",["The flight has been cancelled.","The officer lost the passport.","The gate is closed permanently."]],
["How does the officer respond?","Calmly explains that the check must be completed.",["Ends the check immediately.","Raises their voice.","Ignores the passenger completely."]],
["What happens in the end?","The passenger follows the instructions.",["The passenger leaves the airport.","The officer cancels the flight.","The check is skipped."]],
["The word 'remains' in the final sentence means:","continues to be",["leaves","becomes suddenly","forgets"]],
["Which skill is most clearly shown by the officer?","Professional communication under pressure",["Advanced mathematics","Aircraft maintenance","Ticket sales"]]
]},
{
text:"Night and weekend work is common in airports because operations continue outside normal office hours. Employees working shifts need to organize sleep, travel and personal commitments carefully. Reliability is particularly important because one person's late arrival may affect colleagues who are waiting to finish their own shift.",
qs:[
["Why is shift work common in airports?","Operations continue outside normal office hours.",["Airports only open at night.","Passengers never travel during the day.","Office staff require it."]],
["What do shift workers need to organize carefully?","Sleep, travel and personal commitments",["Only meals","Aircraft routes","Ticket prices"]],
["Why is reliability especially important?","A late arrival can affect colleagues.",["It guarantees free parking.","It changes the weather.","It reduces baggage weight."]],
["What does 'commitments' mean here?","Responsibilities or planned obligations",["Security devices","Airport buildings","Uniforms"]],
["Which statement is supported?","Punctuality matters in shift handovers.",["Night work requires no planning.","Weekend work never occurs.","Each shift is independent of other workers."]]
]},
{
text:"When an employee is unsure how to handle an unusual situation, guessing can create unnecessary risk. A better approach is to use the available procedure, check reliable information and ask the appropriate person for support when necessary. Escalating a question is not a weakness when the issue falls outside one's responsibility or authority.",
qs:[
["What is the passage mainly recommending?","Use procedures and seek appropriate support instead of guessing.",["Always make decisions alone.","Avoid asking questions.","Ignore unusual situations."]],
["Why can guessing be a problem?","It can create unnecessary risk.",["It always saves time.","It makes procedures clearer.","It reduces responsibility."]],
["According to the passage, asking for support is:","appropriate when needed",["always a weakness","forbidden","only for passengers"]],
["What does 'authority' mean in this context?","The power or permission to make certain decisions",["Physical strength","A flight schedule","A type of baggage"]],
["Which employee response best matches the passage?","Check the procedure and contact the appropriate person.",["Invent a solution quickly.","Ignore the problem.","Ask a passenger to decide."]]
]}
];
let rid=1;
readings.forEach(r=>r.qs.forEach(x=>BANK.push(q(`R${rid++}`,"reading",x[0],x[1],x[2],`Answer supported by the passage: ${x[1]}`,r.text))));

if(BANK.length!==120) console.warn("English bank size:",BANK.length);
if(typeof document==="undefined"){ console.log(JSON.stringify({englishBank:BANK.length,byCategory:Object.fromEntries(Object.keys(META).map(k=>[k,BANK.filter(q=>q.cat===k).length]))},null,2)); return; }

const E = id=>document.getElementById(id);
const el={
 setup:E("engSetup"),quiz:E("engQuiz"),result:E("engResult"),start:E("engStart"),
 modes:[...document.querySelectorAll(".english-mode")],progressText:E("engProgressText"),progressBar:E("engProgressBar"),
 timer:E("engTimer"),category:E("engCategory"),context:E("engContext"),question:E("engQuestion"),options:E("engOptions"),
 feedback:E("engFeedback"),prev:E("engPrev"),next:E("engNext"),finish:E("engFinish"),score:E("engScore"),summary:E("engSummary"),
 stats:E("engStats"),review:E("engReview"),restart:E("engRestart")
};
let selectedMode="full";
let state={questions:[],answers:{},current:0,seconds:0,duration:0,practice:false};
let handle=null;

el.modes.forEach(b=>b.addEventListener("click",()=>{
  el.modes.forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selectedMode=b.dataset.mode;
}));

function start(){
  const config=selectedMode==="full"?{n:60,min:45,practice:false}:selectedMode==="quick"?{n:30,min:25,practice:false}:{n:30,min:0,practice:true};
  state={questions:shuffle(BANK).slice(0,config.n),answers:{},current:0,seconds:config.min*60,duration:config.min*60,practice:config.practice};
  el.setup.classList.add("hidden");el.result.classList.add("hidden");el.quiz.classList.remove("hidden");
  render();startTimer();
}
function startTimer(){
  clearInterval(handle);
  if(!state.duration){el.timer.textContent="∞";return;}
  tick();
  handle=setInterval(()=>{state.seconds--;tick();if(state.seconds<=0)finish(true);},1000);
}
function tick(){
  const m=Math.max(0,Math.floor(state.seconds/60)),s=Math.max(0,state.seconds%60);
  el.timer.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  const ratio=state.duration?state.seconds/state.duration:1;
  el.timer.className="timer"+(ratio<=.1?" danger":ratio<=.25?" warning":"");
}
function render(){
  const q=state.questions[state.current],given=state.answers[state.current];
  el.progressText.textContent=`Domanda ${state.current+1} di ${state.questions.length}`;
  el.progressBar.style.width=`${(state.current+1)/state.questions.length*100}%`;
  el.category.textContent=META[q.cat].toUpperCase();
  if(q.context){el.context.textContent=q.context;el.context.classList.remove("hidden");}
  else{el.context.classList.add("hidden");el.context.textContent="";}
  el.question.textContent=q.question;
  el.options.innerHTML=q.options.map((o,i)=>{
    let cls="eng-option";
    if(given===i)cls+=" selected";
    if(state.practice&&given!=null){
      if(i===q.answer)cls+=" correct";
      if(i===given&&i!==q.answer)cls+=" wrong";
    }
    return `<button class="${cls}" data-i="${i}"><strong>${LETTERS[i]})</strong> ${o}</button>`;
  }).join("");
  el.options.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.answers[state.current]=Number(b.dataset.i);render();}));
  if(state.practice&&given!=null){el.feedback.textContent=q.explanation;el.feedback.classList.remove("hidden");}
  else el.feedback.classList.add("hidden");
  el.prev.disabled=state.current===0;
  el.next.textContent=state.current===state.questions.length-1?"Concludi →":"Avanti →";
}
function finish(forced=false){
  clearInterval(handle);
  if(!forced){
    const unanswered=state.questions.length-Object.keys(state.answers).length;
    if(unanswered&&!confirm(`Hai ${unanswered} domande senza risposta. Terminare comunque?`))return;
  }
  const correct=state.questions.reduce((n,q,i)=>n+(state.answers[i]===q.answer?1:0),0);
  const pct=Math.round(correct/state.questions.length*100);
  const answered=Object.keys(state.answers).length;
  el.quiz.classList.add("hidden");el.result.classList.remove("hidden");
  el.score.textContent=`${pct}%`;
  let band=pct>=80?"Buona prestazione per un allenamento B2.":pct>=65?"Livello discreto: conviene rinforzare gli errori.":"Serve altro allenamento prima di sentirsi sicuri.";
  el.summary.textContent=`${correct} risposte corrette su ${state.questions.length}. ${band} Questo punteggio è solo didattico e non equivale a una certificazione CEFR B2.`;
  const by={};
  state.questions.forEach((q,i)=>{by[q.cat]??={c:0,t:0};by[q.cat].t++;if(state.answers[i]===q.answer)by[q.cat].c++;});
  el.stats.innerHTML=Object.entries(by).map(([k,v])=>`<div class="eng-stat"><span>${META[k]}</span><b>${Math.round(v.c/v.t*100)}%</b></div>`).join("");
  el.review.innerHTML=state.questions.map((q,i)=>{
    const g=state.answers[i],ok=g===q.answer;
    return `<div class="eng-review-item"><strong>${i+1}. ${q.question}</strong>
      <p class="${ok?"correct-text":"wrong-text"}">Tua risposta: ${g==null?"—":q.options[g]}</p>
      <p class="correct-text">Corretta: ${q.options[q.answer]}</p>
      <p>${q.explanation}</p></div>`;
  }).join("");
  window.scrollTo({top:0,behavior:"smooth"});
}
el.start.addEventListener("click",start);
el.prev.addEventListener("click",()=>{if(state.current>0){state.current--;render();}});
el.next.addEventListener("click",()=>{if(state.current<state.questions.length-1){state.current++;render();}else finish(false);});
el.finish.addEventListener("click",()=>finish(false));
el.restart.addEventListener("click",()=>{clearInterval(handle);el.result.classList.add("hidden");el.quiz.classList.add("hidden");el.setup.classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});});
})();