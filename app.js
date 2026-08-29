(() => {
"use strict";

const META = {
  attention:{label:"Attenzione percettiva",desc:"codici, confronti, ricerca bersagli"},
  abstract:{label:"Ragionamento astratto",desc:"pattern, rotazioni, matrici"},
  numerical:{label:"Ragionamento numerico",desc:"serie, percentuali, dati"},
  verbal:{label:"Ragionamento verbale",desc:"deduzioni, V/F/ND, testi"},
  concentration:{label:"Concentrazione",desc:"rapidità e precisione"},
  situational:{label:"SJT Security",desc:"giudizio situazionale"},
  inbox:{label:"In-basket",desc:"priorità e organizzazione"},
  personality:{label:"Stile comportamentale",desc:"autovalutazione non punteggiata"}
};
const SCALE=["Per nulla","Poco","Abbastanza","Molto","Moltissimo"];
const LETTERS=["A","B","C","D","E"];
const VERSION="4.0.0";

function q(id,cat,stem,options,answer,explanation,diff=2,type="single",html=false){return{id,cat,stem,options,answer,explanation,diff,type,html};}
function seededShuffle(arr,seed){const a=[...arr];let s=seed>>>0;const rnd=()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296};for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function makeOpts(correct,vals,seed){const arr=seededShuffle([correct,...vals.filter(v=>v!==correct)].slice(0,4),seed);return[arr,arr.indexOf(correct)];}
function numOpts(c,spread,seed){const vals=[c,c+spread,Math.max(0,c-spread),c+Math.max(1,Math.floor(spread/2))];const arr=seededShuffle([...new Set(vals)].slice(0,4),seed);while(arr.length<4)arr.push(c+arr.length+2);return[arr,arr.indexOf(c)];}
function pct(n){return Number.isInteger(n)?String(n):n.toFixed(1).replace(".",",");}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}

function buildNumerical(){
  const out=[];let id=1;
  for(let i=0;i<20;i++){
    const start=2+i%8,step=2+i%7,seq=Array.from({length:5},(_,k)=>start+step*k),c=start+step*5;const [o,a]=numOpts(c,step+2,100+i);
    out.push(q(`N${id++}`,"numerical",`Completa la serie: ${seq.join(" – ")} – ?`,o.map(String),a,`La differenza è costante: +${step}.`,1));
  }
  for(let i=0;i<20;i++){
    const start=5+i,inc=1+i%4,seq=[start];for(let k=0;k<4;k++)seq.push(seq.at(-1)+inc+k);const c=seq.at(-1)+inc+4;const [o,a]=numOpts(c,4,200+i);
    out.push(q(`N${id++}`,"numerical",`Completa la serie: ${seq.join(" – ")} – ?`,o.map(String),a,`Gli incrementi crescono di 1; il successivo è +${inc+4}.`,2));
  }
  for(let i=0;i<20;i++){
    const total=80+i*5,pc=[10,15,20,25,30,40,50][i%7],c=total*pc/100;const [o,a]=numOpts(c,Math.max(2,Math.round(c*.2)),300+i);
    out.push(q(`N${id++}`,"numerical",`Il ${pc}% di ${total} corrisponde a:`,o.map(x=>pct(x)),a,`${total} × ${pc}/100 = ${pct(c)}.`,2));
  }
  for(let i=0;i<20;i++){
    const rate=8+(i%6)*2,mins=15+(i%4)*5,c=rate*(mins/5);const [o,a]=numOpts(c,rate,400+i);
    out.push(q(`N${id++}`,"numerical",`Un varco processa ${rate} persone ogni 5 minuti. Allo stesso ritmo, quante ne processa in ${mins} minuti?`,o.map(String),a,`${mins}/5 × ${rate} = ${c}.`,2));
  }
  for(let i=0;i<20;i++){
    const A=100+i*4,B=120+i*3,C=90+i*5;const ra=8+i%7,rb=10+(i*2)%9,rc=6+(i*3)%8;
    const rows=[{n:"A",t:A,r:ra},{n:"B",t:B,r:rb},{n:"C",t:C,r:rc}];
    const best=rows.map(x=>({n:x.n,p:x.r/x.t})).sort((x,y)=>y.p-x.p)[0].n;
    const opts=seededShuffle(["Varco A","Varco B","Varco C","Sono uguali"],500+i);const ans=opts.indexOf(`Varco ${best}`);
    const stem=`<div>Quale varco ha la percentuale più alta di ricontrolli?</div><table class="data-table"><tr><th>Varco</th><th>Controlli</th><th>Ricontrolli</th></tr><tr><td>A</td><td>${A}</td><td>${ra}</td></tr><tr><td>B</td><td>${B}</td><td>${rb}</td></tr><tr><td>C</td><td>${C}</td><td>${rc}</td></tr></table>`;
    out.push(q(`N${id++}`,"numerical",stem,opts,ans,`Confronta ricontrolli/controlli, non i soli valori assoluti. Il rapporto maggiore è del varco ${best}.`,3,"single",true));
  }
  return out;
}

function buildVerbal(){
  const out=[];let id=1;
  const logic=[
    ["Tutti gli addetti autorizzati hanno un badge.","Luca è autorizzato.","Luca ha un badge.","Vero"],
    ["Tutti i bagagli sospetti vengono ricontrollati.","Questa valigia è sospetta.","Questa valigia viene ricontrollata.","Vero"],
    ["Nessun veicolo senza autorizzazione entra nell'area riservata.","Il furgone è entrato.","Il furgone aveva un'autorizzazione.","Vero"],
    ["Tutti gli operatori autorizzati hanno un identificativo.","Marco ha un identificativo.","Marco è certamente autorizzato.","Non determinabile"],
    ["Alcuni addetti lavorano di notte.","Sara è un'addetta.","Sara lavora di notte.","Non determinabile"],
    ["Nessun visitatore senza pass può accedere.","Paolo non ha un pass.","Paolo può accedere come visitatore.","Falso"],
    ["Ogni anomalia rilevata deve essere registrata.","È stata rilevata un'anomalia.","L'anomalia deve essere registrata.","Vero"],
    ["Tutti gli ingressi laterali sono sorvegliati.","Il varco C è sorvegliato.","Il varco C è laterale.","Non determinabile"],
    ["Tutte le procedure critiche richiedono conferma.","Questa procedura non richiede conferma.","Questa procedura non è critica.","Vero"],
    ["Nessun addetto privo di abilitazione usa il dispositivo X.","Anna usa il dispositivo X.","Anna è abilitata.","Vero"],
    ["Alcuni turni durano 8 ore.","Questo turno dura 6 ore.","Questo turno non è uno dei turni da 8 ore.","Vero"],
    ["Tutti gli oggetti vietati vengono segnalati.","Questo oggetto non è stato segnalato.","Questo oggetto non è vietato.","Vero"],
    ["Tutti i controllori sono dipendenti.","Alcuni dipendenti lavorano al T1.","Tutti i controllori lavorano al T1.","Non determinabile"],
    ["Nessun accesso non autorizzato è consentito.","Questo accesso è autorizzato.","Questo accesso è consentito.","Non determinabile"],
    ["Alcune verifiche richiedono due persone.","Questa verifica richiede due persone.","Tutte le verifiche richiedono due persone.","Falso"]
  ];
  for(let r=0;r<3;r++)logic.forEach((x,i)=>{const opts=["Vero","Falso","Non determinabile"];out.push(q(`V${id++}`,"verbal",`${x[0]} ${x[1]} Valuta: “${x[2]}”`,opts,opts.indexOf(x[3]),`Usa soltanto le informazioni date. Risposta: ${x[3]}.`,2,"vfn"));});
  const vocab=[
    ["scrupoloso","accurato",["impulsivo","casuale","superficiale"]],["affidabile","fidato",["incostante","ambiguo","frettoloso"]],["anomalia","irregolarità",["routine","abitudine","permesso"]],["tempestivo","rapido e al momento opportuno",["silenzioso","impreciso","casuale"]],["vigile","attento",["passivo","assente","disordinato"]],["coerente","logicamente uniforme",["contraddittorio","casuale","frettoloso"]],["prioritario","da affrontare prima",["facoltativo","irrilevante","secondario"]],["prudente","cauto",["impulsivo","aggressivo","distratto"]],["conforme","rispettoso della regola",["opposto","nascosto","lento"]],["esaustivo","completo",["vago","parziale","rapido"]],["pertinente","rilevante per il tema",["casuale","inutile","opposto"]],["ambiguo","interpretabile in più modi",["chiaro","obbligatorio","rapido"]],["imparziale","non influenzato da favoritismi",["rigido","frettoloso","incerto"]],["meticoloso","molto preciso",["veloce","socievole","improvvisato"]],["sistematico","ordinato secondo un metodo",["spontaneo","casuale","saltuario"]]
  ];
  vocab.forEach((x,i)=>{const opts=seededShuffle([x[1],...x[2]],700+i);out.push(q(`V${id++}`,"verbal",`Quale significato è più vicino a “${x[0]}”?`,opts,opts.indexOf(x[1]),`Nel contesto, “${x[0]}” significa “${x[1]}”.`,1));});
  const analogies=[
    ["controllo","verifica","sorveglianza","monitoraggio"],["badge","identificazione","chiave","accesso"],["scanner","bagaglio","metal detector","persona"],["aeroporto","volo","stazione","treno"],["vietato","proibito","consentito","permesso"],["rapido","veloce","accurato","preciso"],["errore","correzione","anomalia","verifica"],["giorno","luce","notte","buio"],["procedura","regola","segnalazione","comunicazione"],["prudenza","rischio","precisione","errore"]
  ];
  for(let r=0;r<2;r++)analogies.forEach((x,i)=>{const correct=x[3];const opts=seededShuffle([correct,x[0],x[1],["ritardo","rumore","casuale","vuoto"][i%4]],800+r*100+i);out.push(q(`V${id++}`,"verbal",`${x[0]} sta a ${x[1]} come ${x[2]} sta a...`,opts,opts.indexOf(correct),`La relazione coerente porta a “${correct}”.`,2));});
  const passages=[
    ["Nel turno mattutino il varco A apre prima del varco B. Il varco C apre dopo B. Oggi B ha aperto alle 06:20.","Il varco A ha aperto prima delle 06:20.","Vero"],
    ["Ogni segnalazione classificata come urgente viene presa in carico immediatamente. Alcune segnalazioni non urgenti vengono comunque gestite subito.","Se una segnalazione è stata gestita subito, allora era urgente.","Non determinabile"],
    ["Nel reparto X, chi opera sul dispositivo Y deve avere l'abilitazione Z. Marta non possiede Z.","Marta non può operare sul dispositivo Y.","Vero"],
    ["Tre operatori, Luca, Sara e Paolo, coprono tre postazioni diverse. Luca non è alla postazione 1. Sara è alla postazione 2.","Paolo è certamente alla postazione 1.","Non determinabile"],
    ["Un controllo supplementare viene richiesto quando si verifica almeno una delle condizioni A o B. Nel caso esaminato non si è verificata né A né B.","Il controllo supplementare non è richiesto per quelle due condizioni.","Vero"]
  ];
  for(let r=0;r<4;r++)passages.forEach((x,i)=>{const opts=["Vero","Falso","Non determinabile"];out.push(q(`V${id++}`,"verbal",`<div>${x[0]}</div><div class="sub">Valuta: “${x[1]}”</div>`,opts,opts.indexOf(x[2]),`La risposta corretta è ${x[2]}.`,3,"vfn",true));});
  return out;
}

function mutateChar(s,pos,repl){return s.slice(0,pos)+repl+s.slice(pos+1);}
function buildAttention(){
  const out=[];let id=1;
  const bases=["MXP-48271","SEA-19K73","VRK-582104","AZ7Q92K","T3-64028","SEC-7315A","LMN-20487","QX-918274","BGG-42019","RMP-77106"];
  for(let r=0;r<4;r++)bases.forEach((base,i)=>{
    const chars=[...base],pos=chars.map((c,j)=>/[A-Z0-9]/.test(c)?j:-1).filter(j=>j>=0),p1=pos[(i+r)%pos.length],p2=pos[(i+r+2)%pos.length];
    const repl1=/\d/.test(chars[p1])?String((Number(chars[p1])+3)%10):(chars[p1]==="Z"?"A":String.fromCharCode(chars[p1].charCodeAt(0)+1));
    const repl2=/\d/.test(chars[p2])?String((Number(chars[p2])+7)%10):"X";
    const d1=mutateChar(base,p1,repl1),d2=mutateChar(base,p2,repl2),d3=base.slice(0,-2)+base.slice(-1)+base.slice(-2,-1);const opts=seededShuffle([base,d1,d2,d3],900+r*50+i);
    out.push(q(`A${id++}`,"attention",`Quale codice è IDENTICO a <span class="codes">${base}</span>?`,opts,opts.indexOf(base),`Confronto carattere per carattere: ${base}.`,1+(r>1?1:0),"single",true));
  });
  for(let i=0;i<30;i++){
    const base=`${String.fromCharCode(65+i%20)}${(31+i*7)%100}${String.fromCharCode(75+i%10)}${(13+i*9)%100}`;const same=i%3!==0;let other=base;
    if(!same){const p=1+(i%Math.max(1,base.length-1));other=mutateChar(base,p,/\d/.test(base[p])?String((Number(base[p])+1)%10):"X");}
    const opts=["Uguali","Diversi"];out.push(q(`A${id++}`,"attention",`<div class="codes">${base}<br>${other}</div><div class="sub">Le due stringhe sono uguali o diverse?</div>`,opts,same?0:1,same?"Le stringhe coincidono in ogni carattere.":"C'è almeno un carattere diverso.",2,"same",true));
  }
  for(let i=0;i<30;i++){
    const target=`K${(i*7+14)%90+10}${String.fromCharCode(65+i%20)}${(i*11+7)%90+10}`;const pos=i%8;const items=[];
    for(let k=0;k<8;k++){if(k===pos)items.push(target);else{const p=(k+i)%target.length;items.push(mutateChar(target,p,/\d/.test(target[p])?String((Number(target[p])+k+1)%10):"Q"));}}
    const opts=seededShuffle([pos+1,((pos+1)%8)+1,((pos+3)%8)+1,((pos+5)%8)+1],1000+i);out.push(q(`A${id++}`,"attention",`<div>In quale posizione compare esattamente <span class="codes">${target}</span>?</div><div class="codes">${items.map((x,k)=>`${k+1}) ${x}`).join(" &nbsp; ")}</div>`,opts.map(String),opts.indexOf(pos+1),`Il bersaglio identico è in posizione ${pos+1}.`,3,"single",true));
  }
  const symbols=["▲","●","■","◆","○","△"];
  for(let i=0;i<20;i++){
    const target=symbols[i%symbols.length],arr=Array.from({length:28},(_,k)=>symbols[(k*3+i+(k%4))%symbols.length]);const c=arr.filter(x=>x===target).length;const [o,a]=numOpts(c,1,1100+i);
    out.push(q(`A${id++}`,"attention",`<div>Quante volte compare <b>${target}</b>?</div><div class="codes">${arr.join(" ")}</div>`,o.map(String),a,`Il simbolo ${target} compare ${c} volte.`,2,"single",true));
  }
  return out;
}

