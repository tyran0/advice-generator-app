if (document.readyState === 'interactive') {
    updateAdvice(); // Load advice for the first time
    handleAdviceDice('.advice_dice');
}

function getAdviceSlip() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('https://api.adviceslip.com/advice');
            
            const reader = res.body.getReader();
            const data = await reader.read(res.body);
            
            const json = JSON.parse(
                new TextDecoder().decode(data.value));
            resolve(json.slip);
        } catch (err) {
            reject(err);
        }
    });
}

function updateAdvice() {
    const advice = document.querySelector('.advice');
    if (!advice) return;

    const adviceID = advice.querySelector('.advice_id');
    const adviceQuote = advice.querySelector('.advice_quote');
    getAdviceSlip().then(slip => {
        adviceID.innerText = slip.id;
        adviceQuote.innerText = slip.advice;
    });
}

function handleAdviceDice(selector) {
    const element = document.querySelector(selector);
    const className = selector.replace('.', '');

    element.addEventListener('click', function() {
        this.classList.toggle(`${className}-rotate`);
        this.classList.add(`${className}-scale`);
        updateAdvice();
    });

    element.addEventListener('transitionend', function(e) {
        if (e.propertyName === 'scale') {
            this.classList.remove(`${className}-scale`);
        } else return;
    });
}