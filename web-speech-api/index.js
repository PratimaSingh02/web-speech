import {langs} from './data.js';

let grammarArr=[];

let langSelect=document.querySelector('#lang-select');
let str='<option value="none" selected disabled hidden>Select a Language</option>';
let langSize=langs.length;
for(let i=0;i<langSize;i++)
    str+=`<option value=${langs[i]}>${langs[i]}</option>`
langSelect.innerHTML=str;


window.onload=()=>{
    const start=document.querySelector('.start-btn');
    const stop=document.querySelector('.stop-btn');
    const texts=document.querySelector('.texts');
    const interim=document.querySelector('#interim');
    const clear=document.querySelector('.clear');
    let grammarText=document.querySelector('.grammar-text');
    let grammarBtn=document.querySelector('.grammar-btn');
    let grammar='';

    
    window.SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition=new window.SpeechRecognition();
    window.SpeechGrammarList=window.SpeechGrammarList || window.webkitSpeechGrammarList;
    let speechRecognitionList=new SpeechGrammarList();
    recognition.interimResults=false;//get results after recognition ends
    recognition.lang='en-US';

    let p=document.createElement('p');
    texts.appendChild(p);
    let str='';
    recognition.addEventListener('result',(e)=>{
        p.innerText=str+Array.from(e.results).map(result=>result[0]).map(result=> result.transcript).join('');

        if(e.results[0].isFinal){
            str=p.innerText+" ";//saving previous input
        }
    });

    recognition.addEventListener('end',()=> {
        if(start.disabled==true)
            recognition.start();
    });

    start.addEventListener('click',(e)=>{
        e.target.disabled=true;
        stop.disabled=false;
        recognition.start();
        console.log('started');
    });

    stop.addEventListener('click',(e)=>{
        e.target.disabled=true;
        start.disabled=false;
        recognition.stop();
        console.log('stopped');
    });

    langSelect.addEventListener('change',(e)=>{
        //console.log(e.target.value);
        recognition.lang=e.target.value;
        document.documentElement.setAttribute("lang", recognition.lang);
    });

    interim.addEventListener('change',(e)=>{
        //console.log(e.target.checked);
        recognition.interimResults=e.target.checked;
    });

    grammarBtn.addEventListener('click',()=>{
      if(grammarText.value.trim()!==''){
          grammarArr.push(grammarText.value);
          grammarText.value='';
          grammar = '#JSGF V1.0; grammar grammarArr; public <words> = ' + grammarArr.join(' | ') + ' ;';
          speechRecognitionList.addFromString(grammar,1);
          recognition.grammars=speechRecognitionList;
          console.log(recognition.grammars);
         // console.log(grammarArr);
      }
    });

    clear.addEventListener('click',()=>{
            p.innerText='';
            str='';
    })

    recognition.onaudiostart = function() {
        console.log('Audio capturing started');
    }

    recognition.onaudioend = function() {
        console.log('Audio capturing ended');
    }

}





