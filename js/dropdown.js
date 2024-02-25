let select = function () {
    let selectHeader = document.querySelectorAll('.select__header');
    let selectItem = document.querySelectorAll('.select__item');
  
    selectHeader.forEach(item => {
        item.addEventListener('click', selectToggle)
    });
  
    selectItem.forEach(item => {
        item.addEventListener('click', selectChoose)
    });
    
    window.addEventListener("click", (evt) => {
        if(!evt.target.closest('.select')) {
        const selectList = Array.from(document.querySelectorAll('.select'));
        selectList.forEach(sel => {
            sel.classList.remove('is-active');
        })
        } 
    })
        

    function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }
  
    function selectChoose() {
        let text = this.innerText,
            select = this.closest('.select'),
            currentElem = select.querySelector('.select__current');
            currentElem.innerText = text;
            currentElem.dataset.value = this.dataset.value;
        const wrapperSelect = this.closest('.js-selected-wrapper');
        const currentPriceElem = wrapperSelect.querySelector('.price-current');
        const oldPriceElem = wrapperSelect.querySelector('.old-price');
        select.classList.remove('is-active');
        if(this.closest('.select-yoga')) {
            const category = currentElem.dataset.category;
            const value = currentElem.dataset.value;
            fetchPrices(category, value, oldPriceElem, currentPriceElem);
        } else if(this.closest('.select-pilates')) {
            const category = currentElem.dataset.category;
            const value = currentElem.dataset.value;
            fetchPrices(category, value, oldPriceElem, currentPriceElem);
        }
    }
  };

  select();
  
  
  