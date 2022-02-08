let words = [],
    word 
getWords().then(rsp => {
    words = rsp.split('\n')
    word = words[Math.floor(Math.random() * words.length)]
})
function getWords() {
    return new Promise(resolve => {
        let request = new XMLHttpRequest()
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status != 200) alert('Kann Wörter nicht auslesen.')
                resolve(request.responseText)
            }
        }
        request.open(
            'GET', 
            'words.txt',
            true
        )
        request.send()
    }) 
}
window.onload = () => {
    function countLetters(letter, text, n) {
        var i = 0
        for (var j = 0; j <= n; j++) {
            if (letter == text[j]) i++
        }
        return i
    }
    function onKeyPress(event)  {  
        if (event.target.classList.contains('disabled')) return
        let letter  = event.target.innerText,
        focused = document.querySelector('body>gameBoard>word>letter.focused')
        focused.innerText = letter

        focused.classList.remove('focused')

        if (focused.nextElementSibling) focused = focused.nextElementSibling
        else {
            let parent = focused.parentElement,
            siblings = parent.querySelectorAll('letter'),
            guess = ''
            siblings.forEach(sibling => {guess += sibling.innerText})

            if (!words.includes(guess)) {
                siblings[4].classList.add('focused')
                siblings[0].click()
                return
            }

            for (var i in word) {
                let sibling = siblings[i]
                if (word.includes(guess[i])) {
                    if (word[i] == guess[i]) sibling.classList.add('true') 
                    else {
                        let correctGuesses = 0,
                            correctGuessesBefore = 0
                        for (var j in word) {
                            if (guess[j] == word[j] && guess[j] == guess[i]) {
                                correctGuesses++
                                if (j < i) correctGuessesBefore++
                            }
                        }
                        let letterCountGuess = countLetters(guess[i], guess, i),
                            letterCountWord = countLetters(guess[i], word, word.length)
                        if (letterCountGuess - correctGuessesBefore <= letterCountWord - correctGuesses) sibling.classList.add('position')
                        else sibling.classList.add('false')
                    }
                } 
                else {
                    sibling.classList.add('false')
                    let key = [...keys].filter(key => key.innerText == guess[i])[0]
                    if (!key.classList.contains('disabled')) key.classList.add('disabled')
                }
            }
            focused = parent.nextElementSibling.querySelector('letter')
        }
        focused.classList.add('focused')
    }
    let keys = document.querySelectorAll('body>keyBoard>keyRow>key')
    keys.forEach(key => {
        key.addEventListener('click', onKeyPress)
        key.addEventListener('touchstart', onKeyPress, {passive:true})
        key.addEventListener('touchmove', event => event.preventDefault(), {passive:true})
        key.addEventListener('touchend', event => event.preventDefault())
    })
    
    function isFocusedAfter(target) {
        let sibling = target.nextElementSibling
        while (sibling) {
            if (sibling.classList.contains('focused')) {
                sibling.classList.remove('focused')
                return true
            }
            sibling = sibling.nextElementSibling
        }
        return false
    }
    function removeLettersAfter(target) {
        let sibling = target
        while (sibling) {
            sibling.innerText = ''
            sibling = sibling.nextElementSibling
        }
        target.classList.add('focused')
    }
    function onLetterPress(event) {
        if (isFocusedAfter(event.target)) removeLettersAfter(event.target)
    }
    let letters = document.querySelectorAll('body>gameBoard>word>letter')
    letters.forEach(letter => letter.addEventListener('click', onLetterPress), {passive:true})
}
window.onwheel = event => {event.preventDefault()}
