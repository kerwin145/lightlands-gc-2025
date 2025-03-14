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
function prepareScreen2(houseIdx, brightnessLevel, lighthouseGroup){
    responses = questionAndAnswers[houseIdx]
    screen.tabIndex = 1; 
    screen.focus();
    screen2Listener = (e) => {
        if (lighthouse.classList.contains("bounceUp") || lighthouse.classList.contains("bounceDeny")) 
            return

        let delta = 0;
        if (e.code == 'ArrowUp') delta = 1;
        else if (e.code == 'ArrowDown') delta = -1;
        else return

        if (lighthouseGroup == 1) {
            brightness1[houseIdx] = brightness1[houseIdx] + delta
            if (brightness1[houseIdx] == 7 || brightness1[houseIdx] == -1)
                addBounceDeny()
            else
                addBounce()
            
            brightness1[houseIdx] = Math.min(6, Math.max(0, brightness1[houseIdx]));
            lighthouse.style.filter = brightnessMap[brightness1[houseIdx]]
            $(".questionPreview2").html(questionAndAnswers[hoveringOver1]["question"] + "<br><small>" + "⭐".repeat(brightness1[hoveringOver1]) + "</small>")

        } else if (lighthouseGroup == 2) {
            brightness2[houseIdx] = brightness2[houseIdx] + delta
            if (brightness2[houseIdx] == 7 || brightness2[houseIdx] == -1)
                addBounceDeny()
            else
                addBounce()
            
            brightness2[houseIdx] = Math.min(6, Math.max(0, brightness2[houseIdx]));
            lighthouse.style.filter = brightnessMap[brightness2[houseIdx]]
            $(".questionPreview2").html(questionAndAnswers[hoveringOver2 + 3]["question"] + "<br><small>" + "⭐".repeat(brightness2[hoveringOver2]) + "</small>")
        }
    };

    screen.addEventListener('keyup', screen2Listener);
    canvas.removeEventListener('keyup', screen1Listener)

    $("#lighthouse").get(0).style.filter = brightnessMap[brightnessLevel]
    $("#answers").text("")
    if (lighthouseGroup == 1){
        $(".questionPreview2").html(questionAndAnswers[hoveringOver1]["question"] + "<br><small>" + "⭐".repeat(brightness1[hoveringOver1]) + "</small>")
    }
    if (lighthouseGroup == 2){
        $(".questionPreview2").html(questionAndAnswers[hoveringOver2 + 3]["question"] + "<br><small>" + "⭐".repeat(brightness2[hoveringOver2]) + "</small>")
    }
    $.each(responses["answers"], function(idx, text){
        let newDiv = $("<div>").addClass('answer-single').text(text)
        $(answers_DOM).append(newDiv)
    })
}

