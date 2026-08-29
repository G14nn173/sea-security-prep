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

// diff is an editorial estimate of cognitive load: 1=easy, 2=medium, 3=hard.
function q(id,cat,stem,options,answer,explanation,diff=2,type="single",html=false,family=null,mechanism=null){return{id,cat,stem,options,answer,explanation,diff,type,html,family:family||cat,mechanism};}
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
    ["Alcune verifiche richiedono due persone.","Questa verifica richiede due persone.","Tutte le verifiche richiedono due persone.","Non determinabile","Sapere che alcune verifiche richiedono due persone non permette di concludere che ciò valga per tutte."]
  ];
  for(let r=0;r<3;r++)logic.forEach((x,i)=>{const opts=["Vero","Falso","Non determinabile"];out.push(q(`V${id++}`,"verbal",`${x[0]} ${x[1]} Valuta: “${x[2]}”`,opts,opts.indexOf(x[3]),x[4]||`Usa soltanto le informazioni date. Risposta: ${x[3]}.`,2,"vfn",false,"true_false_nd"));});
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
  const deductionVariants=[
    [passages[3][0],passages[3][1],"Vero","Sara occupa la postazione 2; Luca non può occupare la 1, quindi occupa la 3 e a Paolo resta la 1."],
    ["Tre ispezioni, Alfa, Beta e Gamma, si svolgono una dopo l'altra. Beta precede Alfa e Alfa precede Gamma.","Beta è la prima ispezione.","Vero","Dai due vincoli segue l'ordine Beta, Alfa, Gamma; Beta è quindi necessariamente la prima."],
    ["Tutti gli addetti del gruppo X hanno l'abilitazione Y. Nessuna persona con abilitazione Y può svolgere il compito Z. Marta appartiene al gruppo X.","Marta non può svolgere il compito Z.","Vero","Marta appartiene a X, quindi possiede Y; poiché nessuna persona con Y può svolgere Z, Marta non può svolgerlo."],
    ["In un turno vengono distribuite 12 verifiche fra tre squadre. La squadra Nord ne riceve 5 e la squadra Sud 3; tutte le restanti vanno alla squadra Est.","La squadra Est riceve 4 verifiche.","Vero","Dalle 12 verifiche si sottraggono le 5 assegnate a Nord e le 3 assegnate a Sud: ne restano 4 per Est."]
  ];
  for(let r=0;r<4;r++)passages.forEach((x,i)=>{const item=i===3?deductionVariants[r]:[x[0],x[1],x[2],`La risposta corretta è ${x[2]}.`];const opts=["Vero","Falso","Non determinabile"];out.push(q(`V${id++}`,"verbal",`<div>${item[0]}</div><div class="sub">Valuta: “${item[1]}”</div>`,opts,opts.indexOf(item[2]),item[3],3,"vfn",true,i===3?"deduction":"passage_inference"));});
  return out;
}

