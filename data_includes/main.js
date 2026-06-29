PennController.ResetPrefix(null)

//DebugOff()


function Interleave(expSet, fillerSet, breakSet, nFillers, breakEvery) { //randomly interleave exp sentences and fillers
                                                                         //also insert breaks every X sentences
    this.args = [expSet, fillerSet, breakSet]
    this.runSet = null

    this.run = function(arrays) {
        if (this.runSet !== null) return this.runSet

        let expTrials = arrays[0].slice()  //first array in the array is exps
        let fillerTrials = arrays[1].slice() //second arra in the array is fillers
        let breakTrials = arrays[2].slice()
    

        nFillers = Number(nFillers)  //number of fillers
        breakEvery = Number(breakEvery) //break every X sentnces

        let pickedFillers = [] //pick random fillers from fillers.csv

        for (let i = 0; i < nFillers && fillerTrials.length; i++) {
            let randomIndex = Math.floor(Math.random() * fillerTrials.length)
            pickedFillers.push(...fillerTrials.splice(randomIndex, 1))
        }

        let mixedList = []
        let fillerIndex = 0

        for (let i = 0; i < expTrials.length; i++) {  //alternate filler -- exp -- filler -- exp, etc
            
            if (fillerIndex < pickedFillers.length){
                mixedList.push(pickedFillers[fillerIndex])
                fillerIndex++
            }
            
            mixedList.push(expTrials[i])
            
        }
        
        //if there are any extra fillers, append them at the end
        while (fillerIndex<pickedFillers.length){
            mixedList.push(pickedFillers[fillerIndex])
            fillerIndex++
        }
        
        //insert breaks every X sentneces
        let finalList = [] //we will add mixedlist together with the breaks
        let breakIndex = 0

        
        for (let i=0; i<mixedList.length; i++){
            finalList.push(mixedList[i])
            
            if (
                (i+1)%breakEvery === 0 &&
                breakIndex<breakTrials.length &&
                i<mixedList.length - 1
                ){
                    finalList.push(breakTrials[breakIndex])
                    breakIndex++
                }
        }
        
        this.runSet=finalList
        return finalList
    }
}

function interleave(expSet, fillerSet, breakSet, nFillers, breakEvery) {
    return new Interleave(expSet, fillerSet, breakSet, nFillers, breakEvery)
}

Sequence(
    "instructions",
    interleave(
        seq("exp"), 
        randomize("filler"), 
        seq("break-1", "break-2","break-3","break-4","break-5"),
        48,
        16
    ),
    SendResults(),
    "completion_screen"
)



newTrial("instructions",
    defaultText
        .cssContainer({"margin-bottom": "1em"})
        .center()
        .print()
    ,

    newText("instructions-1", "Welcome!"),
    newText("instructions-2", "In this task, you will read a few sentences."),
    newText("instructions-3", "You will see one word at a time, please press the <b>spacebar</b> to continue to the next word."),
    newText("instructions-4", "Enter your ID below and press the button to start."),

    newTextInput("name_input")
        .cssContainer({"margin-bottom": "1em"})
        .center()
        .print()
    ,
    
    newText("warning", "Please enter your ID before starting.")
        .color("red")
        .center()
        .hidden()
        .print()
    ,

    newButton("start", "Click here to start!")
        .center()
        .print()
        .wait(
            getTextInput("name_input")
                .test.text(/.+/)
                .failure(
                    getText("warning").visible()
                )
        )
            
    ,

    newVar("name")
        .global()
        .set(getTextInput("name_input"))
)






Template("all_runs.csv",    row =>
        newTrial("exp",
            newController("DashedSentence", {s:row.Sentence_String})
                .log()
                .print()
                .wait()
                .remove(),
                
                newButton("Next")
                    .center()
                    .print()
                    .wait()
        )
        .log("type", "exp")
        .log("item","no item name")
        .log("group", row.group)
        .log("condition", row.Structure+"_"+row.VP_Grammaticality+"_"+row.Noun_Congruency)
        .log("Structure", row.Structure)
        .log("VP_Grammaticality", row.VP_Grammaticality)
        .log("Noun_Congruency", row.Noun_Congruency)
        .log("Noun_Gender_Congruency", row.Noun_Gender_Congruency)
        .log("name", getVar("name"))
)

Template("fillers.csv",    row =>
        newTrial("filler",
            newController("DashedSentence", {s:row.Sentence_String})
                .log()
                .print()
                .wait()
                .remove(),
                
                newButton("Next")
                    .center()
                    .print()
                    .wait()
        )
        .log("type", "filler")
        .log("item", row.item)
        .log("group", "NA")
        .log("condition", row.condition)
        .log("Structure", "NA")
        .log("VP_Grammaticality", "NA")
        .log("Noun_Conguency", "NA")
        .log("Noun_Gender_Congruency", "NA")
        .log("name", getVar("name"))
)


//break screens
newTrial("break-1",
    newText("break-text", "You are 1/6 of the way done!")
        .center()
        .print()
    ,
    newButton("continue", "Continue")
        .center()
        .print()
        .wait()
)


newTrial("break-2",
    newText("break-text", "You are 2/6 of the way done!")
        .center()
        .print()
    ,
    newButton("continue", "Continue")
        .center()
        .print()
        .wait()
)


newTrial("break-3",
    newText("break-text", "You are 3/6 of the way done!")
        .center()
        .print()
    ,
    newButton("continue", "Continue")
        .center()
        .print()
        .wait()
)


newTrial("break-4",
    newText("break-text", "You are 4/6 of the way done!")
        .center()
        .print()
    ,
    newButton("continue", "Continue")
        .center()
        .print()
        .wait()
)


newTrial("break-5",
    newText("break-text", "You are 5/6 of the way done!")
        .center()
        .print()
    ,
    newButton("continue", "Continue")
        .center()
        .print()
        .wait()
)



newTrial("completion_screen", 
    newText("thanks", "Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    
    newButton("void", "")
        .wait()     //you never print the button, so it never gets pressed, so wait is never validated, 
                    //so experiment paused forever.

)