function matrixHtml(cells,size=3){return `<div class="matrix ${size===2?"two":""}">${cells.map(x=>`<span class="mcell">${x}</span>`).join("")}</div>`;}
function buildAbstract(){
  const out=[];let id=1;
  const pairs=[["▲","●"],["■","○"],["◆","△"],["●","□"],["⬟","○"]];
  for(let i=0;i<20;i++){const[a,b]=pairs[i%pairs.length],seq=[a,b,a,b,a],c=b;const opts=seededShuffle([c,a,"★","⬤"],1200+i);out.push(q(`R${id++}`,"abstract",`Completa il pattern: ${seq.join("  ")}  ?`,opts,opts.indexOf(c),`I simboli si alternano.`,1));}
  for(let i=0;i<20;i++){const seq=i%2===0?["↑","→","↓","←","↑"]:["↗","↘","↙","↖","↗"],c=seq[1],opts=seededShuffle([c,seq[0],seq[2],"•"],1300+i);out.push(q(`R${id++}`,"abstract",`Una freccia ruota di 90° in senso orario: ${seq.join("  ")}  ?`,opts,opts.indexOf(c),`La rotazione continua di 90°.`,2));}
  for(let i=0;i<20;i++){
    const s=["○","△","□"][i%3],cells=[s,s+s,s+s+s,s+s,s+s+s,s+s+s+s,s+s+s,s+s+s+s,"?"];const c=s.repeat(5),opts=seededShuffle([c,s.repeat(4),s.repeat(6),"●".repeat(5)],1400+i);
    out.push(q(`R${id++}`,"abstract",`<div>Completa la matrice:</div>${matrixHtml(cells)}`,opts,opts.indexOf(c),`Da sinistra a destra aumenta di 1 elemento; anche la terza riga deve terminare con 5 elementi.`,3,"single",true));
  }
  for(let i=0;i<20;i++){
    const a=i%2===0?"○":"●",b=i%2===0?"●":"○";const cells=[a,b,a,b,a,b,a,b,"?"];const c=a,opts=seededShuffle([a,b,"△","■"],1500+i);
    out.push(q(`R${id++}`,"abstract",`<div>Completa la matrice alternata:</div>${matrixHtml(cells)}`,opts,opts.indexOf(c),`La griglia alterna ${a} e ${b}; l'ultima cella deve essere ${c}.`,2,"single",true));
  }
  for(let i=0;i<20;i++){
    const start=2+i%6,seq=[start,start+1,start+3,start+6,start+10],c=start+15;const [o,a]=numOpts(c,3,1600+i);
    out.push(q(`R${id++}`,"abstract",`Quale elemento continua il pattern? ${seq.join(" – ")} – ?`,o.map(String),a,`Gli incrementi sono +1,+2,+3,+4,+5.`,2));
  }
  return out;
}

