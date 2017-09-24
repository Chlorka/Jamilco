(function($){

    $( "#datepicker" )
        .datepicker( $.datepicker.regional[ "ru" ] )
        .datepicker( "option", "dateFormat", "d M" );

    var objTrain = {},
        $listTrains = $('#trainTable'), // таблица списока поездов
        places = 40;

/* ----- Выпадающие списки - header  ----- */
    var $sForm = $('#searchForm'),
        $sFormFrom = $('#inputFrom'),
        $sFormTo = $('#inputTo');

    $sForm.on('click', 'label', function(){
        /*$sForm.find('ul.open').slideUp('300', function(){
         $(this).toggleClass('open');
         });*/
        var $this = $(this),
            $ul = $this.next(),
            $parentID = $this.parent(),
            $li;
            $ul.children('li').click(function(){
                $li = $(this);
                
                buildSelectForm($parentID.attr('id'),$li.attr("data-city"));

                $this.html($li.text() + '<i>' + $li.attr("data-city") + '</i>');
                $ul.slideUp('300', function(){
                    $(this).toggleClass('open');
                });
                return false;
            });
            $ul.slideDown('300', function(){
                $(this).toggleClass('open');
            });
        return false;
    });


    /* список городов для селекта */

    var arrCity = {};
        arrCity.from = [];
        arrCity.to = [];

    $listTrains.find('.itemTrain').each(function(i){
        var $this = $(this),
            dataTrain = $this.find('td a.nameTrain'),
            nameTrain = dataTrain.text(),
            arrname = nameTrain.split('-'),
            dataFrom = dataTrain.attr('data-from'),
            dataTo = dataTrain.attr('data-to'),
            timeDepart,
            timeArrive;


            arrCity.from.push({"id": dataFrom, "name" : arrname[0]});
            arrCity.to.push({"id": dataTo, "name" : arrname[1]});

            timeDepart = $this.find('td').eq(3).children('span').text();
            timeArrive = $this.find('td').eq(4).children('span').text();
            $this.find('td').eq(3).children('span').after(formatDate(timeDepart));
            $this.find('td').eq(4).children('span').after(formatDate(timeArrive));
            showFreePlaces();

    });


    /* ----- обработка даты ----- */
    function formatDate(date) {
        var newDate,
            formatDate,
            nowDate = new Date(),
            nowDay = nowDate.getDate(),
            month = [ "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря" ];
        var dateReg = /(\d{4})(\d{1,2})(\d{1,2})(\d{1,2})(\d{1,2})/;
        newDate = dateReg.exec(date);
        if(nowDay == newDate[3]) {
            formatDate = newDate[4] + ':' + newDate[5];
        }
        else if(nowDay+1 == newDate[3]) {
            formatDate = newDate[4] + ':' + newDate[5]+', завтра';
        }
        else {
            formatDate = newDate[4] + ':' + newDate[5] + ', ' + newDate[3] + ' ' + month[newDate[2] - 1];
        }
        return formatDate;
    }


    buildSelectForm('inputTo');
    buildSelectForm('inputFrom');
    function buildSelectForm(idDiv, dataCity) {
        var divSelect,
            arrListCity;

        if(idDiv == 'inputTo') {
            divSelect = $sFormTo;
            arrListCity = arrCity.to;
        }
        else if(idDiv == 'inputFrom') {
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


        if(dataCity){
            var dublSelect;
            $sForm.find('li').css('display','block');
            if(idDiv == 'inputTo') {
                dublSelect = $sFormFrom.find('label.from i').text();
                $sFormTo.find('li[data-city="' + dublSelect + '"]').css('display', 'none');
                $sFormFrom.find('li[data-city="' + dataCity + '"]').css('display', 'none');
            }
            else if(idDiv == 'inputFrom') {
                dublSelect = $sFormTo.find('label.to i').text();
                $sFormFrom.find('li[data-city="' + dublSelect + '"]').css('display', 'none');
                $sFormTo.find('li[data-city="' + dataCity + '"]').css('display', 'none');
            }
        }
    }


    $listTrains.on('click', 'tr.itemTrain', function(){
        var $this = $(this);

        objTrain.trainID = $this.find('td').eq(0).text();
        objTrain.trainNAME = $this.find('td a.nameTrain').text();
        objTrain.trainWAY = $this.find('td').eq(2).text();
        objTrain.dataFrom = $this.find('td').eq(3).text();
        objTrain.dataTo = $this.find('td').eq(4).text();
        objTrain.dataFromNew = formatDate(objTrain.dataFrom);
        objTrain.dataToNew = formatDate(objTrain.dataTo);
        objTrain.places = [];
        console.log(objTrain);

        openMapTrain($this, 300);
    });


/* ----- закрытие / открытие строк с поездами ----- */
    function openMapTrain(trTrain, animationTime) {
        var $trTrain = trTrain;
        var $containerTrain = $trTrain.next().find(".containerTrain");
        var $heightMap = $containerTrain.find('.areaTrain').outerHeight();

        var $openTR = $listTrains.find('.itemTrain.open');
        // находим и закрываем любую открытую вкладку

        $openTR
            .next()
            .find(".containerTrain")
            .animate({
                height: 0
            }, animationTime, "linear", function() {

                $openTR.toggleClass("open close");
        });
        if($trTrain.hasClass('close')) {
            $containerTrain
                .animate({
                    height: $heightMap
                }, animationTime, "linear", function () {
                    $trTrain.toggleClass("open close");
                })
                .find('.cupeList i').each( // проставляем нумерацию мест
                function (index, value) {
                    var num = ++index > 9 ? index : "0" + index;
                    $(this).html(num).attr("data-place", index);
                });
        }
    }

/* ----- обработка клика по месту ----- */

    $listTrains.on("click", 'i[class != desabled]', function(){

        var el = $(this),
            place = el.attr("data-place"),
            $mapTrain = el.parents('div.mapTrain'),
            action = true,
            arrPlace = [],
            $formTicket;

        if(el.hasClass("select")){ // если метка снимается - удаляем поля
            action = false;
        }
        el.toggleClass("select");

        $mapTrain.find('i.select').each(function(){
            arrPlace[$(this).attr('data-place')] = $(this).text(); // формируем массив из выбранных
        });
        arrPlace = arrPlace.sort().filter(function(e){return e}); // избавляемся от пустых

        objTrain.places[place] = {"id": place};
        objTrain.places.arrPlace = arrPlace;

        if(action == false){
            deleteTicketForm($mapTrain,arrPlace,place);
        }
        else {
            $formTicket = $mapTrain.parents('div.areaTrain').next();
            addTicketForm($formTicket, arrPlace, place);
        }

        showStrPlace($mapTrain, arrPlace, place);
    });

/* ----- Обновление мест строка ----- */
    function showStrPlace(map, arrPlace) {
        var $numPlaces = arrPlace.length,
            $strPlace = map.next().find('.numPlace'),
            $titlePlace = $strPlace.prev(),
            str ='';

        if($numPlaces == 0){
            $titlePlace.html('Выберите места в вагоне');
            str = '';
        }
        else if($numPlaces == 1) {
            $titlePlace.html('Вы выбрали');
            str = arrPlace + " место";
        }
        else {
            str = arrPlace + " места";
        }
        $strPlace.html(str);
    }


/* ----- Удаление полей из формы заказа билета ----- */
    function deleteTicketForm(map, arrPlace, place) {
        delete objTrain.places[place];
        var $formTicket;
            $formTicket = map.parents('div.areaTrain').next();
            $formTicket.find("div.person[data-ticketID='" + place + "']").remove();
            if(arrPlace.length < 1) $formTicket.html('');
    }


    /* ----- Зачистка ----- */
    function clearTicket(formTicket, mapTrain) {
        arrAll = [];
        objTrain.places = [];
        objTrain.places.arrPlace = [];
        formTicket.html('');

        showStrPlace(mapTrain, arrAll);
        return false;
    }

/* ----- Бронирование билетов ----- */
    function orderTicket(mapTrain) {
        for(var i = 0; i < objTrain.places.length; i++){ // деактивация выбранных мест
            if(objTrain.places[i] !== undefined) {
                mapTrain.find("i[data-place='" + objTrain.places[i].id + "']")
                    .removeClass('select')
                    .addClass('desabled');
            }
        }
        showFreePlaces();
    }


/* ----- Актуализируем количество свободных мест  ----- */
    function showFreePlaces() {
        $listTrains.find('tr.itemTrain').each(function () {
            var freePlaces = places - $(this).next().find('i.desabled').length,
                n = freePlaces,
                strFreePlace = '';

            if ((n === 1) || (n > 20 && n % 10 === 1)) strFreePlace = n + " место";
            else if ((n >= 2 && n <= 4) || (n > 20 && n % 10 >= 2 && n % 10 <= 4)) strFreePlace = n + " места";
            else if (n > 0) {
                strFreePlace = n + " мест";
                $(this).find('td').eq(6).children('a.btn-blue').removeClass('desabled');
            }
            else if (n == 0) {
                strFreePlace = "мест нет";
                $(this).find('td').eq(6).children('a.btn-blue').addClass('desabled').html('Билетов нет');
            }
            $(this).find('td').eq(5).html(strFreePlace);
        });
    }

/* ----- Добавление полей в форму заказа билета ----- */
    function addTicketForm(formTicket, arrPlace, place) {
        var $form = formTicket,
            numPlaces = arrPlace.length,
            j = numPlaces-1,
            formHtml = '',
            fieldsHtml = '',
            $containerTrain = $form.parent();
            $containerTrain.height('auto');

        j = place;
        fieldsHtml = '<div class="person" data-ticketID="'+j+'">' +
        '<div class="col-input"><input type="text" value="" class="phone req" name="person[place]['+j+'][surname]" placeholder="Фамилия"/></div>' +
        '<div class="col-input"><input type="text" value="" class="req" name="person[place]['+j+'][name]" placeholder="Имя"/></div>' +
        '<div class="col-input"><input type="text" value="" name="person[place]['+j+'][secondname]" placeholder="Отчество"/></div>' +
        '<div class="col-input"><input type="text" value="" class="birthData req" name="person[place]['+j+'][birthday]" placeholder="Дата рождения"/></div>' +
        '<div class="col-input"><input type="text" value="" name="person[place]['+j+'][gov]" placeholder="Гражданство"/></div>' +
        '<div class="col-input"><input type="text" value="" name="person[place]['+j+'][doc]" placeholder="Серия и № документа"/></div>' +
        '<div class="col-input"><input type="text" value="" name="person[place]['+j+'][date_doc]" placeholder="Действует до"/></div>' +
        '<div class="gender"> ' +
        '<input type="radio" class="req" name="person[place]['+j+'][pol]" id="M'+j+'" value="M"/><label for="M'+j+'">М</label> ' +
        '<input type="radio" class="req" name="person[place]['+j+'][pol]" id="G'+j+'" value="Ж"/><label for="G'+j+'">Ж</label> ' +
        '</div> ' +
        '<br><span>'+j+'</span>' +
        '</div>';

        if(numPlaces == 1) {
            formHtml = '<form class="checkForm"><div class="user">' +
            '<div class="col-input"><input type="text" value="" class="phoneInput req" title="Номер телефона" name="person[phone]" placeholder="Телефон"/></div>' +
            '<div class="col-input"><input type="email" value="" class="email req" name="person[mail]" placeholder="E-mail"/></div>' +
            '</div>' +
            '<input class="btn-pink" type="submit" name="send" value="Забронировать" />' +
            '</form>';
            $form.html(formHtml);
            $form.find('.user').after(fieldsHtml);
        }
        if(numPlaces > 1) {
            $form.find('.user').after(fieldsHtml);
        }
        $form.find('.phoneInput').each(function() {$(this).mask('*(999) 999-9999')});
        $form.find('.birthData').each(function() {$(this).mask('99/99/9999')});
    }

/* ----- Форма поиска  ----- */

    $sForm.on('submit', 'form', function(e){
        e.preventDefault();
        var labelFrom = $sFormFrom.find('label i').text(),
            labelTo = $sFormTo.find('label i').text();


        $listTrains.find('tr.itemTrain').hide();
        $listTrains.find('a[data-from="'+labelFrom+'"][data-to="'+labelTo+'"]')
            .parents('.itemTrain')
            .show();

    });


    /* ----- Форма заказа ----- */

    $listTrains.on('submit', 'form', function(e){
        e.preventDefault();
        var t = $(this),
            flagError = 0,
            formTicket = t.parents('.formTicket'),
            containerTrain = t.parents('.containerTrain'),
            mapTrain = containerTrain.find('.mapTrain'),
            textError;

        t.find('.error p').remove();
        t.find('.error').removeClass('error');


        t.find('input[type="text"].req').each(function(){
            if($(this).val().trim()=='')
            {
                textError = 'заполните поле';
                $(this).val('');
                $(this).parent().addClass('error');
                $(this).parent().append('<p>'+textError+'</p>');
                flagError++;
            }
        });

        t.find('input[type="email"].req, input[type="text"].email.req').each(function(){
            var pattern = /^[-0-9a-z_.]+@[-0-9a-z^.]+.[a-z]{2,6}/g;
            if (pattern.test($(this).find('input').val())) {
                $(this).parent().removeClass('error');
            }
            else {
                textError = 'заполните корректно e-mail';
                $(this).parent().addClass('error');
                $(this).parent().append('<p>'+textError+'</p>');
                flagError++;
            }
        });


        t.find('.gender').each(function(){
            var $gender = $(this),
                check = false;
            $gender.find('input[type="radio"].req').each(function(){
                if ($(this)[0].checked == true) {
                    check = true;
                    $gender.removeClass('error');
                }
                else if(check != true) {
                    $gender.addClass('error');
                    flagError++;
                }
            });
        });

        if(flagError==0)
        {
            var data = t.serializeArray();
            $.post(
                t.attr('action'),
                data,
                function() {
                    orderTicket(mapTrain);
                    clearTicket(formTicket, mapTrain);
                });

            /*
             $.fancybox.close();

             $.fancybox('<div class="send-ok">' +
             '<p class="h2">Ваш вопрос отправлен!</p>'+
             '</div>');
             */
            /*if(dataAjax === 'ajax_sup') {
             $(this).closest('.' + dataOk).html('<div class="send-ok">' +
             '<p class="hOk">Спасибо!<br>Ваше сообщение отправлено.</p></div>');
             $("#pay").css("display","block");
             }*/
            return false;
        }
    });


    /* ----- стартуем ----- */

    $("table").tablesorter({
        headers: {
            0: { sorter: false},
            2: {sorter: false},
            5: {sorter: false},
            6: {sorter: false}
        },
        sortList: [[3,1]],
        debug : false
    }).bind("sortEnd",function() { // выстраиваем карты в соответствии с поездами
        $listTrains.find('.itemTrain').each(function(){
            var trMap = $listTrains.find('#'+$(this).attr("id")+'-map').remove();
            trMap.insertAfter('#'+$(this).attr("id"));
        });
    });

})(jQuery);

