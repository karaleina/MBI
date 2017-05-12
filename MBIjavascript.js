
$(document).ready(function(){
    console.log("document ready!");

    function getM(){
      var wymiar_m = $("#wymiar_m").val();
      return wymiar_m;
    }
    function getN(){
      var wymiar_n = $("#wymiar_n").val();
      return wymiar_n;
    }

    $("td").text("So much fun!");

    $("#deleteDataTable").on('click', function() {
        $('#input_data_table').find("tr").remove();
        $('.user_input').addClass('hidden')
                              .removeClass('visible');
    });

    $("#createDataTable").on('click', function(){

        $('#input_data_table').find("tr").remove();

        //pobieranie wymiarów m i n (liczby cech i liczby próbek)
        var wymiar_m = getM();
        var wymiar_n = getN();

        $('.user_input').removeClass('hidden')
                              .addClass('visible');
        //tworzenie danych wierszy
        var tableNormalRowData = "";
        var tableHeaderRowData = "<th></th>"
        for (var i = 0; i < wymiar_m ; i++ ){
            var index = i + 1;
            tableNormalRowData += "<td contenteditable='true' class=M" + index + "></td>";
            if (i > 0) {
                tableHeaderRowData += "<th>" + "M" + i + "</th>";
            }
        }
        tableHeaderRowData += "<th>" + "M" + wymiar_m + "</th>";

        // tworzenie i dodwanie wierszy
        var tableRow = "";
        var tableHeaderRow = "";
        for (var j = 0; j < wymiar_n; j++){
            if (j == 0) {
                tableHeaderRow = "<tr>" + tableHeaderRowData + "</tr>";
                $('#input_data_table').append(tableHeaderRow);
            }
            else {
                tableRow = "<tr class=" + "N" + j +">" + "<th>" + "N" + j + "</th>" + tableNormalRowData + "</tr>";
                $('#input_data_table').append(tableRow);
            }

        }

        tableRow = "<tr class=" + "N" + wymiar_n +">" + "<th>" + "N" + wymiar_n +"</th>" + tableNormalRowData + "</tr>";
        $('#input_data_table').append(tableRow);

    });






  });