function buildConcentration(){
  const out=[];let id=1;
  for(let i=0;i<25;i++){const a=7+i,b=2+i%5,c=3+i%4,correct=a+b*c;const [o,ans]=numOpts(correct,3,1700+i);out.push(q(`C${id++}`,"concentration",`Calcola mentalmente: ${a} + ${b} × ${c}`,o.map(String),ans,`Prima la moltiplicazione: ${b}×${c}=${b*c}; poi +${a}=${correct}.`,2));}
  for(let i=0;i<20;i++){const digits=Array.from({length:10},(_,k)=>(i*3+k*2+k%3)%10),c=digits.filter(n=>n%2===0).length;const [o,a]=numOpts(c,1,1800+i);out.push(q(`C${id++}`,"concentration",`Quante cifre PARI ci sono in <span class="codes">${digits.join("")}</span>?`,o.map(String),a,`Le cifre pari sono ${digits.filter(n=>n%2===0).join(", ")}: ${c}.`,1,"single",true));}
  for(let i=0;i<15;i++){
    const nums=Array.from({length:7},(_,k)=>((i+3)*(k+2)*7)%29+1);const evenSum=nums.filter(n=>n%2===0).reduce((a,b)=>a+b,0);const oddCount=nums.filter(n=>n%2===1).length;const askEven=i%2===0,c=askEven?evenSum:oddCount;const [o,a]=numOpts(c,askEven?4:1,1900+i);
    out.push(q(`C${id++}`,"concentration",`${askEven?"Somma solo i numeri pari":"Conta solo i numeri dispari"}: ${nums.join(" · ")}`,o.map(String),a,askEven?`La somma dei pari è ${c}.`:`I numeri dispari sono ${c}.`,3));
  }
  for(let i=0;i<10;i++){
    const arr=Array.from({length:6},(_,k)=>(i*7+k*5+3)%40+1),sorted=[...arr].sort((a,b)=>a-b),c=sorted[2];const [o,a]=numOpts(c,2,2000+i);
    out.push(q(`C${id++}`,"concentration",`Ordina mentalmente i numeri e indica il TERZO più piccolo: ${arr.join(" – ")}`,o.map(String),a,`In ordine: ${sorted.join(", ")}. Il terzo è ${c}.`,3));
  }
  return out;
}

