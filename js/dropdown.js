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
            productBox = this.closest('.product_box'),
            select = productBox.querySelector('.select'),
            currentElem = productBox.querySelector('.select__current');
            btnPay = productBox.querySelector('.open-pay-card-callback-popup');
        currentElem.innerText = text;
        currentElem.dataset.bundele_id = this.dataset.bundele_id;

        const currentPriceElem = productBox.querySelector('.price-current');
        const oldPriceElem = productBox.querySelector('.old-price');
        const priceTextElem = productBox.querySelector('.offers__price-text');
        select.classList.remove('is-active');

        btnPay.dataset.bundle_id = this.dataset.bundele_id;
        btnPay.dataset.bundle_title = text;

        fetchPrices(
            currentElem.dataset.product_id,
            currentElem.dataset.bundele_id,
            oldPriceElem,
            currentPriceElem,
            priceTextElem
        );
    }
};

select();
