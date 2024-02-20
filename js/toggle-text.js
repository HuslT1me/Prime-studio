const learnBtnLeft = document.querySelector('.learn-btn-l');
const learnBtnRight = document.querySelector('.learn-btn-r');
const learnMoreLeft = document.querySelector('.learn-more-l');
const learnMoreRight = document.querySelector('.learn-more-r');

learnBtnLeft.addEventListener('click', function(event){
    event.preventDefault();
    if (learnBtnLeft.textContent.toLowerCase() == 'узнайте больше') {
        learnBtnLeft.textContent = 'свернуть';
    } else if(learnBtnLeft.textContent.toLowerCase() == 'свернуть') { 
        learnBtnLeft.textContent = 'узнайте больше';
    }
    learnMoreLeft.classList.toggle('learn-more--active')
})

learnBtnRight.addEventListener('click', function(event){
    event.preventDefault();
    if (learnBtnRight.textContent.toLowerCase() == 'узнайте больше') {
        learnBtnRight.textContent = 'свернуть';
    } else if(learnBtnRight.textContent.toLowerCase() == 'свернуть') { 
        learnBtnRight.textContent = 'узнайте больше';
    }
    learnMoreRight.classList.toggle('learn-more--active')
})