const SJT_SCENARIOS=[
  ["Un passeggero insiste perché rischia di perdere il volo.",[
    "Spieghi brevemente la necessità del controllo e lo completi senza saltare passaggi.",
    "Chiedi subito al responsabile di occuparsi del passeggero mentre tu interrompi il controllo.",
    "Cerchi di accelerare il più possibile mantenendo comunque tutti i passaggi previsti.",
    "Lasci che il passeggero decida se proseguire o rinunciare al controllo."],0,3],
  ["Noti un oggetto che non riconosci durante una verifica.",[
    "Segui la procedura prevista e coinvolgi il supporto competente se necessario.",
    "Chiedi al passeggero di spiegarti cos'è e, se la spiegazione è plausibile, prosegui.",
    "Metti temporaneamente da parte l'oggetto e continui gli altri controlli prima di decidere.",
    "Prendi una decisione autonoma basandoti sull'esperienza personale."],0,3],
  ["La coda aumenta rapidamente e un collega propone di semplificare alcuni passaggi.",[
    "Mantieni gli standard e segnali al responsabile il problema di flusso.",
    "Concordi una distribuzione più efficiente dei compiti senza modificare i controlli previsti.",
    "Riduci temporaneamente i passaggi meno importanti secondo il tuo giudizio.",
    "Continui come prima senza comunicare il problema a nessuno."],0,2],
  ["Un passeggero comprende poco l'italiano.",[
    "Usi frasi brevi, gesti chiari e, se possibile, inglese semplice.",
    "Chiedi a un collega con migliore inglese di aiutarti se la comunicazione resta insufficiente.",
    "Ripeti la stessa frase più lentamente finché comprende.",
    "Fai proseguire il passeggero per evitare di bloccare la fila."],0,3],
  ["Ti accorgi di un errore in una registrazione già effettuata.",[
    "Segnali l'errore e lo correggi secondo la procedura prevista.",
    "Verifichi prima l'impatto dell'errore e poi informi il referente appropriato.",
    "Correggi direttamente il dato senza informare nessuno se sei certo della correzione.",
    "Aspetti il termine del turno per decidere se segnalarlo."],0,3],
  ["Ricevi due indicazioni operative apparentemente in conflitto.",[
    "Verifichi la procedura o chiedi chiarimento alla fonte responsabile prima di agire.",
    "Segui l'indicazione ricevuta più recentemente e poi verifichi.",
    "Scegli quella che ti sembra più prudente basandoti sull'esperienza.",
    "Chiedi a un collega quale delle due preferisce seguire."],0,3],
  ["Un passeggero diventa verbalmente aggressivo ma non minaccioso.",[
    "Mantieni tono professionale, non alimenti il conflitto e segui le procedure previste.",
    "Riduci al minimo la conversazione e chiami subito supporto anche se la situazione è gestibile.",
    "Spieghi con fermezza che il tono è inaccettabile prima di continuare.",
    "Rispondi con maggiore fermezza per ristabilire l'autorità."],0,3],
  ["In un momento tranquillo non ci sono passeggeri al varco.",[
    "Mantieni la vigilanza e prepari la postazione per il flusso successivo.",
    "Usi il tempo per verificare che materiali e postazione siano in ordine.",
    "Ti allontani brevemente senza avvisare perché non c'è attività.",
    "Riduci l'attenzione all'area finché non arriva qualcuno."],0,2],
  ["Un conoscente ti chiede un trattamento di favore.",[
    "Applichi le stesse regole previste per tutti, spiegandolo con cortesia.",
    "Chiedi a un collega di gestirlo per evitare un conflitto personale.",
    "Applichi un controllo più breve purché non elimini i passaggi essenziali.",
    "Fai un'eccezione minima perché conosci la persona."],0,3],
  ["Non hai compreso del tutto un'istruzione del responsabile.",[
    "Chiedi chiarimenti specifici prima di eseguire il passaggio incerto.",
    "Inizi le parti che hai capito e chiarisci solo quando arrivi al punto dubbio.",
    "Chiedi a un collega come interpreta l'istruzione.",
    "Esegui ciò che ritieni più probabile per non rallentare."],0,3],
  ["Un collega nuovo sembra in difficoltà con una procedura.",[
    "Lo supporti nel rispetto dei ruoli e, se serve, coinvolgi chi è responsabile della formazione.",
    "Gli dai un suggerimento rapido senza interrompere il tuo compito principale.",
    "Assumi direttamente il suo compito per evitare errori.",
    "Aspetti che chieda aiuto per non interferire."],0,2],
  ["Devi svolgere per molto tempo un compito ripetitivo.",[
    "Mantieni un ritmo sostenibile e usi le pause previste per preservare attenzione e precisione.",
    "Aumenti la velocità quando ti senti concentrato e la riduci quando sei stanco.",
    "Vari autonomamente il metodo di controllo per evitare monotonia.",
    "Ti distrai brevemente tra un controllo e l'altro per restare sveglio."],0,3],
  ["Noti una situazione insolita ma non sei certo che sia rilevante.",[
    "La valuti rispetto ai criteri/procedure e la segnali se rientra nei casi previsti.",
    "Chiedi discretamente un secondo parere a un collega competente.",
    "Intervieni immediatamente anche senza aver valutato il contesto.",
    "La ignori finché non diventa chiaramente problematica."],0,3],
  ["Un passeggero ti pone una domanda operativa a cui non sai rispondere.",[
    "Dichiari il limite e lo indirizzi alla persona o al punto informativo competente.",
    "Provi a ricostruire la risposta usando le informazioni che ricordi.",
    "Chiedi a un collega disponibile di rispondere.",
    "Dai la risposta più probabile per non farlo aspettare."],0,3],
  ["Ti senti molto affaticato e temi un calo di attenzione.",[
    "Mantieni gli standard e segnali il problema al responsabile se può compromettere l'operatività.",
    "Cerchi di recuperare concentrazione usando le pause previste e monitori il tuo livello di attenzione.",
    "Compensi aumentando la velocità per ridurre il tempo sul compito.",
    "Nascondi il problema per non sembrare poco resistente."],0,3],
  ["Un dispositivo dà un'anomalia intermittente.",[
    "Segui la procedura tecnica prevista e informi il referente competente.",
    "Verifichi se l'anomalia si ripete prima di segnalarla, purché la procedura lo consenta.",
    "Continui a usarlo finché non smette di funzionare del tutto.",
    "Lo riavvii e, se torna normale, non segnali l'episodio."],0,2],
  ["Un collega ti chiede di confermare un'attività che non hai verificato personalmente.",[
    "Non confermi finché non hai effettuato la verifica richiesta.",
    "Chiedi al collega di mostrarti gli elementi necessari e poi confermi.",
    "Confermi se il collega è esperto e affidabile.",
    "Confermi e controlli successivamente."],0,3],
  ["Una procedura è stata aggiornata da poco.",[
    "Applichi la versione aggiornata e chiarisci subito eventuali dubbi.",
    "Tieni a disposizione la versione nuova mentre lavori per consultarla quando serve.",
    "Continui temporaneamente con quella vecchia finché non ti senti sicuro.",
    "Segui il metodo che usa la maggioranza dei colleghi."],0,3],
  ["Hai molte attività contemporaneamente.",[
    "Dai priorità a sicurezza e compiti critici, comunicando eventuali ritardi sulle attività secondarie.",
    "Ordini i compiti per scadenza e poi rivaluti eventuali rischi.",
    "Esegui prima i compiti più rapidi per ridurre il numero di attività aperte.",
    "Passi continuamente da un'attività all'altra per far avanzare tutto."],0,3],
  ["Un passeggero contesta una regola ma resta collaborativo.",[
    "Spieghi in modo breve e neutro ciò che è necessario, quindi prosegui professionalmente.",
    "Offri una spiegazione più dettagliata se non rallenta eccessivamente il flusso.",
    "Cerchi di convincerlo che la regola è giusta prima di proseguire.",
    "Eviti qualsiasi spiegazione per non aprire discussioni."],0,2]
];
function buildSituational(){const out=[];let id=1;for(let r=0;r<3;r++)SJT_SCENARIOS.forEach((s,i)=>{const askLeast=r===1;const opts=seededShuffle(s[1],2100+r*100+i);const target=s[1][askLeast?s[3]:s[2]];out.push(q(`S${id++}`,"situational",`${s[0]} ${askLeast?"Qual è la risposta MENO efficace?":"Qual è la risposta PIÙ efficace?"}`,opts,opts.indexOf(target),askLeast?"La risposta meno efficace tende a ridurre controllo, chiarezza o rispetto della procedura.":"La risposta migliore bilancia procedura, calma, comunicazione e responsabilità.",3,askLeast?"least":"best"));});return out;}

