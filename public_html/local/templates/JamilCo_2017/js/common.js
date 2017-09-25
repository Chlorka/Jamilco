(function ($) {
    $('#datepicker')
        .datepicker({
            dateFormat: 'd M',
            altFormat: 'yy m d',
            altField: '#datepickerAlt'
        })
        .datepicker($.datepicker.regional['ru']);

    var objTrain = {},
        $listTrains = $('#trainTable'), // таблица списока поездов
        places = 40;

// Выпадающие списки - header
    var $sForm = $('#searchForm'),
        $sFormFrom = $('#inputFrom'),
        $sFormTo = $('#inputTo');

// список городов для селекта
    var arrCity = {}; arrCity.from = []; arrCity.to = [];

    $listTrains.find('.itemTrain').each(function (i) {
        var $this = $(this),
            dataTrain = $this.find('td a.nameTrain'),
            nameTrain = dataTrain.text(),
            arrName = nameTrain.split('-'),
            dataFrom = dataTrain.attr('data-from'),
            dataTo = dataTrain.attr('data-to'),
            timeDepart,
            timeArrive,
            $td = $this.find('td');

        arrCity.from.push({'id': dataFrom, 'name': arrName[0]});
        arrCity.to.push({'id': dataTo, 'name': arrName[1]});

        timeDepart = $td.eq(3).children('span').text();
        timeArrive = $td.eq(4).children('span').text();
        $td.eq(3).children('span').after(formatDate(timeDepart));
        $td.eq(4).children('span').after(formatDate(timeArrive));
        showFreePlaces();

    });

// выбор города из списка
    $sForm.on('click', 'label', function () {
        /*$sForm.find('ul.open').slideUp('300', function(){
         $(this).toggleClass('open');
         });*/
        var $this = $(this),
            $parentID = $this.parent('div'),
            $ul = $parentID.find('.selectForm'),
            $li;
        $ul.on('click', 'li', function () {
            $li = $(this);

            buildSelectForm($parentID.attr('id'), $li.attr('data-city'));

            $this.html($li.text() + '<i>' + $li.attr('data-city') + '</i>');
            $ul.slideUp('300', function () {
                $(this).toggleClass('open');
            });
            return false;
        });
        $ul.slideDown('300', function () {
            $(this).toggleClass('open');
        });
    });

// --- Выстраиваем списки (на входе родительский div и код города)
    buildSelectForm('inputTo');
    buildSelectForm('inputFrom');
    function buildSelectForm(idDiv, dataCity) {
        var divSelect,
            arrListCity;

        if (idDiv == 'inputTo') {
            divSelect = $sFormTo;
            arrListCity = arrCity.to;
        }
        else if (idDiv == 'inputFrom') {
            divSelect = $sFormFrom;
            arrListCity = arrCity.from;
        }

        for (var j = 0; j < arrListCity.length; j++) {
            if (divSelect.find('li[data-city="' + arrListCity[j].id + '"]').length < 1
            ) {
                divSelect.find('.selectForm')
                    .append('<li class="item" data-city="' + arrListCity[j].id + '">' + arrListCity[j].name + '</li>');
            }
        }

        if (dataCity) {
            var dublSelect;
            $sForm.find('li').show();
            if (idDiv == 'inputTo') {
                dublSelect = $sFormFrom.find('label.from i').text();
                $sFormTo.find('li[data-city="' + dublSelect + '"]').hide();
                $sFormFrom.find('li[data-city="' + dataCity + '"]').hide();
            }
            else if (idDiv == 'inputFrom') {
                dublSelect = $sFormTo.find('label.to i').text();
                $sFormFrom.find('li[data-city="' + dublSelect + '"]').hide();
                $sFormTo.find('li[data-city="' + dataCity + '"]').hide();
            }
        }
    }

// --- Сброс фильтра
    $sForm.on('click', '.clearFilter', function () {
        $sFormFrom.find('label').html('<span>Пункт отправления:</span><i></i>');
        $sFormTo.find('label').html('<span>Пункт прибытия:</span><i></i>');
        $('#datepicker').val('');
        $('#datepickerAlt').val('');
        $listTrains.find('tr.itemTrain').show();
        $(this).toggleClass('hide');
    });

// --- Формируем выбранный поезд
    $listTrains.on('click', 'tr.itemTrain', function () {
        var $this = $(this),
            $td = $this.find('td');
        objTrain.id = $this.attr('data-id');
        objTrain.trainID = $td.eq(0).text();
        objTrain.trainNAME = $td.find('a.nameTrain').text();
        objTrain.trainWAY = $td.eq(2).text();
        objTrain.dataFrom = $td.eq(3).text();
        objTrain.dataTo = $td.eq(4).text();
        objTrain.dataFromNew = formatDate(objTrain.dataFrom);
        objTrain.dataToNew = formatDate(objTrain.dataTo);
        objTrain.places = [];
        openMapTrain($this, 300);
    });

// --- закрытие / открытие строк с поездами
    function openMapTrain(trTrain, animationTime) {
        var $trTrain = trTrain,
            $containerTrain = $trTrain.next().find('.containerTrain'),
            $heightMap = $containerTrain.find('.areaTrain').outerHeight(),
            $openTR = $listTrains.find('.itemTrain.open');

        $openTR // находим и закрываем любую открытую вкладку
            .next()
            .find('.containerTrain')
            .animate({
                height: 0
            }, animationTime, 'linear', function () {

                $openTR.toggleClass('open close');
            });
        if ($trTrain.hasClass('close')) {
            $containerTrain
                .animate({
                    height: $heightMap
                }, animationTime, 'linear', function () {
                    $trTrain.toggleClass('open close');
                })
                .find('.cupeList i').each( // проставляем нумерацию мест
                function (index, value) {
                    var num = ++index > 9 ? index : '0' + index;
                    $(this).html(num).attr('data-place', index);
                });
        }
        return false;
    }

// --- Обработка клика по месту
    $listTrains.on('click', 'i[class != desabled]', function () {
        var el = $(this),
            place = el.attr('data-place'),
            $mapTrain = el.parents('div.mapTrain'),
            action = true,
            arrPlace = [],
            $formTicket;

        if (el.hasClass('select')) { // если метка снимается - удаляем поля
            action = false;
        }
        el.toggleClass('select');

        $mapTrain.find('i.select').each(function () {
            arrPlace[$(this).attr('data-place')] = $(this).text(); // формируем массив из выбранных
        });
        arrPlace = arrPlace.sort().filter(function (e) {
            return e
        }); // избавляемся от пустых

        objTrain.places[place] = {'id': place};
        objTrain.places.arrPlace = arrPlace;

        if (action == false) {
            deleteTicketForm($mapTrain, arrPlace, place); // удаляем поля формы
        }
        else {
            $formTicket = $mapTrain.parents('div.areaTrain').next();
            addTicketForm($formTicket, arrPlace, place); // добавляем поля формы
        }
        showStrPlace($mapTrain, arrPlace, place); // переписываем строку мест
    });

// --- Обновление мест строка
    function showStrPlace(map, arrPlace) {
        var $numPlaces = arrPlace.length,
            $strPlace = map.next().find('.numPlace'),
            $titlePlace = $strPlace.prev(),
            str = '';

        if ($numPlaces == 0) {
            $titlePlace.html('Выберите места в вагоне');
            str = '';
        }
        else if ($numPlaces == 1) {
            $titlePlace.html('Вы выбрали');
            str = arrPlace + ' место';
        }
        else {
            str = arrPlace + ' места';
        }
        $strPlace.html(str);
        return str;
    }


// --- Удаление полей из формы заказа билета
    function deleteTicketForm(mapTrain, arrPlace, place) {
        delete objTrain.places[place];
        var $formTicket;
        $formTicket = mapTrain.parents('div.areaTrain').next();
        $formTicket.find('div#person-' + place).remove();
        if (arrPlace.length < 1) $formTicket.html('');
    }


// --- Добавление полей в форму заказа билета
    function addTicketForm(formTicket, arrPlace, place) {
        var $form = formTicket,
            numPlaces = arrPlace.length,
            j = numPlaces - 1,
            formHtml = '',
            fieldsHtml = '',
            $containerTrain = $form.parent();
        $containerTrain.height('auto');

        j = place;
        fieldsHtml = '<div class="person" id="person-' + j + '">' +
        '<div class="col-input"><input type="text" value="" class="phone req" name="[surname][' + j + ']" placeholder="Фамилия"/></div>' +
        '<div class="col-input"><input type="text" value="" class="req" name="[name][' + j + ']" placeholder="Имя"/></div>' +
        '<div class="col-input"><input type="text" value="" name="[secondname][' + j + ']" placeholder="Отчество"/></div>' +
        '<div class="col-input"><input type="text" value="" class="birthData req" name="[birthday][' + j + ']" placeholder="Дата рождения"/></div>' +
        '<div class="col-input"><input type="text" value="" name="[gov][' + j + ']" placeholder="Гражданство"/></div>' +
        '<div class="col-input"><input type="text" value="" name="[doc][' + j + ']" placeholder="Серия и № документа"/></div>' +
        '<div class="col-input"><input type="text" value="" name="[date_doc][' + j + ']" placeholder="Действует до"/></div>' +
        '<div class="gender"> ' +
        '<input type="radio" class="req" name="[pol][' + j + ']" id="M' + j + '" value="M" placeholder="Пол пассажира"/><label for="M' + j + '">М</label> ' +
        '<input type="radio" class="req" name="[pol][' + j + ']" id="G' + j + '" value="Ж" placeholder="Пол пассажира"/><label for="G' + j + '">Ж</label> ' +
        '</div> ' +
        '<br><span>' + j + '</span>' +
        '</div>';

        if (numPlaces == 1) {
            formHtml = '<form action="/ticket_ajax.php" class="checkForm"><div class="user">' +
            '<div class="col-input"><input type="text" value="" class="phoneInput req" title="Номер телефона" name="form_text_1" placeholder="Телефон"/></div>' +
            '<div class="col-input"><input type="email" value="" class="email req" name="form_email_2" placeholder="E-mail"/></div>' +
            '</div>' +
            '<input class="btn-pink" type="submit" name="send" value="Забронировать" />' +
            '</form>';
            $form.html(formHtml);
            $form.find('.user').after(fieldsHtml);
        }
        if (numPlaces > 1) {
            $form.find('.user').after(fieldsHtml);
        }
        $form.find('.phoneInput').each(function () {
            $(this).mask('*(999) 999-9999')
        });
        $form.find('.birthData').each(function () {
            $(this).mask('99/99/9999')
        });
    }

// --- Форма поиска
    $sForm.on('submit', 'form', function (e) {
        e.preventDefault();
        var $openTR = $listTrains.find('.itemTrain.open'),
            labelFrom = $sFormFrom.find('label i').text(),
            labelTo = $sFormTo.find('label i').text(),
            labelTime = $('#datepickerAlt').val(),
            strFind = '',
            clearFilter = $('.clearFilter');

        if (labelFrom.length > 2) {
            strFind = strFind + '[data-from="' + labelFrom + '"]';
        }
        if (labelTo.length > 2) {
            strFind = strFind + '[data-to="' + labelTo + '"]';
        }
        if (labelTime) {
            var newDate,
                dateReg = /(\d{4}) (\d{1,2}) (\d{1,2})/;

            newDate = dateReg.exec(labelTime);
            if (newDate[2].length < 2) {
                newDate[2] = '0' + newDate[2];
            }
            if (newDate[3].length < 2) {
                newDate[3] = '0' + newDate[3];
            }
            newDate = newDate[1] + newDate[2] + newDate[3];
            strFind = strFind + '[data-time="' + newDate + '"]';
        }

        if (clearFilter.hasClass('hide') && strFind.length > 1)
            clearFilter.toggleClass('hide');

        openMapTrain($openTR, 200);

        $listTrains.find('tr.itemTrain').hide();
        $listTrains.find('a' + strFind)
            .parents('.itemTrain')
            .show();
    });

// --- Форма заказа
    $listTrains.on('submit', 'form', function (e) {
        e.preventDefault();
        var t = $(this),
            flagError = 0,
            formTicket = t.parents('.formTicket'),
            containerTrain = t.parents('.containerTrain'),
            mapTrain = containerTrain.find('.mapTrain'),
            textError;

        t.find('.error p').remove();
        t.find('.error').removeClass('error');

        t.find('input[type="text"].req').each(function () {
            var $this = $(this);
            if ($this.val().trim() == '') {
                textError = 'заполните поле';
                $this.val('');
                $this.parent()
                    .addClass('error')
                    .append('<p>' + textError + '</p>');
                flagError++;
            }
        });

        t.find('input[type="email"].req, input[type="text"].email.req').each(function () {
            var $this = $(this),
                pattern = /^[-0-9a-z_.]+@[-0-9a-z^.]+.[a-z]{2,6}/g;
            if (pattern.test($this.val())) {
                $this.parent().removeClass('error');
            }
            else {
                textError = 'заполните корректно e-mail';
                $this.parent()
                    .addClass('error')
                    .append('<p>' + textError + '</p>');
                flagError++;
            }
        });

        t.find('.gender').each(function () {
            var $gender = $(this),
                check = false;
            $gender.find('input[type="radio"].req').each(function () {
                if ($(this)[0].checked == true) {
                    check = true;
                    $gender.removeClass('error');
                }
            });
            if (check != true) {
                textError = 'укажите пол';
                $gender.addClass('error');
                $gender.append('<p>' + textError + '</p>');
                flagError++;
            }
        });
        if (flagError == 0) {
            var data = t.serializeArray(),
                strTextarea = '';

            $.each(objTrain.places.arrPlace, function (pls, valPls) {
                strTextarea = strTextarea + 'Билет №: ' + valPls + '\n';
            });
            strTextarea = strTextarea + '---------------------\n';

            $.each(data, function (id, value) {
                strTextarea = strTextarea + t.find('input[name="' + data[id].name + '"]')
                    .attr('placeholder') + ': ' + data[id].value + '\n';
            });

            data.push({'name': 'sessid', 'value': $('#sessid').val()});
            data.push({'name': 'WEB_FORM_ID', 'value': '1'});
            data.push({'name': 'ajax', 'value': 'Y'});
            data.push({'name': 'web_form_apply', 'value': 'Y'});
            data.push({'name': 'web_form_submit', 'value': 'Отправить'});
            data.push({'name': 'form_textarea_3', 'value': strTextarea});
            $.ajax({
                type: 'POST',
                url: t.attr('action'),
                data: data
            }).done(function () {
                alert('Ваши места забронированы');
                orderTicket(mapTrain);
                clearTicket(formTicket, mapTrain);
            });
        }
        return false;
    });

// --- Зачистка
    function clearTicket(formTicket, mapTrain) {
        var arrAll = [];
        objTrain.places = [];
        objTrain.places.arrPlace = [];
        formTicket.html('');

        showStrPlace(mapTrain, arrAll);
        return false;
    }

// ----- Актуализируем количество свободных мест
    function showFreePlaces() {
        $listTrains.find('tr.itemTrain').each(function () {
            var freePlaces = places - $(this).next().find('i.desabled').length,
                n = freePlaces,
                strFreePlace = '',
                $td = $(this).find('td');

            if ((n === 1) || (n > 20 && n % 10 === 1)) strFreePlace = n + ' место';
            else if ((n >= 2 && n <= 4)
                || (n > 20 && n % 10 >= 2 && n % 10 <= 4)
            ) strFreePlace = n + ' места';
            else if (n > 0) {
                strFreePlace = n + ' мест';
                $td.eq(6).children('a.btn-blue').removeClass('desabled');
            }
            else if (n == 0) {
                strFreePlace = 'мест нет';
                $td.eq(6).children('a.btn-blue').addClass('desabled').html('Билетов нет');
            }
            $td.eq(5).html(strFreePlace);
        });
    }

// --- Бронирование билетов
    function orderTicket(mapTrain) {
        for (var i = 0; i < objTrain.places.length; i++) { // деактивация выбранных мест
            if (objTrain.places[i] !== undefined) {
                mapTrain.find('i[data-place="' + objTrain.places[i].id + '"]')
                    .removeClass('select')
                    .addClass('desabled');
            }
        }

        var arrData = [],
            arrTickets = [];
        $.each(objTrain.places.arrPlace, function (pls, valPls) {
            arrTickets.push(valPls);
        });
        arrData.push({'name': 'ajax', 'value': 'Y'});
        arrData.push({'name': 'iblock', 'value': '1'});
        arrData.push({'name': 'newTickets', 'value': arrTickets});
        arrData.push({'name': 'numTrain', 'value': objTrain.id});

        $.ajax({ // обновление свойства купленного билета/ов для битрикса
            type: 'POST',
            url: '/ticket_ajax.php',
            data: arrData
        }).done(function (html) {
             //console.log(html);
        });

        showFreePlaces(); // пересчет свободных мест
    }

// --- Обработка даты
    function formatDate(date) {
        var newDate,
            formatDate,
            nowDate = new Date(),
            nowDay = nowDate.getDate(),
            month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        var dateReg = /(\d{4})(\d{1,2})(\d{1,2})(\d{1,2})(\d{1,2})/;
        newDate = dateReg.exec(date);
        if (nowDay == newDate[3]) {
            formatDate = newDate[4] + ':' + newDate[5];
        }
        else if (nowDay + 1 == newDate[3]) {
            formatDate = newDate[4] + ':' + newDate[5] + ', завтра';
        }
        else {
            formatDate = newDate[4] + ':' + newDate[5] + ', ' + newDate[3] + ' ' + month[newDate[2] - 1];
        }
        return formatDate;
    }

    $('table').tablesorter({ // сортировка
        headers: {
            0: {sorter: false},
            2: {sorter: false},
            5: {sorter: false},
            6: {sorter: false}
        },
        sortList: [[3, 1]],
        debug: false
    }).bind('sortEnd', function () { // выстраиваем карты в соответствии с поездами
        $listTrains.find('.itemTrain').each(function () {
            var trMap = $listTrains.find('#' + $(this).attr('id') + '-map').remove();
            trMap.insertAfter('#' + $(this).attr('id'));
        });
    });

})(jQuery);