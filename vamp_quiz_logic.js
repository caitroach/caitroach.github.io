const questions = [

    {
        "question": "How old are you?",
        "answer1": "17", //edward
        "answer2": "older than cities; older than pain", //nosferatu
        "answer3": "i don't remember", //nandor the relentless
        "answer4": "bout 420 lol", //dracula
        "answer5": "irrelevant, give me your lunch money", //lost boys

        "answer1_points": 1,
        "answer2_points": 2, 
        "answer3_points": 3, 
        "answer4_points": 4, 
        "answer5_points": 5,

    },

    {

        "question": "it's a Friday night. you're...",
        "answer1": "playing baseball", //edward
        "answer2": "puppeteering a legion of rats", //nosferatu
        "answer3": "bossing around my chud familiar", //nandor
        "answer4": "exploring lucrative real estate opportunities", //dracula
        "answer5": "terrorizing the locals", //lost boys

        "answer1_points": 1,
        "answer2_points": 2, 
        "answer3_points": 3, 
        "answer4_points": 4, 
        "answer5_points": 5,

    },

    {

        "question": "what's your love life like?",
        "answer1": "i'm in a relationship with a problematic age gap", //edward
        "answer2": "i have a lil crush but they're taken :(", //nosferatu
        "answer3": "it's rough out there ok", //nandor
        "answer4": "i'm too busy for all that", //dracula
        "answer5": "i'm in a queer polyamorous vampire motorcycle gang", //lost boys

        "answer1_points": 1,
        "answer2_points": 2, 
        "answer3_points": 3, 
        "answer4_points": 4, 
        "answer5_points": 5,

    },

    {

        "question": "pick a human movie",
        "answer1": "leo dicaprio's romeo and juliet", //edward
        "answer2": "a 1922 silent film from Romania", //nosferatu
        "answer3": "the incredible burt wonderstone", //nandor, canonical answer btw
        "answer4": "a serbian film", //dracula, i just googled "movie with most human suffering"
        "answer5": "back to the future", //lost boys, i dunno it was popular in the '80s

        "answer1_points": 1,
        "answer2_points": 2, 
        "answer3_points": 3, 
        "answer4_points": 4, 
        "answer5_points": 5,
    },

    { 

        "question": "your ideal partner is someone who...",
        "answer1": "enjoys romantic hikes", //edward
        "answer2": "appreciates grand romantic gestures", //nosferatu
        "answer3": "i can change at a whim with my genie", //nandor 
        "answer4": "doesn't mind my bug-eating familiar", //dracula
        "answer5": "can party all night and sleep all day", //lost boys, real answer

        "answer1_points": 1,
        "answer2_points": 2, 
        "answer3_points": 3, 
        "answer4_points": 4, 
        "answer5_points": 5,
    },

    { 

        "question": "what does success look like to you?",
        "answer1": "a loving family", //edward
        "answer2": "the bubonic plague", //nosferatu
        "answer3": "lots of pillaging", //nandor
        "answer4": "a big beautiful castle filled with untold riches", //dracula
        "answer5": "blockbuster!", //lost boys more like lost revenue LMFAO 
        //rip though we hardly knew ye

        "answer1_points": 1,
        "answer2_points": 2, 
        "answer3_points": 3, 
        "answer4_points": 4, 
        "answer5_points": 5,
        


    },

    {

        "question": "finally, pick a word to describe you.",
        "answer1": "off-putting", //edward
        "answer2": "passionate", //nosferatu
        "answer3": "himbo", //nandor <3
        "answer4": "charming", //drac attac
        "answer5": "awesome", //lost boys

        "answer1_points": 1,
        "answer2_points": 2, 
        "answer3_points": 3, 
        "answer4_points": 4, 
        "answer5_points": 5,

    
    }

]

//i will always prefer snake case, i don't care what the js convention is
let current_question = 0;
let score = []; 
let selected_answers = [];
const total_questions = questions.length;

const container = document.querySelector(".quiz-container");
const question_element = document.querySelector(".question");

const option1 = document.querySelector(".option1");
const option2 = document.querySelector(".option2");
const option3 = document.querySelector(".option3");
const option4 = document.querySelector(".option4");
const option5 = document.querySelector(".option5");

const next_button = document.querySelector(".next");
const previous_button = document.querySelector(".previous");
const restart_button = document.querySelector(".restart");
const result = document.querySelector(".result");
const tracker = document.querySelector(".tracking")

function grab_questions (index) {
        
    //select each question by index

    const question = questions[index];
    
    const option1_total = questions[index].answer1_points;
    const option2_total = questions[index].answer2_points;
    const option3_total = questions[index].answer3_points;
    const option4_total = questions[index].answer4_points;
    const option5_total = questions[index].answer5_points;

    //set stuff

    question_element.innerHTML = `${question.question}`
    tracker.innerHTML = `<br>question ${index + 1}/7`
    
    option1.setAttribute('data-total', `${option1_total}`);
    option2.setAttribute('data-total', `${option2_total}`);
    option3.setAttribute('data-total', `${option3_total}`);
    option4.setAttribute('data-total', `${option4_total}`);
    option5.setAttribute('data-total', `${option5_total}`);

    option1.innerHTML = `${question.answer1}`
    option2.innerHTML = `${question.answer2}`
    option3.innerHTML = `${question.answer3}`
    option4.innerHTML = `${question.answer4}`
    option5.innerHTML = `${question.answer5}`
}