const INBOX_SETS=[
  ["Sono le 06:55. Quale attività affronti per prima?",[
    "Alle 07:00 devi dare un cambio postazione già pianificato.",
    "Hai una segnalazione operativa classificata urgente appena ricevuta.",
    "Un collega ti chiede un chiarimento su una procedura non urgente.",
    "Devi riordinare materiale prima della pausa."],1],
  ["Hai quattro attività aperte. Quale priorità è più appropriata?",[
    "Completare una registrazione amministrativa in scadenza tra due ore.",
    "Gestire un'anomalia che può incidere sulla sicurezza operativa.",
    "Rispondere a una richiesta informativa di routine.",
    "Preparare in anticipo il materiale del turno successivo."],1],
  ["Ricevi contemporaneamente quattro richieste. Da quale inizi?",[
    "Un collega chiede un cambio turno per la settimana prossima.",
    "Un accesso che dovrebbe risultare controllato presenta un'anomalia.",
    "Un passeggero chiede dove si trova un servizio dell'aeroporto.",
    "Devi controllare una comunicazione interna entro fine turno."],1],
  ["Quale attività è più ragionevole delegare o rimandare per prima se sei sovraccarico?",[
    "Una verifica che richiede la tua presenza per procedura.",
    "Una segnalazione urgente ancora non presa in carico.",
    "Un'attività amministrativa non urgente e non critica.",
    "Un chiarimento necessario prima di completare un controllo."],2],
  ["Mancano 10 minuti al cambio turno. Quale scelta è migliore?",[
    "Iniziare un'attività lunga non urgente e lasciare al collega ciò che resta.",
    "Preparare un passaggio di consegne chiaro sulle attività ancora aperte.",
    "Chiudere rapidamente tutte le attività anche riducendo le verifiche.",
    "Evitare di segnalare problemi minori per non rallentare il cambio."],1],
  ["Hai una comunicazione urgente e due compiti routinari. Come organizzi il lavoro?",[
    "Completi prima i compiti routinari per liberare la lista.",
    "Valuti e gestisci prima la comunicazione urgente, poi ripianifichi il resto.",
    "Alterni le tre attività a intervalli brevi.",
    "Aspetti indicazioni senza iniziare nulla."],1]
];
function buildInbox(){const out=[];let id=1;for(let r=0;r<5;r++)INBOX_SETS.forEach((x,i)=>{const opts=seededShuffle(x[1],2300+r*30+i);const target=x[1][x[2]];out.push(q(`I${id++}`,"inbox",x[0],opts,opts.indexOf(target),`La priorità migliore tutela prima urgenza, sicurezza e continuità operativa, poi le attività differibili.`,3,"inbox"));});return out;}