function mutateChar(s,pos,repl){return s.slice(0,pos)+repl+s.slice(pos+1);}
function positionedOpts(correct,distractors,position){const pool=[...new Set(distractors.filter(x=>x!==correct))];while(pool.length<3)pool.push(`Alternativa ${pool.length+1}`);const opts=pool.slice(0,3);opts.splice(position,0,correct);return[opts,position];}
const ATTENTION_ANSWER_PLAN=seededShuffle(Array.from({length:120},(_,i)=>i%4),1000);
const CONCENTRATION_ANSWER_PLAN=seededShuffle(Array.from({length:70},(_,i)=>i%4),314159);
function applySemanticRewrites(out,rows,cat,plan){rows.forEach(r=>{const[id,family,mechanism,_diff,stem,correct,wrong,explanation,html=true]=r,n=Number(id.slice(1)),diff=cat==="attention"?(n<=30?1:n<=90?2:3):(n<=17?1:n<=53?2:3),[options,answer]=positionedOpts(String(correct),wrong.map(String),plan[n-1]);out[n-1]=q(id,cat,stem,options,answer,explanation,diff,"single",html,family,mechanism);});}
const ATTENTION_SEMANTIC_REWRITES=[
  ["A1","code_compare","separator_agnostic",1,"Ignorando trattini e spazi, quale codice equivale a AB-47 9Q?","AB479Q",["AB749Q","AB479O","A8479Q"],"Rimossi i separatori, il riferimento diventa AB479Q; ordine e caratteri restano invariati.",false],
  ["A2","code_compare","segment_alignment",2,"Riferimento MN | 483 | TX. In quale alternativa è cambiato soltanto il segmento centrale?","MN | 438 | TX",["NM | 483 | TX","MN | 483 | XT","NM | 438 | TX"],"Solo MN | 438 | TX conserva primo e terzo segmento modificando esclusivamente quello centrale.",false],
  ["A3","code_compare","dual_pair_check",2,"Quale alternativa contiene due confronti entrambi esatti?","K72-P9 = K72-P9; R41-X6 = R41-X6",["K72-P9 = K27-P9; R41-X6 = R41-X6","K72-P9 = K72-P9; R41-X6 = R14-X6","K72-P9 = K72-P6; R41-X6 = R41-X9"],"Nella risposta corretta entrambe le coppie coincidono; i distrattori contengono una trasposizione o sostituzione.",false],
  ["A4","code_compare","divergence_location",2,"Confronta PX-614-QT con PX-641-QT. In quale segmento si trova la divergenza?","Segmento numerico centrale",["Prefisso alfabetico","Suffisso alfabetico","Separatore"],"Prefisso, suffisso e separatori coincidono; nel segmento centrale 614 diventa 641.",false],
  ["A5","code_compare","reconstruct_fields",3,"Campi verificati: prefisso ZR, numero 508, suffisso LK. Quale codice li ricostruisce nello stesso ordine?","ZR-508-LK",["ZR-580-LK","LK-508-ZR","ZR-508-KL"],"La ricostruzione mantiene sequenza dei campi e ordine interno: ZR, 508, LK.",false],
  ["A16","mismatch_detection","unique_equal_pair",1,"Quale coppia è l'unica perfettamente uguale?","T48-K2 / T48-K2",["M71-Q5 / M17-Q5","P30-X8 / P30-XB","R62-L4 / R62-4L"],"Solo T48-K2 è ripetuto senza inversioni, sostituzioni o cambi d'ordine.",false],
  ["A17","mismatch_detection","omission_detection",2,"Quale secondo codice omette un carattere rispetto al primo, senza sostituirne altri?","AB739Q / AB73Q",["KL820R / KL802R","MN461T / MN461X","PX507S / PX5507S"],"AB73Q deriva da AB739Q eliminando soltanto il 9; gli altri casi sono inversione, sostituzione o duplicazione.",false],
  ["A18","mismatch_detection","duplication_detection",2,"Individua la coppia in cui il secondo codice contiene una duplicazione.","TR508K / TR5508K",["LM274Q / LM247Q","NX630P / NX63P","BD491R / BD492R"],"TR5508K duplica il 5; gli altri distrattori mostrano inversione, omissione o sostituzione.",false],
  ["A19","mismatch_detection","error_type_classification",3,"Riferimento QP-7318. La variante QP-7138 contiene quale errore?","Trasposizione di 3 e 1",["Omissione del 3","Duplicazione del 1","Sostituzione del 7"],"Tutti i caratteri restano presenti, ma 3 e 1 scambiano posizione.",false],
  ["A20","mismatch_detection","field_inconsistency",3,"Registro: codice LX-42, zona Est, turno 08. Quale riga ha un solo campo incoerente?","LX-42 | Ovest | 08",["LX-24 | Ovest | 09","LX-42 | Est | 08","LX-24 | Est | 09"],"La riga scelta conserva codice e turno ma cambia soltanto la zona.",false],
  ["A31","selective_search","dual_attribute_target",2,"Quale elemento ha prefisso K, numero pari e suffisso Q?","K-48-Q",["K-47-Q","M-48-Q","K-48-R"],"K-48-Q soddisfa insieme prefisso, parità e suffisso; ogni distrattore fallisce un criterio.",false],
  ["A32","selective_search","target_after_position",2,"Serie: A7, K4, M8, K6, K2, P4. Qual è il primo K con numero pari dopo la terza posizione?","K6",["K4","K2","P4"],"La scansione parte dopo M8: K6 è il primo elemento che soddisfa lettera e parità.",false],
  ["A33","selective_search","count_with_exclusion",3,"Elementi: A-14, B-15, A-18, A-21, C-24, A-30. Quanti iniziano per A, sono pari, ma non multipli di 3?","1",["2","3","4"],"A-18 e A-30 sono multipli di 3, mentre A-21 è dispari: resta soltanto A-14.",false],
  ["A34","selective_search","unique_frequency",2,"Lista: TR4, MX7, TR4, QP2, MX7, LK9. Quale codice compare una sola volta ed è seguito da un codice già visto?","QP2",["TR4","MX7","LK9"],"QP2 compare una sola volta e il successivo MX7 era già apparso; LK9 non ha un elemento successivo.",false],
  ["A35","selective_search","internal_pattern",3,"Quale codice contiene esattamente una coppia di cifre consecutive crescenti e nessun carattere ripetuto?","K-347-Q",["K-344-Q","K-531-Q","K-122-Q"],"347 contiene la sola coppia crescente 3-4 e non ripete caratteri; gli altri falliscono almeno un vincolo.",false],
  ["A46","symbol_count","position_limited",2,"Serie: ▲ ○ ▲ ■ ▲ ○ ■ ▲. Quanti ▲ occupano una posizione pari?","1",["2","3","4"],"Le posizioni pari sono 2,4,6,8; soltanto la posizione 8 contiene ▲.",false],
  ["A47","symbol_count","count_difference",2,"Blocco A: ● ○ ● ● ○. Blocco B: ● ○ ○ ● ○. Di quanto il numero di ● in A supera quello in B?","1",["0","2","3"],"A contiene tre ● e B due: la differenza è 1.",false],
  ["A48","symbol_count","exclude_adjacent",3,"Serie: ▲ ● ▲ ▲ ○ ▲ ■ ▲. Conta i ▲ che NON sono adiacenti a un altro ▲.","3",["2","4","5"],"Sono isolati i ▲ alle posizioni 1, 6 e 8; quelli centrali formano una coppia adiacente.",false],
  ["A49","symbol_count","after_trigger",2,"Serie: ▲ ■ ● ■ ▲ ● ▲. Conta i ▲ soltanto dopo il primo ■.","2",["1","3","4"],"Dopo il primo ■ restano i ▲ alle posizioni 5 e 7; quello iniziale va escluso.",false],
  ["A50","symbol_count","pair_count",3,"Serie: ● ▲ ● ▲ ▲ ● ▲ ●. Quante coppie adiacenti ●▲ compaiono senza sovrapporre elementi?","3",["2","4","1"],"Le coppie ●▲ iniziano alle posizioni 1, 3 e 6; nessuna usa due volte lo stesso elemento.",false],
  ["A61","multi_field_match","two_of_three_fields",2,"Riferimento: K7 | Nord | 08. Quale record coincide esattamente in due campi?","K7 | Sud | 08",["K7 | Nord | 08","K8 | Sud | 09","K8 | Nord | 09"],"K7 | Sud | 08 coincide in codice e orario, ma non nella zona.",false],
  ["A62","multi_field_match","cross_source_match",3,"Elenco codici: A4=Est, B7=Nord. Elenco turni: Est=06, Nord=09. Quale record ricostruito è corretto?","B7 | Nord | 09",["B7 | Est | 09","A4 | Nord | 06","A4 | Est | 09"],"B7 rimanda a Nord e Nord al turno 09; servono due corrispondenze successive.",false],
  ["A63","multi_field_match","derived_field",3,"Regola: priorità = numero del codice mod 3. Quale record è coerente?","X-14 | priorità 2",["X-14 | priorità 1","X-15 | priorità 2","X-16 | priorità 0"],"14 diviso 3 lascia resto 2; gli altri abbinamenti non rispettano la regola dichiarata.",false],
  ["A64","multi_field_match","all_constraints",3,"Trova il record con codice che termina in 4, zona Est e orario precedente alle 09.","Q24 | Est | 08",["Q24 | Est | 10","Q23 | Est | 08","Q24 | Nord | 08"],"Solo Q24 | Est | 08 soddisfa simultaneamente suffisso, zona e limite orario.",false],
  ["A65","multi_field_match","compact_table_lookup",2,"Tabella: R1→K8/Nord; R2→M3/Est; R3→P6/Sud. Quale riga corrisponde a M3 e Est?","R2",["R1","R3","Nessuna riga"],"La seconda riga contiene contemporaneamente M3 ed Est.",false],
  ["A76","transposition_detection","segment_swap",2,"Riferimento AB-47-QX. Quale variante inverte soltanto il primo e il terzo segmento?","QX-47-AB",["AB-74-QX","BA-47-QX","QX-74-AB"],"QX-47-AB scambia i segmenti esterni lasciando invariato 47.",false],
  ["A77","transposition_detection","digit_pair_reversal",2,"Quale variante di K-3816 contiene una sola coppia di cifre invertita?","K-3861",["K-8316","K-381","K-3817"],"K-3861 inverte soltanto la coppia finale 16; gli altri alterano struttura o valore.",false],
  ["A78","transposition_detection","locate_swap",3,"Da LM-527-Q a LM-257-Q: quali posizioni del segmento numerico sono state scambiate?","Prima e seconda",["Seconda e terza","Prima e terza","Nessuna: è una sostituzione"],"527 diventa 257 scambiando 5 e 2, cioè prima e seconda posizione.",false],
  ["A79","transposition_detection","swap_plus_substitution",3,"Riferimento TR-468-P. Quale variante contiene una trasposizione e anche una sostituzione?","TR-648-Q",["TR-648-P","TR-469-P","TR-468-Q"],"648 scambia 4 e 6, mentre Q sostituisce P: sono presenti entrambi gli errori.",false],
  ["A80","transposition_detection","distinguish_omission",2,"Quale trasformazione è un'inversione e non un'omissione?","AB729 → AB792",["AB729 → AB72","AB729 → A729","AB729 → AB7299"],"AB792 conserva tutti i caratteri scambiando 2 e 9; gli altri eliminano o duplicano.",false],
  ["A91","consistency_check","list_total",2,"Elenco quantità: 4, 7, 3, 6. Quale totale dichiarato è coerente?","20",["18","19","21"],"La somma 4+7+3+6 è 20; gli altri totali derivano da omissioni o errori di uno.",false],
  ["A92","consistency_check","category_rule",2,"Regola: codici A–M = gruppo 1; N–Z = gruppo 2. Quale associazione è coerente?","R7 | gruppo 2",["B4 | gruppo 2","M8 | gruppo 2","Z3 | gruppo 1"],"R appartiene all'intervallo N–Z e quindi al gruppo 2.",false],
  ["A93","consistency_check","two_source_crosscheck",3,"Fonte 1: K4 assegnato a Est. Fonte 2: Est opera alle 07. Quale riepilogo è coerente?","K4 | Est | 07",["K4 | Nord | 07","K4 | Est | 09","K7 | Est | 07"],"Il riepilogo corretto conserva l'assegnazione K4→Est e l'orario Est→07.",false],
  ["A94","consistency_check","temporal_order",3,"Eventi dichiarati: B dopo A; C prima di B; A prima di C. Quale ordine è coerente?","A, C, B",["C, A, B","A, B, C","B, C, A"],"A precede C e C precede B, rispettando anche il vincolo B dopo A.",false],
  ["A95","consistency_check","row_checksum",3,"Regola di riga: totale = validi + esclusi. Quale riga è coerente?","12 | 9 validi | 3 esclusi",["12 | 8 validi | 3 esclusi","15 | 11 validi | 5 esclusi","10 | 6 validi | 3 esclusi"],"Solo 9+3 restituisce il totale dichiarato 12.",false],
  ["A106","exception_detection","unique_duplicate",2,"Sequenza: K4, M7, P2, M7, R9. Qual è l'unico elemento duplicato?","M7",["K4","P2","R9"],"M7 compare due volte; tutti gli altri una sola volta.",false],
  ["A107","exception_detection","sequence_exception",2,"Regola: i numeri aumentano di 3. Quale elemento rompe 4, 7, 10, 14, 16?","14",["7","10","16"],"Dopo 10 dovrebbe comparire 13; 14 è l'unico punto incompatibile con l'incremento costante.",false],
  ["A108","exception_detection","impossible_combination",3,"Vincoli: zona Nord usa codici N; zona Sud usa codici S. Quale combinazione è impossibile?","N-42 | Sud",["N-31 | Nord","S-18 | Sud","S-27 | Sud"],"N-42 ha prefisso Nord ma attributo Sud, violando la corrispondenza dichiarata.",false],
  ["A109","exception_detection","unique_valid",3,"Regola: lettera tra A–M, numero pari, suffisso X. Qual è l'unico elemento valido?","H-28-X",["R-28-X","H-27-X","H-28-Y"],"H è nell'intervallo, 28 è pari e il suffisso è X; ogni distrattore fallisce un criterio.",false],
  ["A110","exception_detection","group_incompatibility",3,"Gruppo: AB-12-Q, AC-14-Q, AD-16-Q. Quale elemento è incompatibile con il pattern comune?","AE-17-Q",["AF-18-Q","AG-20-Q","AH-22-Q"],"Il gruppo usa numero pari e suffisso Q; AE-17-Q è l'unico con numero dispari.",false]
];
const CONCENTRATION_SEMANTIC_REWRITES=[
  ["C1","sustained_scan","multiple_targets",1,"Serie: A B C A D B A C B. Conta insieme A e B.","6",["3","5","7"],"A compare tre volte e B tre volte: il totale combinato è 6.",false],
  ["C2","sustained_scan","exclusion_scan",2,"Numeri: 4, 7, 12, 9, 16, 18, 5, 20. Conta i pari escludendo i multipli di 3.","3",["5","4","6"],"I pari sono 4,12,16,18,20; esclusi 12 e 18 restano 4,16,20: sono 3.",false],
  ["C3","sustained_scan","block_comparison",2,"Blocco A: K M K P K M. Blocco B: K P M K P M. In quale blocco K supera M?","Solo A",["Solo B","Entrambi","Nessuno"],"Nel blocco A K compare 3 volte contro 2 M; nel blocco B K e M compaiono 2 volte.",false],
  ["C4","sustained_scan","ordered_pair_scan",3,"Serie: A B A C A B B A B C. Quante volte compare la coppia AB leggendo da sinistra, anche se le coppie si sovrappongono?","3",["2","4","5"],"AB inizia alle posizioni 1, 5 e 8: tre occorrenze.",false],
  ["C11","rule_switch","midpoint_switch",2,"Prima di | conta i valori >5; dopo | conta i valori <5: 3 8 6 4 | 7 2 1 6.","4",["3","5","6"],"Prima valgono 8 e 6; dopo valgono 2 e 1: totale 4.",false],
  ["C12","rule_switch","trigger_switch",3,"Conta le A fino a #; dopo # conta le B: A B A A # A B B C B.","6",["4","5","7"],"Prima del trigger ci sono 3 A; dopo il trigger 3 B: totale 6.",false],
  ["C13","rule_switch","position_switch",3,"Nelle posizioni dispari conta numeri pari; nelle posizioni pari conta numeri dispari: 2,3,4,8,6,7.","5",["3","4","6"],"Sono validi 2,3,4,6,7; soltanto 8 è escluso perché pari in posizione pari.",false],
  ["C14","rule_switch","block_rules",2,"Blocco 1 conta X, blocco 2 conta Y, blocco 3 conta Z: XXY | XYY | ZZX.","6",["5","7","8"],"I contributi sono 2 X, 2 Y e 2 Z: totale 6.",false],
  ["C21","interference_filter","case_and_container_filter",2,"Conta solo K maiuscole isolate: K k (K) K [K] k K.","3",["4","5","2"],"Sono valide le K isolate in posizione 1, 4 e 7; minuscole e racchiuse sono rumore.",false],
  ["C22","interference_filter","position_noise",2,"Conta le A ignorando tutte le posizioni multiple di 3: A B A A C A B A A.","3",["4","5","6"],"Le A alle posizioni 3, 6 e 9 sono ignorate; restano quelle in 1, 4 e 8: sono 3.",false],
  ["C23","interference_filter","category_filter",3,"Elementi: A2, B4, A7, C2, A8, B2. Conta soltanto categoria A con numero pari.","2",["3","4","1"],"Sono validi A2 e A8; A7 fallisce la parità e le altre categorie vanno ignorate.",false],
  ["C24","interference_filter","similar_noise",3,"Conta il target 8B, distinguendolo da B8, 88 e 8D: 8B B8 8B 88 8D 8B B8.","3",["2","4","5"],"8B compare esattamente tre volte; gli altri elementi sono interferenti visivamente simili.",false],
  ["C31","multi_condition","and_not",2,"Conta i numeri maggiori di 10 ma NON pari: 7, 11, 14, 17, 20, 23.","3",["2","4","5"],"Sopra 10 restano 11,14,17,20,23; esclusi i pari restano 11,17,23.",false],
  ["C32","multi_condition","controlled_or",3,"Conta valori pari OPPURE multipli di 5, escludendo quelli maggiori di 15: 2,5,8,10,15,16,20.","5",["4","6","7"],"Prima del limite sono validi 2,5,8,10,15; 16 e 20 sono esclusi perché maggiori di 15.",false],
  ["C33","multi_condition","three_conditions",3,"Conta codici con prefisso A, numero pari e suffisso X: A4X, A5X, B4X, A8Y, A6X.","2",["1","3","4"],"Solo A4X e A6X soddisfano contemporaneamente i tre vincoli.",false],
  ["C34","multi_condition","sequential_criteria",3,"Prima elimina i multipli di 3; poi, fra i restanti, conta i valori <10: 3,4,6,7,9,11,14.","2",["3","4","5"],"Eliminati 3,6,9 restano 4,7,11,14; sotto 10 sono 4 e 7.",false],
  ["C41","sequential_tracking","position_tracking",2,"Una pedina parte in posizione 4. Muovi +2, −1, +3, −2. Dove termina?","6",["5","7","8"],"Le posizioni successive sono 6,5,8,6; il termine è 6.",false],
  ["C42","sequential_tracking","state_update",3,"Stato iniziale APERTO. Istruzioni: inverti, mantieni, inverti, inverti. Stato finale?","CHIUSO",["APERTO","INDETERMINATO","ERRORE"],"Aperto→chiuso→chiuso→aperto→chiuso.",false],
  ["C43","sequential_tracking","dual_value_tracking",3,"Parti con A=3 e B=5. Scambia A/B; aggiungi 2 ad A; sottrai 1 da B. Quale coppia ottieni?","A=7, B=2",["A=5, B=4","A=4, B=5","A=6, B=3"],"Dopo lo scambio A=5,B=3; poi A=7 e B=2.",false],
  ["C44","sequential_tracking","intermediate_memory",3,"Parti da 6. Raddoppia, memorizza; sottrai 5; aggiungi metà del valore memorizzato.","13",["7","12","18"],"Il valore memorizzato è 12; dopo la sottrazione resta 7 e aggiungendo 6 si ottiene 13.",false],
  ["C51","multi_compare","match_count",2,"Riferimento ABCD. Quale stringa ha il maggior numero di caratteri nella posizione corretta?","ABXD",["AXCY","XBCA","DCBA"],"ABXD coincide nelle posizioni 1, 2 e 4: tre match, più delle altre alternative.",false],
  ["C52","multi_compare","cumulative_difference",3,"Confronta coppie: 8/6, 5/9, 7/7. Qual è la somma delle differenze assolute?","6",["4","8","10"],"Le differenze sono 2,4,0; la somma è 6.",false],
  ["C53","multi_compare","three_list_intersection",3,"Liste: A={K,M,P}; B={M,P,R}; C={P,R,S}. Quale elemento compare in tutte?","P",["M","R","K"],"P è presente in A, B e C; M manca da C e R manca da A.",false],
  ["C54","multi_compare","relative_similarity",3,"Riferimento K4-M7-P2. Quale record differisce in un solo campo?","K4-M8-P2",["K5-M8-P2","K4-M8-P3","K5-M7-P3"],"K4-M8-P2 cambia soltanto il campo centrale; gli altri cambiano due campi.",false],
  ["C61","alternating_rule","three_rule_cycle",3,"Applica ciclicamente +2, ×2, −3 partendo da 4 per quattro passaggi.","11",["13","15","20"],"I passaggi sono 4→6→12→9→11; dopo quattro operazioni il risultato è 11.",false],
  ["C62","alternating_rule","parity_dependent",3,"Parti da 7. Se il valore è dispari aggiungi 3; se è pari dividi per 2. Applica tre volte.","8",["4","5","10"],"I passaggi sono 7→10→5→8; dopo tre applicazioni il risultato è 8.",false],
  ["C63","alternating_rule","position_rule",2,"Nelle posizioni dispari aggiungi 2, nelle pari sottrai 1. Da 5 applica cinque passaggi.","9",["8","10","11"],"5→7→6→8→7→9, mantenendo la regola legata alla posizione.",false],
  ["C64","alternating_rule","conditional_alternation",3,"Parti da 6: alterna ×2 e −4; quando ottieni 8, ripeti ×2 invece di cambiare. Tre passaggi.","16",["8","12","20"],"6→12→8; il trigger impone di ripetere ×2, quindi 8→16.",false]
];

