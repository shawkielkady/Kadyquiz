//Select elements
let countSpans=document.querySelector('.questions-count span');
let bullets=document.querySelector('.bullets .spans');
let quizArea=document.querySelector('.quiz-area');
let answerArea=document.querySelector('.answer-area .answers');
let submitButton =document.querySelector('.submit');
let countDownDiv=document.querySelector('.countdown');
//set options
let currentIndex=0;
let rightAnswers=0;
let countInterval;
function getQusetins(){
    let myReq= new XMLHttpRequest();
    myReq.onreadystatechange=function(){
        if(this.readyState===4 && this.status===200){
            let myobj=JSON.parse(this.responseText);
            let quesCount=myobj.length;
            createBullets(quesCount)
            //Add data
            addQuestionsData(myobj[currentIndex],quesCount);
            countDonw(5,quesCount)
            submitButton.onclick=()=>{
                let rightAnswer=myobj[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(rightAnswer,quesCount);
                quizArea.innerHTML='';
                answerArea.innerHTML='';
                addQuestionsData(myobj[currentIndex],quesCount);
                handleBullets();
                clearInterval(countInterval);
                countDonw(5,quesCount)
                showResults(quesCount)

            }

        }
    }
    myReq.open("GET","html_questions.json",true);
    myReq.send();
}
getQusetins();
function createBullets(num){
    countSpans.innerHTML=num;
    for(let i=0;i<num;i++){
        let bullet=document.createElement('span')
        if(i===0){
            bullet.className='on'
        }
        bullets.appendChild(bullet)
    }
}
function addQuestionsData(obj,count){
   if(currentIndex < count){
     //create question
     let qTitle=document.createElement('h2');
     let question=document.createTextNode(obj.title);
     qTitle.appendChild(question);
     quizArea.appendChild(qTitle);
     //create amswer
     for(let i=1 ;i<=4;i++){
         let answerDiv=document.createElement('div');
         answerDiv.className='answer';
         let input=document.createElement('input');
         //set input things
         input.name='questions';
         input.type='radio';
         input.id=`answer_${i}`;
         input.dataset.answer=obj[`answer_${i}`];
         if(i===1){
             input.checked=true;
         }
         answerDiv.appendChild(input);
         answerArea.appendChild(answerDiv);
         //create the label
         let theLabel=document.createElement('label');
         theLabel.htmlFor=`answer_${i}`;
         let theLabelText=document.createTextNode(obj[`answer_${i}`]);
         theLabel.appendChild(theLabelText);
         answerDiv.appendChild(theLabel)
     }
   }
}
function checkAnswer(rAnswer,count){
    let answers=document.getElementsByName('questions');
    let choosenAnswer;
    for(let i=0;i<answers.length;i++){
        if(answers[i].checked){
            choosenAnswer=answers[i].dataset.answer;
        }
    }
    
    if(rAnswer === choosenAnswer){
        rightAnswers++;

    }
}
function  handleBullets(){
    let spans=document.querySelectorAll('.bullets .spans span');
    let arraySpans=Array.from(spans);
    arraySpans.forEach((span,idx)=>{
        if(currentIndex === idx){
            span.classList.add('on')
        }
    })
}
function showResults(count){
    let theResults;
    if(currentIndex ===count){
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        document.querySelector('.bullets').remove();
        if(rightAnswers >(count / 2) && rightAnswers < count  ){
            theResults=`<span class='good'>good </span>${rightAnswers} from ${count}`
        }
        else if(rightAnswers === count){
            theResults=`<span class='perfect'>Perfect</span> ${rightAnswers} from ${count}`
        }
        else{
            theResults=`<span class='bad'>Bad</span> ${rightAnswers} from ${count}`
        }
        document.querySelector('.results').innerHTML=theResults;
    }
}
function countDonw(duration,count){
    if(currentIndex < count){
        let mins,secs;
        countInterval=setInterval(()=>{

            mins=parseInt(duration / 60);
            secs = parseInt(duration % 60);
            countDownDiv.innerHTML=`${mins} : ${secs}`;
            if(--duration < 0){
                clearInterval(countInterval);
                submitButton.click();
            }
        }   
            ,1000);

    }
}