function buildPersonality(){
  const items=[
    "Riesco a mantenere la concentrazione anche durante compiti ripetitivi.","Quando sono sotto pressione, tendo a mantenere un comportamento controllato.","Preferisco avere procedure chiare da seguire.","Mi accorgo facilmente di piccoli errori o dettagli fuori posto.","Se non capisco un'istruzione, chiedo chiarimenti.","Mi trovo a mio agio nel lavorare a contatto con molte persone.","Riesco a rispettare una regola anche quando mi rallenta.","Quando commetto un errore, preferisco segnalarlo e correggerlo.","Mi adatto bene ai cambi di turno e agli orari non regolari.","Riesco a collaborare con colleghi che hanno stili diversi dal mio.","Prima di agire in una situazione ambigua, raccolgo le informazioni necessarie.","Mantengo un tono professionale anche con persone irritate.","Mi piace assumermi responsabilità chiare.","Riesco a restare vigile anche quando l'ambiente è tranquillo.","Evito di improvvisare quando una procedura è importante.","Accetto volentieri feedback sul mio modo di lavorare.","In presenza di molta coda, riesco a non farmi trascinare dalla fretta.","Controllo due volte i dati quando un errore potrebbe avere conseguenze.","Riesco a separare i rapporti personali dalle regole di lavoro.","Sono puntuale e organizzato.","Mi sento a mio agio nel chiedere supporto quando serve.","Riesco a passare da un compito all'altro senza perdere precisione.","Quando una regola cambia, cerco di aggiornarmi subito.","Mantengo la calma quando qualcuno contesta una decisione.","Mi piace lavorare in contesti dove attenzione e responsabilità sono importanti.","Tendo a pianificare prima di agire.","Mi sento responsabile della qualità del mio lavoro.","Riesco a seguire istruzioni dettagliate senza saltare passaggi.","Quando sono stanco, riconosco se la mia attenzione sta calando.","Preferisco comunicare in modo chiaro e sintetico.","Mi è facile ammettere quando non so qualcosa.","Mi sento a mio agio con attività molto strutturate.","Riesco a mantenere precisione anche quando devo essere rapido.","In caso di dubbio preferisco verificare piuttosto che supporre.","Mi impegno a rispettare gli stessi standard con tutte le persone.","Mi adatto bene a lavorare in squadra.","Riesco a rimanere concentrato in ambienti con molte distrazioni.","Quando ricevo più richieste, stabilisco delle priorità.","Tendo a controllare il mio lavoro prima di considerarlo concluso.","Mantengo la riservatezza sulle informazioni di lavoro."
  ];return items.map((s,i)=>q(`P${i+1}`,"personality",s,SCALE,null,"Non esiste una risposta corretta. Rispondi in modo sincero e coerente, senza cercare un profilo 'perfetto'.",1,"scale"));
}


const BANK=[...buildAttention(),...buildAbstract(),...buildNumerical(),...buildVerbal(),...buildConcentration(),...buildSituational(),...buildInbox(),...buildPersonality()];
// Counts: 120 + 100 + 100 + 100 + 70 + 60 + 30 + 40 = 620
const CORE_CATS=["attention","abstract","numerical","verbal","concentration","situational","inbox"];
const ASSESSMENT_SECTIONS=[
  {cat:"attention",label:"Attenzione percettiva",count:25,seconds:8*60},
  {cat:"abstract",label:"Ragionamento astratto",count:20,seconds:12*60},
  {cat:"numerical",label:"Ragionamento numerico",count:15,seconds:10*60},
  {cat:"verbal",label:"Ragionamento verbale",count:15,seconds:10*60},
  {cat:"concentration",label:"Concentrazione",count:10,seconds:6*60},
  {cat:"situational",label:"SJT Security",count:10,seconds:9*60},
  {cat:"inbox",label:"In-basket / priorità",count:5,seconds:5*60}
];

if(typeof document==="undefined"){console.log(JSON.stringify({bank:BANK.length,byCategory:Object.fromEntries(Object.keys(META).map(k=>[k,BANK.filter(q=>q.cat===k).length])),assessment:ASSESSMENT_SECTIONS.reduce((a,s)=>a+s.count,0),minutes:ASSESSMENT_SECTIONS.reduce((a,s)=>a+s.seconds,0)/60},null,2));return;}

const el=id=>document.getElementById(id);
const E={home:el("home"),quiz:el("quiz"),results:el("results"),custom:el("customSetup"),catChooser:el("categoryChooser"),count:el("countSelect"),time:el("timeSelect"),startCustom:el("startCustom"),resume:el("resumeBtn"),progressLabel:el("progressLabel"),sectionLabel:el("sectionLabel"),progressBar:el("progressBar"),categoryPill:el("categoryPill"),timer:el("timer"),qIndex:el("qIndex"),difficulty:el("difficulty"),stem:el("questionStem"),answers:el("answers"),feedback:el("feedback"),prev:el("prevBtn"),flag:el("flagBtn"),next:el("nextBtn"),navigator:el("navigator"),answeredLabel:el("answeredLabel"),finish:el("finishBtn"),resultTitle:el("resultTitle"),resultText:el("resultText"),resultWarning:el("resultWarning"),scorePct:el("scorePct"),scoreRaw:el("scoreRaw"),areaScores:el("areaScores"),indicators:el("indicators"),reviewFilter:el("reviewFilter"),review:el("review"),retryWrong:el("retryWrong"),newSession:el("newSession"),resetStats:el("resetStats"),statSessions:el("statSessions"),statBest:el("statBest"),statAvg:el("statAvg"),statLast:el("statLast")};
let state={mode:null,questions:[],answers:{},flagged:{},current:0,sections:null,sectionIndex:0,sectionRemaining:0,totalRemaining:0,duration:0,startedAt:null,completed:false};let tick=null;

function renderCats(){E.catChooser.innerHTML=CORE_CATS.map(k=>`<label class="cat-check"><input type="checkbox" value="${k}" checked><span><b>${META[k].label}</b><small>${META[k].desc}</small></span></label>`).join("");}
function stats(){try{return JSON.parse(localStorage.getItem("securityAssessmentStatsV3"))||{sessions:0,scores:[]}}catch{return{sessions:0,scores:[]}}}
function renderStats(){const s=stats(),scores=s.scores||[];E.statSessions.textContent=s.sessions||0;E.statBest.textContent=scores.length?`${Math.max(...scores)}%`:"—";E.statAvg.textContent=scores.length?`${Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}%`:"—";E.statLast.textContent=scores.length?`${scores.at(-1)}%`:"—";}
function saveStats(p){const s=stats();s.sessions=(s.sessions||0)+1;s.scores=[...(s.scores||[]),p].slice(-30);localStorage.setItem("securityAssessmentStatsV3",JSON.stringify(s));renderStats();}
function saveSession(){if(state.completed||!state.questions.length){localStorage.removeItem("securityAssessmentSessionV3");return;}localStorage.setItem("securityAssessmentSessionV3",JSON.stringify({...state,version:VERSION}));E.resume.classList.remove("hidden");}
function loadResume(){try{const s=JSON.parse(localStorage.getItem("securityAssessmentSessionV3"));if(s&&s.version===VERSION&&!s.completed){state=s;E.resume.classList.remove("hidden");}}catch{localStorage.removeItem("securityAssessmentSessionV3");}}