function buildAttentionLegacy(){
  const out=[];let id=1;
  const bases=["MXP-48271","\u0053EA-19K73","VRK-582104","AZ7Q92K","T3-64028","SEC-7315A","LMN-20487","QX-918274","BGG-42019","RMP-77106"];
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
    for(let k=0;k<8;k++){if(k===pos)items.push(target);else{const p=(k+i)%target.length,replacement=/\d/.test(target[p])?String((Number(target[p])+k+1)%10):(target[p]==="Q"?"R":"Q");items.push(mutateChar(target,p,replacement));}}
    const opts=seededShuffle([pos+1,((pos+1)%8)+1,((pos+3)%8)+1,((pos+5)%8)+1],1000+i);out.push(q(`A${id++}`,"attention",`<div>In quale posizione compare esattamente <span class="codes">${target}</span>?</div><div class="codes">${items.map((x,k)=>`${k+1}) ${x}`).join(" &nbsp; ")}</div>`,opts.map(String),opts.indexOf(pos+1),`Il bersaglio ${target} compare una sola volta, in posizione ${pos+1}; ogni altra stringa differisce per almeno un carattere.`,3,"single",true,"selective_search"));
  }
  const symbols=["▲","●","■","◆","○","△"];
  for(let i=0;i<20;i++){
    const target=symbols[i%symbols.length],arr=Array.from({length:28},(_,k)=>symbols[(k*3+i+(k%4))%symbols.length]);const c=arr.filter(x=>x===target).length;const [o,a]=numOpts(c,1,1100+i);
    out.push(q(`A${id++}`,"attention",`<div>Quante volte compare <b>${target}</b>?</div><div class="codes">${arr.join(" ")}</div>`,o.map(String),a,`Il simbolo ${target} compare ${c} volte.`,2,"single",true));
  }
  return out;
}

