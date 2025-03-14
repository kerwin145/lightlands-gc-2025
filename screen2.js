const screen = document.querySelector("#screen2")
const lighthouse = document.querySelector('#lighthouse')
const answers_DOM = document.querySelector('#answers')
lighthouse.addEventListener("dblclick", ()=>{switchScreen('screen1'); prepareScreen1()})

function addBounce(){
    lighthouse.classList.add("bounceUp");
    setTimeout(() => {
        lighthouse.classList.remove("bounceUp");
    }, 500);
}

function addBounceDeny(){
    lighthouse.classList.add("bounceDeny");
    setTimeout(() => {
        lighthouse.classList.remove("bounceDeny");
    }, 300); 
}

function updateBrightnessScreen2(lighthouseGroup, houseIdx, ansIdx, delta){
    if (lighthouseGroup == 1) {
        brightness1[houseIdx] = brightness1[houseIdx] + delta
        if (brightness1[houseIdx] == 7 || brightness1[houseIdx] == -1)
            addBounceDeny()
        else
            addBounce()
        
        brightness1[houseIdx] = Math.min(6, Math.max(0, brightness1[houseIdx]));
        lighthouse.style.filter = brightnessMap[brightness1[houseIdx]]
        $(".questionPreview2").html(questionAndAnswers[houseIdx]["question"] + "<br><small>" + "⭐".repeat(brightness1[houseIdx]) + "</small>")
        if (delta == 1)
            answered1[houseIdx][ansIdx] = true
        else
            answered1[houseIdx][ansIdx] = false
        localStorage.setItem("answered1", JSON.stringify(answered1));
    } else if (lighthouseGroup == 2) {
        brightness2[houseIdx] = brightness2[houseIdx] + delta
        if (brightness2[houseIdx] == 7 || brightness2[houseIdx] == -1)
            addBounceDeny()
        else
            addBounce()
        
        brightness2[houseIdx] = Math.min(6, Math.max(0, brightness2[houseIdx]));
        lighthouse.style.filter = brightnessMap[brightness2[houseIdx]]
        $(".questionPreview2").html(questionAndAnswers[houseIdx + 3]["question"] + "<br><small>" + "⭐".repeat(brightness2[houseIdx]) + "</small>")
        if (delta == 1)
            answered2[houseIdx][ansIdx] = true
        else
            answered2[houseIdx][ansIdx] = false
        localStorage.setItem("answered2", JSON.stringify(answered2));
    }
}

function prepareScreen2(houseIdx, brightnessLevel, lighthouseGroup){
    responses = questionAndAnswers[houseIdx + lighthouseGroup == 2 ? 3 : 0]
    screen.tabIndex = 1; 
    screen.focus();
    screen2Listener = (e) => {
        if (e.code === 'Escape'){
            switchScreen('screen1');
            prepareScreen1();
        }
    };

    screen.addEventListener('keyup', screen2Listener);
    canvas.removeEventListener('keyup', screen1Listener)

    $("#lighthouse").get(0).style.filter = brightnessMap[brightnessLevel]
    $("#answers").html("")
    if (lighthouseGroup == 1){
        $(".questionPreview2").html(questionAndAnswers[houseIdx]["question"] + "<br><small>" + "⭐".repeat(brightness1[houseIdx]) + "</small>")
    }
    if (lighthouseGroup == 2){
        $(".questionPreview2").html(questionAndAnswers[houseIdx + 3]["question"] + "<br><small>" + "⭐".repeat(brightness2[houseIdx]) + "</small>")
    }
    $.each(responses["answers"], function(idx, text){
        let newDiv = $("<div>").addClass('answer-single').text(text)
        if((lighthouseGroup == 1 && answered1[houseIdx][idx])
            || (lighthouseGroup == 2 && answered2[houseIdx][idx]))
            newDiv.addClass('answer-chosen')

        newDiv.on('click', ()=>{
            let currentlySelected = newDiv.hasClass("answer-selected")
            let alreadAnswered = newDiv.hasClass("answer-chosen")
            if (!alreadAnswered){
                if(!currentlySelected){
                    $('.answer-single').each(function(){
                        $(this).removeClass("answer-selected")
                        $(this).addClass("answer-hide")
                    })
                    newDiv.removeClass("answer-hide")
                    newDiv.addClass("answer-selected")
                    updateBrightnessScreen2(lighthouseGroup, houseIdx, idx, 1)
                }
                else{
                    $('.answer-single').each(function(){
                        $(this).removeClass("answer-selected")
                        $(this).removeClass("answer-hide")
                    })
                    newDiv.addClass("answer-chosen")
                }
            }
            else{
                newDiv.removeClass("answer-chosen")
                updateBrightnessScreen2(lighthouseGroup, houseIdx, idx, -1)
            }
        })
        $(answers_DOM).append(newDiv)
    })
}