function grab_next_question () {

    const selected_option = document.querySelector('input[type="radio"]:checked');

    //if there's no input, yell at people

    if (!selected_option) {
        alert("uhh... you need to select an answer... lol");
        return;
    }

  const wrapper = selected_option.closest('label') || selected_option.parentElement;
  const answer_span = wrapper?.querySelector('span') || selected_option.nextElementSibling;
  const answer_score = Number(answer_span?.dataset.total);

  if (Number.isNaN(answer_score)) {
    alert("Couldn't read your score. Wrap input+span in a <label> or fix the HTML order.");
    return;
  }

  score.push(answer_score);

    const total_score = score.reduce((total, currentNum) => total + currentNum);

    current_question++;

    if (current_question < total_questions - 1) {
        grab_questions(current_question);
    }

    selected_option.checked = false;

    if (current_question == total_questions - 1) { 
        next_button.textContent = 'Finish';
    }

    if (current_question == total_questions) { 
        container.style.display = 'none';

        /*
        
        edward: 6, 7, 8, 9, 10 --> 6-10

        nosferatu: 11, 12, 13, 14, 15 --> 11-15

        nandor the relentless: 16, 17, 18, 19, 20 --> 16-20

        dracula: 21, 22, 23, 24, 25 --> 21-25

        lost boys: 26, 27, 28, 29, 30 --> 26-30

        */

        const average = total_score / total_questions;

        if (average < 1.8) { 

            result.innerHTML = 

            `
            <img src="assets/twilight.gif" alt="Edward Cullen">
            <h1 class="final-score">You are Edward Cullen!</h1>

            <div class="summary"> 
            <p style="text-indent: 40px;">Sorry! You're permanently 17, and the cruel hand of god has cast you into high school calculus for all eternity. Purgatory? Hell? Who knows? For some reason, you're fighting with a werewolf to vy for the attention of a teenage girl. Instead of doing literally anything useful, you spend your time sparkling, listening to music, playing baseball, and watching your girlfriend sleep. My advice: Grow up, leave the poor girl alone, and hit the diamond. The Jays need you.</p>
            <button class="restart">Hit Me Again!</button>
            `;
            return;

        }

        else if (average < 2.6) {
            
            result.innerHTML = 

            `<img src="assets/nosferatu.gif" alt="Count Orlok">

            <h1 class="final-score">You are Count Orlok!</h1>

            <div class="summary"> 
            <p style="text-indent: 40px;">Where to begin? Better known as Nosferatu, you're a former wizard that made a pact with Satan for eternal life, and now you're sexually harassing underage girls. You spend your time in caves, planning the next plague and sending psychic messages to your girlfriend. You own a gigantic castle but are too busy to furnish it.<br>For all your flaws, you do have a fantastic collection of fur coats. My advice? Come to Kingston. You'll fit right in!</p>
            <button class="restart">Hit Me Again!</button>
            `;
            return;
        }

        else if (average < 3.4) {
            result.innerHTML = 
            `<img src="assets/glitter.gif" alt="Nandor">
            
            <h1 class="final-score">You are Nandor the Relentless!</h1>

            <div class="summary"> 
            <p style="text-indent: 40px;">Don't tell anyone, but you're my favourite. You're the most unproblematic vampire in Staten Island, usually hanging out with your vampire friends in a sick ass house. You enjoy arts and crafts, creepy paper, and ancient warfare. About 730 years ago, you were a formidable general in the ottoman Empire, but you've since chilled out. You're struggling to adapt to modern life but damn it, you're trying.<br>My advice? Be nicer to Guillermo. He's trying too.</p>
            <button class="restart">Hit Me Again!</button>
            `;
            return; 
        }

        else if (average < 4.2) { 
            result.innerHTML = 
            `
            <img src="assets/martini.gif" alt="Dracula">
            <h1 class="final-score">You are Count Dracula!</h1>

            <div class="summary"> 
            <p style="text-indent: 40px;">Drac! You're so cunty that we still make movies of you, like, 200 years later. Edward could never. A classic vampire, you spend your time skulking around in capes and fancy clothes, searching for real estate opportunities. You've branched out since your humble beginnings in a castle, and I hear you're now running a nice hotel. I would give you advice, but you don't need it. Say hi to Renfield for me.</p>
            <button class="restart">Hit Me Again!</button>
            `;
            return;
        }

        else { 
            result.innerHTML =
            `
            <img src="assets/david.gif" alt="David">
            <h1 class="final-score">You are David (Kiefer Sutherland)!</h1>

            <div class="summary"> 
            <p style="text-indent: 40px;">Despite your influence on vampirism in popular culture, you're a little more niche! Since becoming a vampire, you started a vampire motorcycle gang with obvious homoerotic tension. You spend your time in sunny Santa Carla, terrorizing teenagers and doing sick motorcycle races. You are what every vampire and emo kid aspire to be. My advice to you is to further your polycule and get a better haircut.</p>
            <button class="restart">Hit Me Again!</button>
            `;
            return;
        }

    }

    grab_questions(current_question);
}

function load_previous_question() { 
    current_question--;
    score.pop();
    grab_questions(current_question);
}

function restart_quiz(e) {
  if (e.target.matches('button.restart')) {
    current_question = 0;
    score = [];
    location.reload();
  }
}

grab_questions(current_question);
next_button.addEventListener('click', grab_next_question);
previous_button.addEventListener('click', load_previous_question);
result.addEventListener('click', restart_quiz);