function buildAttention(){
  const out=[];let id=1;
  const mechanisms={
    code_compare:["exact_match","separator_agnostic","segment_alignment","dual_pair_check","divergence_location"],
    mismatch_detection:["single_substitution","single_omission","single_inversion","unique_equal_pair","field_inconsistency"],
    selective_search:["exact_single_target","target_with_exclusion","conditional_target","ordered_target","count_matching_targets"],
    symbol_count:["single_symbol","conditional_symbol","count_difference","position_limited","interference_exclusion"],
    multi_field_match:["two_field","three_field","cross_match","derived_field","all_constraints"],
    transposition_detection:["adjacent_chars","reversed_segment","reversed_digits","pair_comparison","position_identification"],
    consistency_check:["declared_rule","attribute_crosscheck","list_total","derived_value","compact_table"],
    exception_detection:["rule_violation","dual_criterion","impossible_combination","sequence_exception","duplicate_exception"]
  };
  const add=(stem,correct,wrong,explanation,family,mechanism)=>{const n=id,diff=n<=30?1:n<=90?2:3,[options,answer]=positionedOpts(String(correct),wrong.map(String),ATTENTION_ANSWER_PLAN[n-1]);mechanism=mechanism||mechanisms[family][(n-1)%5];out.push(q(`A${id++}`,"attention",stem,options,answer,explanation,diff,"single",true,family,mechanism));};
  for(let i=0;i<15;i++){const b=`${String.fromCharCode(66+i)}${47+i*3}-${String.fromCharCode(75+i%8)}${826+i*7}`,p=1+i%(b.length-2),d1=mutateChar(b,p,/\d/.test(b[p])?String((+b[p]+1)%10):"X"),d2=b.slice(0,-2)+b.at(-1)+b.at(-2),d3=mutateChar(b,b.length-1,String((+b.at(-1)+5)%10));add(`Quale codice coincide in ogni carattere con <span class="codes">${b}</span>?`,b,[d1,d2,d3],`${b} conserva caratteri, separatore e ordine del riferimento.`,"code_compare");}
  for(let i=0;i<15;i++){const odd=(i*3+1)%4,pairs=Array.from({length:4},(_,k)=>{const x=`${String.fromCharCode(70+i)}${20+i+k}-${530+i*9+k}`,y=k===odd?mutateChar(x,2,String((+x[2]+1)%10)):x;return`${x} / ${y}`;}),labels=["Coppia 1","Coppia 2","Coppia 3","Coppia 4"];add(`<div>Tre coppie coincidono. Quale contiene la discrepanza?</div><div class="codes">${pairs.map((x,k)=>`${k+1}) ${x}`).join("<br>")}</div>`,labels[odd],labels.filter((_,k)=>k!==odd),`Nella coppia ${odd+1} cambia un carattere interno; le altre coincidono.`,"mismatch_detection");}
  for(let i=0;i<15;i++){const t=`Q${31+i*4}${String.fromCharCode(66+i%12)}${72+i}`,present=i%5!==0,pos=(i*3+2)%7,items=[];for(let k=0;k<7;k++){if(present&&k===pos)items.push(t);else{const p=(i+k)%t.length,r=/\d/.test(t[p])?String((+t[p]+k+3)%10):(t[p]==="Q"?"R":"Q");items.push(mutateChar(t,p,r));}}const c=present?`Posizione ${pos+1}`:"Assente";add(`<div>Cerca <span class="codes">${t}</span>:</div><div class="codes">${items.map((x,k)=>`${k+1}) ${x}`).join(" &nbsp; ")}</div>`,c,["Assente",`Posizione ${(pos+2)%7+1}`,`Posizione ${(pos+4)%7+1}`,`Posizione ${(pos+6)%7+1}`],present?`Il target compare una sola volta, in posizione ${pos+1}.`:`Il target è assente: ogni codice presenta una discrepanza.`,"selective_search");}
  const sy=["▲","△","●","○","■","□","◆","◇"];
  for(let i=0;i<15;i++){const t=sy[(i%4)*2],arr=Array.from({length:18+i%6},(_,k)=>sy[(k*5+i+k%3)%sy.length]),c=arr.filter(x=>x===t).length;add(`<div>Conta solo <b>${t}</b>, ignorando la variante vuota.</div><div class="codes">${arr.join(" ")}</div>`,c,[c-1,c+1,c+2],`${t} compare ${c} volte; la variante vuota non va contata.`,"symbol_count");}
  for(let i=0;i<15;i++){const code=`L${40+i}-Q${7+i}`,zone=["NORD","EST","SUD"][i%3],slot=`${6+i%5}:15`,good=`${code} | ${zone} | ${slot}`,rows=[good,`${code} | ${["EST","SUD","NORD"][(i+1)%3]} | ${slot}`,`${mutateChar(code,2,String((+code[2]+1)%10))} | ${zone} | ${slot}`,`${code} | ${zone} | ${6+i%5}:45`];add(`Riferimento: <span class="codes">${good}</span>. Quale record coincide nei tre campi?`,good,rows.slice(1),`Solo ${good} conserva codice, zona e orario.`,"multi_field_match");}
  for(let i=0;i<15;i++){const b=`TR${35+i}${String.fromCharCode(65+i%10)}${64+i}`,p=2+i%(b.length-3),t=b.slice(0,p)+b[p+1]+b[p]+b.slice(p+2),wrong=[mutateChar(b,p,String((+b[p]+3)%10)),mutateChar(b,b.length-1,String((+b.at(-1)+4)%10)),b];add(`Rispetto a <span class="codes">${b}</span>, quale codice contiene una sola trasposizione adiacente?`,t,wrong,`${t} scambia soltanto i caratteri nelle posizioni ${p+1} e ${p+2}.`,"transposition_detection");}
  for(let i=0;i<15;i++){const make=(a,b,c,v=true)=>`${a}${b}${c}-${v?(a+b+c)%10:(a+b+c+1)%10}`,good=make(i%7+1,i%5+2,i%6+3),wrong=[make(2+i%5,4,3,false),make(1,5+i%3,2,false),make(3,2,6+i%2,false)];add(`La cifra finale è l'ultima cifra della somma delle tre iniziali. Quale codice è coerente?`,good,wrong,`In ${good} la somma termina con ${good.at(-1)}; gli altri controlli non coincidono.`,"consistency_check");}
  for(let i=0;i<15;i++){const letters=["A","B","C","D"],odd=(i+2)%4,codes=letters.map((l,k)=>{const wantOdd=k%2===0;let n=20+i*2+k;if((n%2===1)!==wantOdd)n++;if(k===odd)n++;return`${l}-${n}`;}),labels=["Elemento 1","Elemento 2","Elemento 3","Elemento 4"];add(`<div>A e C richiedono un numero dispari; B e D un numero pari. Trova l'eccezione.</div><div class="codes">${codes.map((x,k)=>`${k+1}) ${x}`).join(" &nbsp; ")}</div>`,labels[odd],labels.filter((_,k)=>k!==odd),`${codes[odd]} è l'unico elemento che viola l'associazione lettera-parità.`,"exception_detection");}
  applySemanticRewrites(out,ATTENTION_SEMANTIC_REWRITES,"attention",ATTENTION_ANSWER_PLAN);
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

