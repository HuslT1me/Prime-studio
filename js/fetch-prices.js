
function fetchPrices(productId, bundleId, oldPriceElem, priceElem, priceTextElem)
{
    $.ajax({
        cache: false,
        url: `/customer/get-product-bundle-info`,
        type: "GET",
        data: { bid: bundleId },
        dataType: "json",
        complete: function(jqXHR, textStatus) { },
        success: function(result) {
            if (typeof result.success != "undefined" && result.success) {
                oldPriceElem.innerText = result.data.price_old;
                priceElem.innerText = result.data.price;
                priceTextElem.innerHTML = result.data.text_info;
            } else {
                alert(result.error);
            }
        },
    });
}
