$(document).ready(function () {
    LoadJSON();
    DropDown();
});

function LoadJSON() {
    $.getJSON("resources/json/store.json",
        function (data, textStatus, jqXHR) {
            $.each(data["products"], function (i, v) {
                let obj = $(`
                <div class="card col-4 p-0" data-index="${i}">
                    <img src="resources/images/${v.photo}" class="card-img-top" alt="${v.product_name}" title="${v.product_name}">
                    <div class="card-body">
                        <h5 class="card-title product-name">${v.product_name}</h5>
                        <p class="card-text brand-name">${v.brand_name}</p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted price">${v.price}</small>
                    </div>
                </div>`);

                obj.draggable({
                    revert: true
                });

                obj.css({
                    "z-index": 1
                });

                $("#product-list").append(obj);
                $("#msg-empty").hide();
            });
        }
    );
}

function DropDown() {
    $("#drop-down").droppable({
        drop: function (e, item) {
            item = $(item.draggable);
            let index = item.data('index');
            let img = item.find('img');
            let productName = item.find('.product-name').text();
            let brandName = item.find('.brand-name').text();
            let price = item.find('.price').text();

            let checkobj = $(`#basket-list [data-index=${index}]`);

            if(checkobj.length){
                let count = $(checkobj).find("input[type='number']").val();

                $(checkobj).find("input[type='number']").val(++count);

                checkobj.find('.sum').text(Number(price) * count);

                UpdateSum();
                return;
            }

            var newItem = $(`
            <div class="card-deck">
                <div class="card mb-3" style="max-width: 540px;" data-index="${index}">
                    <div class="row">
                        <div class="col-4 overflow-hidden">
                            <img src="${img.attr('src')}" class="card-img h-100 w-auto" alt="${productName}" title="${productName}">
                        </div>
                        <div class="col-7">
                            <div class="card-body">
                            <h5 class="card-title product-name">${productName}</h5>
                            <p class="card-text brand-name">${brandName}</p>
                            <p class="card-text"><small class="price">${price}</small></p>
                            <p class="card-text">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">수량</span>
                                    </div>
                                    <input type="number" min="1" value="1" class="form-control number"">
                                </div>
                            </p>
                            <p class="card-text">합계 <span class="sum">${price}</span>원</p>
                            </div>
                        </div>
                        <button type="button" class="btn-light btn-outline-primary col-12 btn-delete">제거</button>
                    </div>
                </div>
            </div>
            `);

            newItem.find("input[type='number']").on('keyup change', function() {
                var sum = Number(price) * $(this).val();
                newItem.find('.sum').text(sum);

                UpdateSum();
            });

            newItem.find('button.btn-delete').on('click', function() {
                newItem.remove();
                UpdateSum();
            });

            $('#basket-list').append(newItem);
            UpdateSum();
        }
    });
}

function UpdateSum() {
    var sum = 0;

    $('#basket-list .sum').each(function() {
        sum += Number($(this).text());
    });

    $('#sum').text(sum);
}

function UpdateSearch(str) {
    var result = false;

    $('#product-list > div').each(function () {
        var productName = $(this).find('.product-name');
        var brandName = $(this).find('.brand-name');

        if (str === '') {
            $(this).show();
            $('#msg-empty').hide();
            result = true;
            return;
        } else {
            $(this).hide();
        }

        if (productName.text().indexOf(str) !== -1) {
            var pnHighlight = productName.text().replace(str, `<span class='highlight'>${str}</span>`);
            productName.html(pnHighlight);
            $(this).css('display', 'block');
            result = true;
        }

        if (brandName.text().indexOf(str) !== -1) {
            var bnHighlight = brandName.text().replace(str, `<span class='highlight'>${str}</span>`);
            brandName.html(bnHighlight);
            $(this).css('display', 'block');
            result = true;
        }
    });

    if (result) {
        $('#msg-empty').hide();
    } else {
        $('#msg-empty').show();
    }
}