function buildConcentrationLegacy(){
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

function buildConcentration(){
  const out=[];let id=1;
  const mechanisms={
    sustained_scan:["long_selective_count","multiple_targets","exclusion_scan","block_comparison","double_scan"],
    rule_switch:["midpoint_switch","trigger_switch","conditional_switch","block_rules","position_switch"],
    interference_filter:["character_noise","position_noise","category_filter","dual_filter","similar_noise"],
    multi_condition:["logical_and","controlled_or","negative_exclusion","sequential_criteria","three_conditions"],
    sequential_tracking:["successive_transform","position_update","value_update","intermediate_memory","ordered_instructions"],
    multi_compare:["match_count","pair_compare","three_list_compare","cumulative_divergence","multi_row_check"],
    alternating_rule:["two_rule","three_rule","parity_rule","position_rule","conditional_alternation"]
  };
  const add=(stem,correct,wrong,explanation,family,mechanism,html=true)=>{const n=id,diff=n<=17?1:n<=53?2:3,[options,answer]=positionedOpts(String(correct),wrong.map(String),CONCENTRATION_ANSWER_PLAN[n-1]);mechanism=typeof mechanism==="string"?mechanism:mechanisms[family][(n-1)%5];if(typeof mechanism!=="string")html=true;out.push(q(`C${id++}`,"concentration",stem,options,answer,explanation,diff,"single",html,family,mechanism));};
  for(let i=0;i<10;i++){const a=Array.from({length:24+i%5},(_,k)=>(k*7+i*3+k%4)%18+1),valid=a.filter(n=>n%2===0&&n<12),c=valid.length;add(`<div>Conta i numeri PARI e INFERIORI A 12.</div><div class="codes">${a.join(" · ")}</div>`,c,[a.filter(n=>n%2===0).length,a.filter(n=>n<12).length,Math.max(0,c-1)],`Soddisfano entrambi i criteri ${valid.join(", ")}: ${c} elementi.`,"sustained_scan");}
  for(let i=0;i<10;i++){const l=Array.from({length:8},(_,k)=>(i+k*3)%10),r=Array.from({length:8},(_,k)=>(i*2+k*5+1)%10),a=l.filter(n=>n%2===0).length,b=r.filter(n=>n%2===1).length,c=a+b;add(`<div>Prima di | conta i PARI; dopo | conta i DISPARI.</div><div class="codes">${l.join(" ")} | ${r.join(" ")}</div>`,c,[a,b,c+1],`Prima del cambio ci sono ${a} pari; dopo il cambio ${b} dispari. Totale ${c}.`,"rule_switch");}
  for(let i=0;i<10;i++){const s=Array.from({length:20},(_,k)=>["A","(A)","a","B","[A]"][(k*3+i+k%2)%5]),c=s.filter(x=>x==="A").length,all=s.filter(x=>x.includes("A")).length;add(`<div>Conta solo le A maiuscole isolate; ignora (A), [A] e a.</div><div class="codes">${s.join(" ")}</div>`,c,[all,s.filter(x=>x!=="a"&&x.includes("A")).length,c+1],`Le sole occorrenze valide sono le A isolate: ${c}.`,"interference_filter");}
  for(let i=0;i<10;i++){const a=Array.from({length:12},(_,k)=>(i*5+k*7+3)%25+1),valid=a.filter(n=>n>10&&n%3!==0),c=valid.length;add(`<div>Conta i valori maggiori di 10 che NON sono multipli di 3.</div><div class="codes">${a.join(" · ")}</div>`,c,[a.filter(n=>n>10).length,a.filter(n=>n%3!==0).length,Math.max(0,c-1)],`Applicando insieme soglia ed esclusione restano ${valid.join(", ")}: ${c} valori.`,"multi_condition");}
  for(let i=0;i<10;i++){const start=8+i,steps=i%2===0?[["+",4],["×",2],["−",6],["+",3]]:[["×",2],["+",5],["−",3],["+",2]];let value=start;const trace=[start];steps.forEach(([op,n])=>{value=op==="+"?value+n:op==="−"?value-n:value*n;trace.push(value);});add(`Parti da ${start} e applica nell'ordine: ${steps.map(x=>x.join(" ")).join("; ")}.`,value,[trace.at(-2),value+3,value-2],`I risultati intermedi sono ${trace.slice(1).join(" → ")}; il finale è ${value}.`,"sequential_tracking",false);}
  for(let i=0;i<10;i++){const rows=Array.from({length:4},(_,k)=>({label:`Riga ${k+1}`,x:5+i+k*2,y:10+(i+k*3)%8})),v=(i+1)%4;rows[v].x=8+(i%3)*2;rows[v].y=rows[v].x-3;rows.forEach((r,k)=>{if(k!==v&&r.x%2===0&&r.y===r.x-3)r.y++;});const good=rows[v];add(`<div>Trova la riga in cui X è pari e Y è X−3.</div><div class="codes">${rows.map(r=>`${r.label}: X=${r.x}, Y=${r.y}`).join("<br>")}</div>`,good.label,rows.filter((_,k)=>k!==v).map(r=>r.label),`${good.label}: ${good.x} è pari e ${good.x}−3=${good.y}.`,"multi_compare");}
  for(let i=0;i<10;i++){const start=5+i,a=[start];for(let k=0;k<6;k++)a.push(a.at(-1)+(k%2===0?3:-1));const c=a.at(-1);add(`<div>Continua alternando +3 e −1.</div><div class="codes">${a.slice(0,-1).join(" → ")} → ?</div>`,c,[c-1,c+2,a.at(-2)+3],`La sequenza completa è ${a.join(" → ")}; il risultato è ${c}.`,"alternating_rule");}
  applySemanticRewrites(out,CONCENTRATION_SEMANTIC_REWRITES,"concentration",CONCENTRATION_ANSWER_PLAN);
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
const SJT_P0_REWRITES={
  "0-7":["Durante un periodo senza flusso noti una persona ferma vicino al limite dell'area controllata mentre devi mantenere l'osservazione della postazione.",[
    "Mantieni l'osservazione e verifichi la situazione dalla postazione secondo le indicazioni disponibili.",
    "Completi prima il riordino vicino alla postazione, controllando la persona a intervalli brevi.",
    "Chiedi al collega della postazione adiacente se ha già notato la persona, senza interrompere l'osservazione.",
    "Lasci temporaneamente la postazione per avvicinarti alla persona e chiarire subito la situazione."],0,3,"La priorità è preservare la copertura della postazione e verificare l'elemento insolito senza abbandonare il controllo assegnato.","procedure"],
  "2-7":["In un momento tranquillo un collega chiede aiuto per rifornire una postazione vicina, ma la tua deve restare coperta e non è disponibile un sostituto.",[
    "Spieghi che non puoi lasciare la copertura e concordi di aiutare appena sarà disponibile un cambio.",
    "Porti una parte del materiale restando abbastanza vicino da controllare entrambe le postazioni.",
    "Chiedi al collega di attendere qualche minuto mentre verifichi se il flusso rimane assente.",
    "Ti assenti per il tempo strettamente necessario, chiedendo al collega di avvisarti se arriva qualcuno."],0,3,"Senza una sostituzione non va interrotta la copertura; comunicare il vincolo e pianificare l'aiuto tutela sia il servizio sia la responsabilità assegnata.","teamwork"],
  "0-13":["Un passeggero chiede come raggiungere un servizio dell'aeroporto. Non conosci il percorso esatto e il punto informazioni è chiaramente indicato poco distante.",[
    "Dichiari con cortesia di non conoscere il percorso esatto e lo indirizzi al punto informazioni indicato.",
    "Chiedi conferma a un collega disponibile mentre il passeggero attende accanto alla postazione.",
    "Indichi il percorso che ritieni più probabile, precisando che potrebbe essere necessario verificare.",
    "Lasci brevemente la postazione per accompagnarlo fino alla zona in cui pensi si trovi il servizio."],0,3,"Quando l'informazione non è certa, indirizzare alla fonte competente evita indicazioni errate senza lasciare la propria postazione.","communication"],
  "2-13":["Un collega ti chiede se un dispositivo con un avviso intermittente può restare in uso. Non hai competenza tecnica e il supporto incaricato è raggiungibile.",[
    "Riferisci il dubbio al supporto competente e attendi la sua valutazione prima di dare indicazioni sull'uso.",
    "Consultate insieme le istruzioni disponibili e proseguite solo se trovate una voce che sembra descrivere l'avviso.",
    "Suggerisci un riavvio controllato e chiedi al collega di osservare se l'avviso ricompare.",
    "Consigli di limitare temporaneamente l'uso alle attività meno critiche mentre viene richiesta assistenza."],0,3,"Non avendo autorità tecnica, la scelta più affidabile è sospendere il giudizio e coinvolgere chi è competente, evitando soluzioni improvvisate.","escalation"],
  "0-14":["Durante un compito di controllo noti che stai rileggendo più volte gli stessi dati e hai appena omesso un passaggio, poi recuperato.",[
    "Metti in sicurezza il compito e segnali subito il calo di attenzione per concordare una sostituzione o una pausa.",
    "Rallenti il ritmo e ricontrolli ogni passaggio fino alla pausa già prevista dal turno.",
    "Chiedi a un collega vicino di verificare informalmente il tuo lavoro mentre continui il compito.",
    "Completi l'attività corrente con maggiore cautela e valuti al termine se il problema persiste."],0,3,"L'omissione già avvenuta indica un calo operativo concreto: occorre proteggere il compito e comunicarlo prima di continuare senza adeguato supporto.","fatigue"],
  "2-14":["Un collega assegnato a un'attività critica riferisce capogiri e mostra difficoltà a mantenere l'attenzione.",[
    "Assicuri la copertura dell'attività e coinvolgi subito il responsabile e l'assistenza appropriata.",
    "Gli proponi di bere e sedersi qualche minuto restando comunque responsabile della postazione.",
    "Scambiate temporaneamente i compiti e informate il responsabile quando il flusso si riduce.",
    "Rimani accanto a lui per controllare eventuali errori finché non si sente in grado di proseguire."],0,3,"Sintomi fisici e calo attentivo in un'attività critica richiedono copertura immediata, comunicazione e supporto appropriato, non una gestione informale.","fatigue"]
};
function buildSituational(){const out=[];let id=1;for(let r=0;r<3;r++)SJT_SCENARIOS.forEach((s,i)=>{const askLeast=r===1,entry=SJT_P0_REWRITES[`${r}-${i}`]||s;const opts=seededShuffle(entry[1],2100+r*100+i),target=entry[1][askLeast?entry[3]:entry[2]],fallback=askLeast?"La risposta meno efficace tende a ridurre controllo, chiarezza o rispetto della procedura.":"La risposta migliore bilancia procedura, calma, comunicazione e responsabilità.";out.push(q(`S${id++}`,"situational",`${entry[0]} ${askLeast?"Qual è la risposta MENO efficace?":"Qual è la risposta PIÙ efficace?"}`,opts,opts.indexOf(target),entry[4]||fallback,3,askLeast?"least":"best",false,entry[5]||"situational_judgement"));});return out;}

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
function releaseReplace(id,cat,stem,options,answer,explanation,diff,family,mechanism,type="single",html=false){const i=BANK.findIndex(x=>x.id===id);if(i>=0)BANK[i]=q(id,cat,stem,options,answer,explanation,diff,type,html,family,mechanism);}
function applyReleaseCandidateCleanup(){
  const abstractRows=[
    ["R81","○ → ●; □ → ?",["■","□","●","◆"],0,"La trasformazione conserva la forma e cambia il riempimento da vuoto a pieno.",1,"attribute_combination","fill_toggle"],
    ["R82","↑○ → →● → ↓○ → ?",["←●","←○","↑●","→○"],0,"La freccia ruota di 90° mentre il riempimento alterna vuoto e pieno.",3,"dual_rule","rotation_and_fill"],
    ["R83","ABCD → DBCA. Applica la stessa trasformazione a PQRS.",["SQRP","SRQP","PQRS","PSRQ"],0,"Si scambiano soltanto il primo e l'ultimo elemento: PQRS diventa SQRP.",2,"sequence_transformation","outer_swap"],
    ["R84","Regola: gli elementi presenti in entrambe le celle si eliminano. ●▲ combinato con ▲■ produce:",["●■","●▲■","▲","●▲"],0,"▲ è comune e si elimina; restano ● e ■.",3,"matrix_relation","visual_xor"],
    ["R85","Un punto percorre gli angoli in senso orario: alto-sinistra, alto-destra, basso-destra, ?",["basso-sinistra","alto-sinistra","centro","alto-destra"],0,"Dopo il basso-destra il percorso orario raggiunge il basso-sinistra.",2,"spatial_position","clockwise_corners"],
    ["R86","○, ■, △, ◆, ○, ?",["■","◆","△","○"],0,"Le forme vuote seguono ○,△,○ mentre le posizioni pari alternano ■,◆,■.",3,"dual_rule","interleaved_attributes"]
  ];
  abstractRows.forEach(r=>releaseReplace(r[0],"abstract",...r.slice(1)));
  const numericalRows=[
    ["N1","La media di 12, 15, 9 e 20 è:",["14","13","15","16"],0,"La somma è 56; 56 ÷ 4 = 14.",1,"average","simple_mean"],
    ["N2","Tre quarti di 48 corrispondono a:",["36","32","40","42"],0,"48 ÷ 4 = 12 e 12 × 3 = 36.",1,"fraction","fraction_of_quantity"],
    ["N3","Un valore passa da 80 a 92. L'aumento percentuale è:",["15%","12%","18%","20%"],0,"L'aumento è 12; 12/80 × 100 = 15%.",2,"percentage_change","increase_from_base"],
    ["N4","Il rapporto addetti:postazioni è 3:2. Con 18 addetti, quante postazioni corrispondono allo stesso rapporto?",["12","9","15","27"],0,"18/3 = 6 gruppi; 6 × 2 = 12 postazioni.",2,"ratio","direct_proportion"],
    ["N5","2 ore e 35 minuti equivalgono a:",["155 minuti","145 minuti","165 minuti","135 minuti"],0,"Due ore sono 120 minuti; 120 + 35 = 155.",1,"conversion","time_conversion"],
    ["N6","In tre turni sono stati completati 42, 38 e 46 controlli. Per raggiungere una media di 45 su quattro turni, quanti ne servono nel quarto?",["54","45","48","52"],0,"Il totale richiesto è 45×4=180; i primi tre totalizzano 126, quindi ne servono 54.",3,"average","target_mean"],
    ["N7","Un'attività richiede 6 minuti per unità. Dopo 8 unità il tempo per ciascuna unità successiva si riduce del 25%. Quanto dura una nuova unità?",["4,5 minuti","5 minuti","3,5 minuti","7,5 minuti"],0,"Ridurre 6 minuti del 25% significa sottrarre 1,5 minuti: restano 4,5.",3,"time_rate","duration_reduction"],
    ["N8","Un totale di 240 è diviso nel rapporto 2:3:5. Quanto vale la quota maggiore?",["120","72","48","100"],0,"Le parti sono 10; ogni parte vale 24 e la quota maggiore vale 5×24=120.",2,"ratio","three_part_split"],
    ["N9","Un importo di 200 aumenta del 10% e poi diminuisce del 10%. Il valore finale è:",["198","200","180","202"],0,"Dopo l'aumento vale 220; il 10% di 220 è 22, quindi resta 198.",3,"percentage_change","successive_changes"],
    ["N10","Cinque operatori completano 300 verifiche in 4 ore allo stesso ritmo. Quante ne completa in media un operatore ogni ora?",["15","12","20","60"],0,"Le ore-operatore sono 5×4=20; 300/20=15 verifiche per operatore-ora.",2,"multi_step","per_person_rate"]
  ];
  numericalRows.forEach(r=>releaseReplace(r[0],"numerical",...r.slice(1)));
  const vf=["Vero","Falso","Non determinabile"];
  const verbalRows=[
    ["V31","Tutti i report urgenti sono revisionati. Questo report non è stato revisionato. Valuta: “Questo report non è urgente”.",vf,0,"Per contrapposizione, se fosse urgente sarebbe revisionato; non essendolo, non è urgente.",2,"implication","contraposition","vfn"],
    ["V32","Alcuni controlli sono digitali. Nessun controllo digitale è manuale. Valuta: “Alcuni controlli non sono manuali”.",vf,0,"Gli stessi controlli digitali citati non possono essere manuali; l'esistenza è quindi garantita.",2,"syllogism","existential_exclusion","vfn"],
    ["V33","Ogni attività del gruppo A precede le attività del gruppo B. X appartiene al gruppo B. Valuta: “X precede tutte le attività del gruppo A”.",vf,1,"Il testo stabilisce l'ordine opposto: ogni attività A precede X, che appartiene a B.",2,"relational_logic","ordered_groups","vfn"],
    ["V34","Se il sistema è in manutenzione, il canale 1 è chiuso. Il canale 1 è chiuso. Valuta: “Il sistema è in manutenzione”.",vf,2,"La chiusura può avere altre cause; il conseguente non permette di affermare l'antecedente.",2,"implication","deny_converse","vfn"],
    ["V35","Nessun elemento rosso è fragile. Alcuni elementi del lotto sono fragili. Valuta: “Alcuni elementi del lotto non sono rossi”.",vf,0,"Gli elementi fragili esistenti non possono essere rossi, quindi almeno alcuni elementi del lotto non sono rossi.",2,"syllogism","existence_and_exclusion","vfn"],
    ["V36","Luca arriva prima di Marta; Marta arriva prima di Paolo. Valuta: “Paolo arriva dopo Luca”.",vf,0,"La relazione è transitiva: Luca precede Marta, che precede Paolo.",1,"relational_logic","transitive_order","vfn"],
    ["V37","Solo le richieste complete vengono archiviate. La richiesta K è stata archiviata. Valuta: “K era completa”.",vf,0,"“Solo le richieste complete” rende la completezza necessaria per l'archiviazione; K archiviata era quindi completa.",2,"implication","necessary_condition","vfn"],
    ["V38","Almeno un turno serale usa la postazione C. Il turno di oggi è serale. Valuta: “Oggi viene usata la postazione C”.",vf,2,"L'esistenza di un turno serale che usa C non identifica il turno di oggi.",2,"true_false_nd","existential_scope","vfn"],
    ["V39","Tutti i codici validi iniziano con K. Il codice M12 inizia con M. Valuta: “M12 non è valido”.",vf,0,"Un codice valido dovrebbe iniziare con K; M12 non soddisfa la condizione necessaria.",1,"implication","contraposition","vfn"],
    ["V40","Nessuna attività differibile è urgente. L'attività P non è differibile. Valuta: “P è urgente”.",vf,2,"Non essere differibile non implica essere urgente; manca una premessa che colleghi direttamente P all'urgenza.",2,"true_false_nd","missing_relation","vfn"]
  ];
  verbalRows.forEach(r=>releaseReplace(r[0],"verbal",...r.slice(1)));
  releaseReplace("S21","situational","Durante un picco di flusso ricevi una richiesta non urgente mentre stai verificando un'anomalia già isolata. Qual è la risposta MENO efficace?",["Interrompi la verifica e passi subito alla richiesta non urgente.","Comunichi un tempo realistico per la richiesta e completi la verifica.","Chiedi supporto se la verifica richiede più tempo del previsto.","Mantieni isolata l'anomalia e aggiorni il referente."],0,"Abbandonare una verifica operativa per una richiesta non urgente rompe la priorità senza mitigazioni.",3,"pressure","priority_under_load","least");
  releaseReplace("S41","situational","Un collega propone una scorciatoia non prevista perché il materiale corretto arriverà tra pochi minuti. Qual è la risposta PIÙ efficace?",["Mantieni il processo in sicurezza, comunichi il ritardo e attendi il materiale corretto.","Accetti la scorciatoia solo per le attività più semplici.","Lasci decidere al collega che ha proposto la soluzione.","Provi la scorciatoia una volta e valuti dopo."],0,"Un ritardo breve non giustifica una soluzione improvvisata: si preservano condizioni sicure e tracciabilità.",3,"procedure","temporary_shortcut","best");
  const inboxRows=[
    ["I7","Un'anomalia operativa è già contenuta; contemporaneamente scade tra cinque minuti una consegna obbligatoria. Cosa fai?",["Verifichi che il contenimento sia stabile, comunichi lo stato e completi la consegna in scadenza.","Ignori l'anomalia contenuta fino a fine turno.","Abbandoni ogni altra attività per riesaminare da zero l'anomalia.","Completi la consegna senza comunicare l'anomalia."],0,"Contenimento verificato, comunicazione e gestione della scadenza preservano entrambe le priorità.",3,"competing_deadlines","contained_issue_and_deadline"],
    ["I8","Due attività hanno la stessa scadenza: una richiede la tua abilitazione, l'altra può essere svolta da un collega disponibile.",["Prendi l'attività non delegabile e concordi la delega dell'altra.","Svolgi prima quella più breve indipendentemente dai ruoli.","Le inizi entrambe alternandole.","Aspetti che una diventi urgente."],0,"La dipendenza dalla tua abilitazione rende una sola attività non delegabile.",2,"delegation","capability_dependency"],
    ["I9","Ricevi un dato incompleto necessario per chiudere un controllo e una richiesta informativa non urgente.",["Richiedi subito il dato mancante e, nell'attesa, gestisci la richiesta informativa.","Chiudi il controllo stimando il dato.","Rimandi entrambe le attività.","Gestisci la richiesta e dimentichi il controllo."],0,"Si sblocca prima la dipendenza critica e si usa utilmente l'attesa.",2,"dependency","parallel_waiting_work"],
    ["I10","A fine turno resta un'attività critica iniziata e una registrazione ordinaria non iniziata.",["Predisponi un passaggio di consegne verificabile sull'attività critica e segnali la registrazione aperta.","Chiudi rapidamente entrambe riducendo i controlli.","Lasci solo un messaggio generico.","Completi la registrazione e non documenti l'attività critica."],0,"La consegna deve rendere tracciabili stato, rischi e lavoro residuo.",3,"handover","critical_work_transfer"],
    ["I11","Tre richieste: rischio immediato, aggiornamento entro un'ora, riordino senza scadenza. Qual è l'ordine corretto?",["Rischio, aggiornamento, riordino.","Aggiornamento, rischio, riordino.","Riordino, aggiornamento, rischio.","Rischio, riordino, aggiornamento."],0,"Prima il rischio immediato, poi la scadenza temporale, infine il compito differibile.",1,"safety_priority","three_level_order"],
    ["I12","Un collega segnala un possibile blocco fra trenta minuti; ora hai un compito breve con scadenza tra dieci minuti.",["Completi il compito breve e pianifichi subito la verifica del possibile blocco.","Ignori il compito in scadenza per trenta minuti.","Aspetti che il blocco si verifichi.","Tratti entrambe le attività come prive di priorità."],0,"La scadenza immediata viene rispettata senza perdere la prevenzione del rischio futuro.",2,"competing_deadlines","future_risk_planning"]
  ];
  inboxRows.forEach(r=>releaseReplace(r[0],"inbox",...r.slice(1)));
  const personalityUpdates={P7:"Quando una procedura rallenta il lavoro, valuto con attenzione come applicarla senza perdere precisione.",P8:"Se noto un mio errore, considero impatto e modalità più utile per correggerlo e comunicarlo.",P15:"Di fronte a una situazione nuova, distinguo ciò che posso decidere da ciò che richiede verifica.",P18:"Quando ricontrollo un dato, cerco evidenze concrete invece di affidarmi alla prima impressione.",P25:"Nei compiti con responsabilità elevate, bilancio accuratezza, ritmo e richiesta di supporto.",P31:"Quando non conosco una risposta, valuto rapidamente quale fonte possa essere più affidabile.",P34:"In caso di dubbio, scelgo il livello di verifica proporzionato alle conseguenze possibili.",P39:"Prima di chiudere un'attività, adatto il controllo finale al rischio di errore."};
  Object.entries(personalityUpdates).forEach(([id,stem])=>releaseReplace(id,"personality",stem,SCALE,null,"Non esiste una risposta corretta. Rispondi in modo sincero e coerente.",1,"personality","balanced_self_report","scale"));
  BANK.forEach(item=>{if(item.family===item.cat){const n=Number(item.id.slice(1));if(item.cat==="abstract"){item.family=["alternation","rotation","matrix_relation","matrix_relation","sequence_transformation"][Math.min(4,Math.floor((n-1)/20))];item.mechanism=item.mechanism||["symbol_cycle","constant_rotation","quantity_matrix","checker_matrix","progressive_pattern"][Math.min(4,Math.floor((n-1)/20))];}else if(item.cat==="numerical"){item.family=["arithmetic_sequence","progressive_sequence","percentage","time_rate","data_interpretation"][Math.min(4,Math.floor((n-1)/20))];item.mechanism=item.mechanism||"generated_variant";}else if(item.cat==="verbal"){item.family=n<=45?"true_false_nd":n<=60?"vocabulary_context":n<=80?"analogy":"passage_inference";item.mechanism=item.mechanism||"generated_variant";}else if(item.cat==="situational"){item.family="situational_judgement";item.mechanism=item.mechanism||item.type;}else if(item.cat==="inbox"){item.family="priority_management";item.mechanism=item.mechanism||"priority_choice";}else if(item.cat==="personality"){item.family="personality";item.mechanism=item.mechanism||"self_report";}}});
}
applyReleaseCandidateCleanup();
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
function pickStratified(cat,count,seed){const pool=seededShuffle(BANK.filter(x=>x.cat===cat),seed),chosen=[],familyCounts={},diffCounts={1:0,2:0,3:0},diffTargets={1:Math.round(count*.25),2:Math.round(count*.5)};diffTargets[3]=count-diffTargets[1]-diffTargets[2];while(chosen.length<count&&pool.length){const eligible=pool.filter(x=>diffCounts[x.diff]<(diffTargets[x.diff]??count)),source=eligible.length?eligible:pool,minFamily=Math.min(...source.map(x=>familyCounts[x.family]||0)),candidate=source.find(x=>(familyCounts[x.family]||0)===minFamily),index=pool.indexOf(candidate);chosen.push(candidate);pool.splice(index,1);familyCounts[candidate.family]=(familyCounts[candidate.family]||0)+1;diffCounts[candidate.diff]=(diffCounts[candidate.diff]||0)+1;}return chosen;}
function startAssessment(){const qs=[],sections=[];let cursor=0;ASSESSMENT_SECTIONS.forEach((s,i)=>{const chosen=pickStratified(s.cat,s.count,Date.now()+i*997);const indexes=chosen.map((_,k)=>cursor+k);qs.push(...chosen);sections.push({...s,indexes});cursor+=chosen.length;});state={mode:"assessment",questions:qs,answers:{},flagged:{},current:0,sections,sectionIndex:0,sectionRemaining:sections[0].seconds,totalRemaining:3600,duration:3600,startedAt:Date.now(),completed:false};showQuiz();startTimer();saveSession();}
function startSpecial(mode){const cat="personality",count=40,seconds=12*60;state={mode:"personality",questions:seededShuffle(BANK.filter(x=>x.cat===cat),Date.now()).slice(0,count),answers:{},flagged:{},current:0,sections:null,sectionIndex:0,sectionRemaining:0,totalRemaining:seconds,duration:seconds,startedAt:Date.now(),completed:false};showQuiz();startTimer();saveSession();}
function startCustom(mode,forced=null){const cats=[...E.catChooser.querySelectorAll("input:checked")].map(x=>x.value);if(!forced&&!cats.length){alert("Seleziona almeno una categoria.");return;}let pool=forced?[...forced]:BANK.filter(x=>cats.includes(x.cat));pool=seededShuffle(pool,Date.now());const n=forced?pool.length:Math.min(Number(E.count.value),pool.length),seconds=Number(E.time.value)*60;state={mode,questions:pool.slice(0,n),answers:{},flagged:{},current:0,sections:null,sectionIndex:0,sectionRemaining:0,totalRemaining:seconds,duration:seconds,startedAt:Date.now(),completed:false};showQuiz();startTimer();saveSession();}
function showQuiz(){E.home.classList.add("hidden");E.results.classList.add("hidden");E.quiz.classList.remove("hidden");renderQuestion();}
function curSection(){return state.sections?state.sections[state.sectionIndex]:null;}
function allowed(i){return !state.sections||curSection().indexes.includes(i);}
function renderStem(question){if(question.html)E.stem.innerHTML=question.stem;else E.stem.textContent=question.stem;}
function renderQuestion(){const question=state.questions[state.current];if(!question)return;E.progressLabel.textContent=`${state.current+1} / ${state.questions.length}`;E.progressBar.style.width=`${(state.current+1)/state.questions.length*100}%`;E.sectionLabel.textContent=state.sections?`Sezione ${state.sectionIndex+1}/${state.sections.length} • ${curSection().label}`:"";E.categoryPill.textContent=META[question.cat].label;E.qIndex.textContent=`Quesito ${state.current+1}`;E.difficulty.textContent=question.answer==null?"Non punteggiato":`Difficoltà ${"●".repeat(question.diff)}${"○".repeat(3-question.diff)}`;renderStem(question);const selected=state.answers[state.current],answered=selected!=null;E.answers.className=question.type==="scale"?"answers scale-answers":"answers";E.answers.innerHTML=question.options.map((opt,i)=>{let cls="answer";if(selected===i)cls+=" selected";if(answered&&question.answer!=null){if(i===question.answer)cls+=" correct";if(i===selected&&selected!==question.answer)cls+=" wrong";}return`<button class="${cls}" data-i="${i}" ${answered?"disabled":""}><span class="aletter">${question.type==="scale"?i+1:LETTERS[i]}</span><span>${esc(opt)}</span></button>`;}).join("");E.answers.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(state.answers[state.current]!=null)return;state.answers[state.current]=Number(b.dataset.i);renderQuestion();});if(answered){if(question.answer==null){E.feedback.className="feedback";E.feedback.textContent=question.explanation;}else{const ok=selected===question.answer;E.feedback.className=`feedback ${ok?"ok":"no"}`;E.feedback.innerHTML=`<b>${ok?"Corretto.":"Non corretto."}</b> ${question.explanation}`;}}else E.feedback.className="feedback hidden";E.prev.disabled=true;E.flag.disabled=answered;E.flag.textContent=state.flagged[state.current]?"⚑ Segnata":"⚑ Segna";E.next.disabled=!answered;E.next.textContent=state.current===state.questions.length-1?"Vai alla fine →":"Avanti →";E.finish.disabled=answered;E.answeredLabel.textContent=`${Object.keys(state.answers).length} risposte`;renderNav();updateTimer();saveSession();}
function renderNav(){E.navigator.innerHTML=state.questions.map((_,i)=>{const cls=["navq"];if(state.answers[i]!=null)cls.push("answered");if(state.flagged[i])cls.push("flagged");if(i===state.current)cls.push("current");return`<button class="${cls.join(" ")}" data-i="${i}" disabled>${i+1}</button>`;}).join("");}
function startTimer(){clearInterval(tick);if(!state.duration){E.timer.textContent="∞";return;}tick=setInterval(()=>{if(state.mode==="assessment"){state.sectionRemaining=Math.max(0,state.sectionRemaining-1);state.totalRemaining=Math.max(0,state.totalRemaining-1);if(state.sectionRemaining===0){advanceSection(true);return;}}else{state.totalRemaining=Math.max(0,state.totalRemaining-1);if(state.totalRemaining===0){finish(true);return;}}updateTimer();if((state.mode==="assessment"?state.sectionRemaining:state.totalRemaining)%10===0)saveSession();},1000);updateTimer();}
function updateTimer(){const sec=state.mode==="assessment"?state.sectionRemaining:state.totalRemaining;if(!state.duration){E.timer.textContent="∞";E.timer.className="";return;}const total=state.mode==="assessment"?curSection().seconds:state.duration;E.timer.textContent=`${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;const ratio=sec/total;E.timer.className=ratio<=.1?"danger":ratio<=.25?"warn":"";}
function advanceSection(auto=false){if(!state.sections)return;if(state.sectionIndex>=state.sections.length-1){finish(true);return;}state.sectionIndex++;const s=curSection();state.sectionRemaining=s.seconds;state.current=s.indexes[0];renderQuestion();}
function next(){if(state.answers[state.current]==null)return;if(state.sections){const s=curSection(),p=s.indexes.indexOf(state.current);if(p<s.indexes.length-1){state.current=s.indexes[p+1];renderQuestion();}else advanceSection(false);}else if(state.current<state.questions.length-1){state.current++;renderQuestion();}else finish(false);}
function prev(){}
function score(){let correct=0,scored=0;const by={};state.questions.forEach((x,i)=>{if(!by[x.cat])by[x.cat]={correct:0,scored:0,total:0,answered:0};const b=by[x.cat];b.total++;if(state.answers[i]!=null)b.answered++;if(x.answer!=null){scored++;b.scored++;if(state.answers[i]===x.answer){correct++;b.correct++;}}});return{correct,scored,by};}
function finish(forced=false){if(state.completed)return;const unanswered=state.questions.length-Object.keys(state.answers).length;if(!forced&&unanswered>0&&!confirm(`Hai ${unanswered} domande senza risposta. Terminare comunque?`))return;clearInterval(tick);state.completed=true;localStorage.removeItem("securityAssessmentSessionV3");showResults(forced);}
function showResults(forced){E.quiz.classList.add("hidden");E.home.classList.add("hidden");E.results.classList.remove("hidden");const s=score(),p=s.scored?Math.round(s.correct/s.scored*100):0,answered=Object.keys(state.answers).length,unanswered=state.questions.length-answered,flagged=Object.values(state.flagged).filter(Boolean).length;E.scorePct.textContent=s.scored?`${p}%`:"—";E.scoreRaw.textContent=s.scored?`${s.correct} / ${s.scored}`:"non punteggiato";if(!s.scored)E.resultTitle.textContent="Questionario completato";else if(p>=85)E.resultTitle.textContent="Prestazione molto forte";else if(p>=70)E.resultTitle.textContent="Buona prestazione";else if(p>=55)E.resultTitle.textContent="Base discreta da consolidare";else E.resultTitle.textContent="Serve altro allenamento";E.resultText.textContent=s.scored?`Corrette ${s.correct} su ${s.scored} domande valutabili. ${unanswered?`Non risposte: ${unanswered}.`:"Hai risposto a tutti i quesiti."}`:`Hai compilato ${answered} item su ${state.questions.length}. Il questionario comportamentale non produce un punteggio di idoneità.`;E.resultWarning.textContent="Il risultato è esclusivamente didattico e non corrisponde a soglie, profili o criteri reali di selezione.";E.areaScores.innerHTML=Object.entries(s.by).map(([k,b])=>{if(!b.scored){const pc=Math.round(b.answered/b.total*100);return`<div class="area"><div class="area-head"><span>${META[k].label}</span><b>${b.answered}/${b.total} compilate</b></div><div class="bar"><i style="width:${pc}%"></i></div></div>`;}const pc=Math.round(b.correct/b.scored*100);return`<div class="area"><div class="area-head"><span>${META[k].label}</span><b>${pc}% (${b.correct}/${b.scored})</b></div><div class="bar"><i style="width:${pc}%"></i></div></div>`;}).join("");const elapsed=Math.round((Date.now()-state.startedAt)/1000);E.indicators.innerHTML=`<div class="indicator"><span>Risposte</span><b>${answered}/${state.questions.length}</b></div><div class="indicator"><span>Non risposte</span><b>${unanswered}</b></div><div class="indicator"><span>Segnate</span><b>${flagged}</b></div><div class="indicator"><span>Tempo trascorso</span><b>${Math.floor(elapsed/60)}m ${elapsed%60}s</b></div><div class="indicator"><span>Modalità</span><b>${state.mode}</b></div>`;if(s.scored)saveStats(p);renderReview();window.scrollTo({top:0,behavior:"smooth"});}
function renderReview(){const f=E.reviewFilter.value;E.review.innerHTML=state.questions.map((x,i)=>{const g=state.answers[i],wrong=x.answer!=null&&g!=null&&g!==x.answer,un=g==null,flag=!!state.flagged[i];if(!(f==="all"||(f==="wrong"&&wrong)||(f==="unanswered"&&un)||(f==="flagged"&&flag)))return"";if(x.answer==null)return`<article class="review-item"><b>${i+1}. ${esc(x.stem)}</b><p>Tua risposta: ${un?"—":`${g+1}/5 — ${esc(x.options[g])}`}</p><p>${x.explanation}</p></article>`;return`<article class="review-item"><b>${i+1}. ${x.html?x.stem:esc(x.stem)}</b><p class="${wrong||un?"bad":"good"}">Tua risposta: ${un?"—":`${LETTERS[g]}) ${esc(x.options[g])}`}</p><p class="good">Corretta: ${LETTERS[x.answer]}) ${esc(x.options[x.answer])}</p><p>${x.explanation}</p></article>`;}).join("")||`<p class="small">Nessun elemento per questo filtro.</p>`;}
function resetHome(){clearInterval(tick);state={mode:null,questions:[],answers:{},flagged:{},current:0,sections:null,sectionIndex:0,sectionRemaining:0,totalRemaining:0,duration:0,startedAt:null,completed:false};localStorage.removeItem("securityAssessmentSessionV3");E.quiz.classList.add("hidden");E.results.classList.add("hidden");E.home.classList.remove("hidden");E.custom.classList.add("hidden");E.resume.classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"});}

renderCats();renderStats();loadResume();
document.querySelectorAll(".mode-card").forEach(b=>b.onclick=()=>{const m=b.dataset.mode;if(m==="assessment")startAssessment();else if(m==="personality"||m==="english")startSpecial(m);else{state.mode=m;E.custom.classList.remove("hidden");E.startCustom.dataset.mode=m;E.custom.scrollIntoView({behavior:"smooth",block:"center"});}});
E.startCustom.onclick=()=>startCustom(E.startCustom.dataset.mode||"practice");E.resume.onclick=()=>{showQuiz();startTimer();};E.prev.onclick=prev;E.next.onclick=next;E.flag.onclick=()=>{state.flagged[state.current]=!state.flagged[state.current];renderQuestion();};E.finish.onclick=()=>finish(false);E.reviewFilter.onchange=renderReview;E.newSession.onclick=resetHome;E.retryWrong.onclick=()=>{const wrong=state.questions.filter((x,i)=>x.answer!=null&&state.answers[i]!==x.answer);if(!wrong.length){alert("Nessun errore da ripetere.");return;}resetHome();startCustom("practice",wrong);};E.resetStats.onclick=()=>{if(confirm("Azzerare le statistiche salvate?")){localStorage.removeItem("securityAssessmentStatsV3");renderStats();}};window.addEventListener("beforeunload",()=>{if(!state.completed)saveSession();});
})();
