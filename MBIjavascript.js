
$(document).ready(function(){
    console.log("document ready!");

    $("td").text("So much fun!");

    $("#deleteDataTable").on('click', function() {
        $('#input_data_table').find("tr").remove();
    });

    $("#createDataTable").on('click', function(){

        //pobieranie wymiarów m i n (liczby cech i liczby próbek)
        var wymiar_m = getM();
        var wymiar_n = getN();

        //tworzenie danych wierszy
        var tableNormalRowData = "";
        var tableHeaderRowData = "<th></th>"
        for (var i = 0; i < wymiar_m ; i++ ){
            tableNormalRowData += "<td contenteditable ='true'></td>";
            if (i > 0) {
                tableHeaderRowData += "<th>" + "M" + i + "</th>";
            }
        }
        tableHeaderRowData += "<th>" + "M" + wymiar_m + "</th>";

        console.log(tableNormalRowData); //jest ok
        console.log(tableHeaderRowData); //jest ok

        // tworzenie i dodwanie wierszy
        var tableRow = "";
        var tableHeaderRow = "";
        for (var j = 0; j < wymiar_n; j++){
            if (j == 0) {
                tableHeaderRow = "<tr>" + tableHeaderRowData + "</tr>";
                console.log(tableHeaderRow);
                $('#input_data_table').append(tableHeaderRow);
            }
            else {
                tableRow = "<tr>" + "<th>" + "N" + j + "</th>" + tableNormalRowData + "</tr>";
                console.log(tableRow);
                $('#input_data_table').append(tableRow);
            }

        }

        tableRow = "<tr>" + "<th>" + "N" + wymiar_n +"</th>" + tableNormalRowData + "</tr>";
        console.log(tableRow);
        $('#input_data_table').append(tableRow);


        function getM(){
          var wymiar_m = $("#wymiar_m").val();
          console.log("Wybrana liczba m cech = " + wymiar_m);
          return wymiar_m;
        }
        function getN(){
          var wymiar_n = $("#wymiar_n").val();
          console.log("Wybrana liczba n cech = " + wymiar_n);
          return wymiar_n;
        }

      });

  });
