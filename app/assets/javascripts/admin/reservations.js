$(document).ready(function() {
    var date_out_key = '"reservation_out"';
    var id_key = '"id"';
    var value_delimiter = "=>"
    var end_pair_delimiter = "}"
    var last_clicked_field = null;
    var last_entered_date = null;

    $('.best_in_place').best_in_place()
        .on('ajax:error', function(evt, data, status, xhr) {
            var response = ($('<p />').html(data['responseText'])).find('pre');
            var error = response.first().text();

            $('#reservation_error').text(response.first().text()).css("visibility", "visible");
            if (error != "Invalid Date") {
                if (response.text().indexOf(date_out_key) != -1) {
                    var date = new Date(findValInHashText(response, date_out_key));
                    var date_string = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                    var id = findValInHashText(response, id_key);
                    var s = $("[data-inner_class=reservation_out_" + id + "]")
                }
            }
        })
        .on('ajax:success', function(evt, data, status, xhr) {
            $('#reservation_error').css("visibility", "hidden");
        });

    $(document).click(function (event) {
        if (last_clicked_field != null) {
            if (!last_clicked_field.is(event.target) && last_clicked_field.has(event.target).length == 0) {
                convertTextBoxToDiv(last_clicked_field);
                last_clicked_field = null;
                last_entered_date = null;
            } else {
                return;
            }
        }
        if ($(event.target).hasClass("res_date")){
            var last_clicked_cell = $(event.target).parent();
            convertDivToTextBox($(event.target));
            last_clicked_field = last_clicked_cell.children().first();
            last_entered_date = last_clicked_field.val();
        }
    });

    var datepickerSettings = {
        clearBtn: true,
        todayHighlight: true,
        autoclose: true
    };
    $('#filter-section .input-daterange').datepicker(datepickerSettings);
    $('#filter-section_quantity').change(function() {
      $('#filter-section .input-daterange').datepicker('remove');
      $('#filter-section #date_in').val('');
      $('#filter-section #date_out').val('');
      $('#filter-section .input-daterange').datepicker(datepickerSettings);
    });

    function convertDivToTextBox(div) {
        var date = div.text();
        var parent = div.parent();
        parent.prepend('<input class="res_date">' + div.val() + "</input>");
        parent.children().first().val(date);
        parent.children().first().focus();
        div.remove();
    }

    function convertTextBoxToDiv(textBox) {
        var old_date = last_entered_date;
        var new_date = textBox.val();
        var id = textBox.parent().attr("data-id");
        var reservation_out;
        var reservation_in;
        var result_date = new_date;


        if (textBox.parent().attr('class') == 'reservation_out') {
            reservation_out = new_date;
            reservation_in = $('td.reservation_in[data-id=' + id + ']').children().first().text();
        } else {
            reservation_out = $('td.reservation_out[data-id=' + id + ']').children().first().text();
            reservation_in = new_date;
        }

        reservation_out = reservation_out.replace(/(\r\n|\n|\r)/gm,"");
        reservation_out = reservation_out.trim()

        $.ajax({
            type: "POST",
            url: "/reservations/" + id,
            data: {_method:'put', start_date:reservation_out, end_date:reservation_in, return_address:window.location.pathname },
            success: function(data) {
                result_date = new_date
                $('#reservation_error').css("visibility", "hidden");
                replaceWithDate(textBox, result_date)
            },
            error: function(data) {
                var response = ($('<p />').html(data['responseText'])).find('pre');
                var error = response.first().text();
                if (error == "Invalid Date") {
                    result_date = old_date;
                }
                replaceWithDate(textBox, result_date)
                $('#reservation_error').text(error).css("visibility", "visible");

            }
        });
    }

    function replaceWithDate(element, date) {
        element.parent().prepend('<div class="res_date">' + date + "</div>");
        element.remove();
    }

    function findValInHashText(response, key) {
        var valueStart = response.text().indexOf(value_delimiter, response.text().indexOf(key)) + value_delimiter.length;
        var valueEnd = response.text().indexOf(end_pair_delimiter, response.text().indexOf(key));
        return response.text().substring(valueStart, valueEnd).replace(/"/g, '');
    }
});