function pick(cat,count,seed){return seededShuffle(BANK.filter(x=>x.cat===cat),seed).slice(0,count);}
function startAssessment(){const qs=[],sections=[];let cursor=0;ASSESSMENT_SECTIONS.forEach((s,i)=>{const chosen=pick(s.cat,s.count,Date.now()+i*997);const indexes=chosen.map((_,k)=>cursor+k);qs.push(...chosen);sections.push({...s,indexes});cursor+=chosen.length;});state={mode:"assessment",questions:qs,answers:{},flagged:{},current:0,sections,sectionIndex:0,sectionRemaining:sections[0].seconds,totalRemaining:3600,duration:3600,startedAt:Date.now(),completed:false};showQuiz();startTimer();saveSession();}
function startSpecial(mode){const cat="personality",count=40,seconds=12*60;state={mode:"personality",questions:seededShuffle(BANK.filter(x=>x.cat===cat),Date.now()).slice(0,count),answers:{},flagged:{},current:0,sections:null,sectionIndex:0,sectionRemaining:0,totalRemaining:seconds,duration:seconds,startedAt:Date.now(),completed:false};showQuiz();startTimer();saveSession();}
function startCustom(mode,forced=null){const cats=[...E.catChooser.querySelectorAll("input:checked")].map(x=>x.value);if(!forced&&!cats.length){alert("Seleziona almeno una categoria.");return;}let pool=forced?[...forced]:BANK.filter(x=>cats.includes(x.cat));pool=seededShuffle(pool,Date.now());const n=forced?pool.length:Math.min(Number(E.count.value),pool.length),seconds=Number(E.time.value)*60;state={mode,questions:pool.slice(0,n),answers:{},flagged:{},current:0,sections:null,sectionIndex:0,sectionRemaining:0,totalRemaining:seconds,duration:seconds,startedAt:Date.now(),completed:false};showQuiz();startTimer();saveSession();}
function showQuiz(){E.home.classList.add("hidden");E.results.classList.add("hidden");E.quiz.classList.remove("hidden");renderQuestion();}
function curSection(){return state.sections?state.sections[state.sectionIndex]:null;}
function allowed(i){return !state.sections||curSection().indexes.includes(i);}
function renderStem(question){if(question.html)E.stem.innerHTML=question.stem;else E.stem.textContent=question.stem;}
function renderQuestion(){const question=state.questions[state.current];if(!question)return;E.progressLabel.textContent=`${state.current+1} / ${state.questions.length}`;E.progressBar.style.width=`${(state.current+1)/state.questions.length*100}%`;E.sectionLabel.textContent=state.sections?`Sezione ${state.sectionIndex+1}/${state.sections.length} • ${curSection().label}`:"";E.categoryPill.textContent=META[question.cat].label;E.qIndex.textContent=`Quesito ${state.current+1}`;E.difficulty.textContent=question.answer==null?"Non punteggiato":`Difficoltà ${"●".repeat(question.diff)}${"○".repeat(3-question.diff)}`;renderStem(question);const selected=state.answers[state.current];E.answers.className=question.type==="scale"?"answers scale-answers":"answers";E.answers.innerHTML=question.options.map((opt,i)=>{let cls="answer";if(selected===i)cls+=" selected";if(state.mode==="practice"&&selected!=null&&question.answer!=null){if(i===question.answer)cls+=" correct";if(i===selected&&selected!==question.answer)cls+=" wrong";}return`<button class="${cls}" data-i="${i}"><span class="aletter">${question.type==="scale"?i+1:LETTERS[i]}</span><span>${esc(opt)}</span></button>`;}).join("");E.answers.querySelectorAll("button").forEach(b=>b.onclick=()=>{state.answers[state.current]=Number(b.dataset.i);renderQuestion();});if(state.mode==="practice"&&selected!=null){if(question.answer==null){E.feedback.className="feedback ok";E.feedback.textContent=question.explanation;}else{const ok=selected===question.answer;E.feedback.className=`feedback ${ok?"ok":"no"}`;E.feedback.innerHTML=`<b>${ok?"Corretto.":"Non corretto."}</b> ${question.explanation}`;}}else E.feedback.className="feedback hidden";E.prev.disabled=state.current===0||(state.sections&&!allowed(state.current-1));E.flag.textContent=state.flagged[state.current]?"⚑ Segnata":"⚑ Segna";E.next.textContent=state.current===state.questions.length-1?"Vai alla fine →":"Avanti →";E.answeredLabel.textContent=`${Object.keys(state.answers).length} risposte`;renderNav();updateTimer();saveSession();}
function renderNav(){E.navigator.innerHTML=state.questions.map((_,i)=>{const cls=["navq"];if(state.answers[i]!=null)cls.push("answered");if(state.flagged[i])cls.push("flagged");if(i===state.current)cls.push("current");return`<button class="${cls.join(" ")}" data-i="${i}" ${allowed(i)?"":"disabled"}>${i+1}</button>`;}).join("");E.navigator.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(!b.disabled){state.current=Number(b.dataset.i);renderQuestion();}});}
function startTimer(){clearInterval(tick);if(!state.duration){E.timer.textContent="∞";return;}tick=setInterval(()=>{if(state.mode==="assessment"){state.sectionRemaining=Math.max(0,state.sectionRemaining-1);state.totalRemaining=Math.max(0,state.totalRemaining-1);if(state.sectionRemaining===0){advanceSection(true);return;}}else{state.totalRemaining=Math.max(0,state.totalRemaining-1);if(state.totalRemaining===0){finish(true);return;}}updateTimer();if((state.mode==="assessment"?state.sectionRemaining:state.totalRemaining)%10===0)saveSession();},1000);updateTimer();}
function updateTimer(){const sec=state.mode==="assessment"?state.sectionRemaining:state.totalRemaining;if(!state.duration){E.timer.textContent="∞";E.timer.className="";return;}const total=state.mode==="assessment"?curSection().seconds:state.duration;E.timer.textContent=`${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;const ratio=sec/total;E.timer.className=ratio<=.1?"danger":ratio<=.25?"warn":"";}
function advanceSection(auto=false){if(!state.sections)return;if(state.sectionIndex>=state.sections.length-1){finish(true);return;}state.sectionIndex++;const s=curSection();state.sectionRemaining=s.seconds;state.current=s.indexes[0];renderQuestion();}
function next(){if(state.sections){const s=curSection(),p=s.indexes.indexOf(state.current);if(p<s.indexes.length-1){state.current=s.indexes[p+1];renderQuestion();}else advanceSection(false);}else if(state.current<state.questions.length-1){state.current++;renderQuestion();}else finish(false);}
function prev(){if(state.current>0&&allowed(state.current-1)){state.current--;renderQuestion();}}
function score(){let correct=0,scored=0;const by={};state.questions.forEach((x,i)=>{if(!by[x.cat])by[x.cat]={correct:0,scored:0,total:0,answered:0};const b=by[x.cat];b.total++;if(state.answers[i]!=null)b.answered++;if(x.answer!=null){scored++;b.scored++;if(state.answers[i]===x.answer){correct++;b.correct++;}}});return{correct,scored,by};}
function finish(forced=false){if(state.completed)return;const unanswered=state.questions.length-Object.keys(state.answers).length;if(!forced&&unanswered>0&&!confirm(`Hai ${unanswered} domande senza risposta. Terminare comunque?`))return;clearInterval(tick);state.completed=true;localStorage.removeItem("securityAssessmentSessionV3");showResults(forced);}
function showResults(forced){E.quiz.classList.add("hidden");E.home.classList.add("hidden");E.results.classList.remove("hidden");const s=score(),p=s.scored?Math.round(s.correct/s.scored*100):0,answered=Object.keys(state.answers).length,unanswered=state.questions.length-answered,flagged=Object.values(state.flagged).filter(Boolean).length;E.scorePct.textContent=s.scored?`${p}%`:"—";E.scoreRaw.textContent=s.scored?`${s.correct} / ${s.scored}`:"non punteggiato";if(!s.scored)E.resultTitle.textContent="Questionario completato";else if(p>=85)E.resultTitle.textContent="Prestazione molto forte";else if(p>=70)E.resultTitle.textContent="Buona prestazione";else if(p>=55)E.resultTitle.textContent="Base discreta da consolidare";else E.resultTitle.textContent="Serve altro allenamento";E.resultText.textContent=s.scored?`Corrette ${s.correct} su ${s.scored} domande valutabili. ${unanswered?`Non risposte: ${unanswered}.`:"Hai risposto a tutti i quesiti."}`:`Hai compilato ${answered} item su ${state.questions.length}. Il questionario comportamentale non produce un punteggio di idoneità.`;E.resultWarning.textContent="Il risultato è esclusivamente didattico e non corrisponde a soglie, profili o criteri reali usati da Adecco/SEA.";E.areaScores.innerHTML=Object.entries(s.by).map(([k,b])=>{if(!b.scored){const pc=Math.round(b.answered/b.total*100);return`<div class="area"><div class="area-head"><span>${META[k].label}</span><b>${b.answered}/${b.total} compilate</b></div><div class="bar"><i style="width:${pc}%"></i></div></div>`;}const pc=Math.round(b.correct/b.scored*100);return`<div class="area"><div class="area-head"><span>${META[k].label}</span><b>${pc}% (${b.correct}/${b.scored})</b></div><div class="bar"><i style="width:${pc}%"></i></div></div>`;}).join("");const elapsed=Math.round((Date.now()-state.startedAt)/1000);E.indicators.innerHTML=`<div class="indicator"><span>Risposte</span><b>${answered}/${state.questions.length}</b></div><div class="indicator"><span>Non risposte</span><b>${unanswered}</b></div><div class="indicator"><span>Segnate</span><b>${flagged}</b></div><div class="indicator"><span>Tempo trascorso</span><b>${Math.floor(elapsed/60)}m ${elapsed%60}s</b></div><div class="indicator"><span>Modalità</span><b>${state.mode}</b></div>`;if(s.scored)saveStats(p);renderReview();window.scrollTo({top:0,behavior:"smooth"});}
function renderReview(){const f=E.reviewFilter.value;E.review.innerHTML=state.questions.map((x,i)=>{const g=state.answers[i],wrong=x.answer!=null&&g!=null&&g!==x.answer,un=g==null,flag=!!state.flagged[i];if(!(f==="all"||(f==="wrong"&&wrong)||(f==="unanswered"&&un)||(f==="flagged"&&flag)))return"";if(x.answer==null)return`<article class="review-item"><b>${i+1}. ${esc(x.stem)}</b><p>Tua risposta: ${un?"—":`${g+1}/5 — ${esc(x.options[g])}`}</p><p>${x.explanation}</p></article>`;return`<article class="review-item"><b>${i+1}. ${x.html?x.stem:esc(x.stem)}</b><p class="${wrong||un?"bad":"good"}">Tua risposta: ${un?"—":`${LETTERS[g]}) ${esc(x.options[g])}`}</p><p class="good">Corretta: ${LETTERS[x.answer]}) ${esc(x.options[x.answer])}</p><p>${x.explanation}</p></article>`;}).join("")||`<p class="small">Nessun elemento per questo filtro.</p>`;}
function resetHome(){clearInterval(tick);state={mode:null,questions:[],answers:{},flagged:{},current:0,sections:null,sectionIndex:0,sectionRemaining:0,totalRemaining:0,duration:0,startedAt:null,completed:false};localStorage.removeItem("securityAssessmentSessionV3");E.quiz.classList.add("hidden");E.results.classList.add("hidden");E.home.classList.remove("hidden");E.custom.classList.add("hidden");E.resume.classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"});}

renderCats();renderStats();loadResume();
document.querySelectorAll(".mode-card").forEach(b=>b.onclick=()=>{const m=b.dataset.mode;if(m==="assessment")startAssessment();else if(m==="personality"||m==="english")startSpecial(m);else{state.mode=m;E.custom.classList.remove("hidden");E.startCustom.dataset.mode=m;E.custom.scrollIntoView({behavior:"smooth",block:"center"});}});
E.startCustom.onclick=()=>startCustom(E.startCustom.dataset.mode||"practice");E.resume.onclick=()=>{showQuiz();startTimer();};E.prev.onclick=prev;E.next.onclick=next;E.flag.onclick=()=>{state.flagged[state.current]=!state.flagged[state.current];renderQuestion();};E.finish.onclick=()=>finish(false);E.reviewFilter.onchange=renderReview;E.newSession.onclick=resetHome;E.retryWrong.onclick=()=>{const wrong=state.questions.filter((x,i)=>x.answer!=null&&state.answers[i]!==x.answer);if(!wrong.length){alert("Nessun errore da ripetere.");return;}resetHome();startCustom("practice",wrong);};E.resetStats.onclick=()=>{if(confirm("Azzerare le statistiche salvate?")){localStorage.removeItem("securityAssessmentStatsV3");renderStats();}};window.addEventListener("beforeunload",()=>{if(!state.completed)saveSession();});
})();
