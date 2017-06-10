$(document).ready(function(){

  var covarianceMatrix = null;

  console.log("document ready!");

  function getM(){
    var wymiar_m = $("#wymiar_m").val();
    return wymiar_m;
  }

  function getN(){
    var wymiar_n = $("#wymiar_n").val();
    return wymiar_n;
  }

  function countMeans(array, m, n){

    var srednie_atrybutow = [];
    for (var i = 0; i< m; i++){
      // po rzędach
      var suma_cechy = 0;
      for (var j = 0; j< n; j++) {
        suma_cechy += parseFloat(array[j][i]);
      }
      srednie_atrybutow[i] = suma_cechy/n;
    }
    return srednie_atrybutow;
  }

  function countStd(array, srednie_atrybutow, m, n ){
    //TODO porawic bo cos nie dziala
    var odchylenie_cechy = [];
    //idziemy po cechach
    for(var i = 0; i < m; i++){
      var suma_kwadratow = 0;
      //idziemy po rzędach
      for (var j = 0; j< n; j++) {
        var currentValue = parseFloat(array[j][i]);
        suma_kwadratow += (currentValue - srednie_atrybutow[i])*(currentValue - srednie_atrybutow[i]);
      }
      odchylenie_cechy[i] = Math.sqrt(suma_kwadratow / n);
    }
    return odchylenie_cechy;
  }

  function translateDataIntoMatrix(m, n) {

    var nieznormalizowane_dane = new Matrix(parseFloat(n),  parseFloat(m));
    var dataMatrix = [];
    var currentValue = 0;
    var currentRow = 0;
    var dataCurrentRow = [];

    for( var i = 1; i <= n; i++){
      dataCurrentRow=[];
      currentRow = $('#input_data_table').find(".N" + i);
      for (var j = 1; j<= m; j++){
        currentValue = currentRow.find(".M" + j).text();
        dataCurrentRow.push(currentValue);

      }
      dataMatrix.push("[" + dataCurrentRow + "]");
      nieznormalizowane_dane[i - 1] = dataCurrentRow;
    }
    return nieznormalizowane_dane;
  }

  function normalization(srednie_atrybutow, odchylenie_atrybutow, nieznormalizowane_dane){
    var m = getM();
    var n = getN();

    var nieznormalizowane_dane = translateDataIntoMatrix(m, n);
    var nieznormalizowane_2d_array = nieznormalizowane_dane.to2DArray();

    for(var i = 1 ; i <= m; i++) {
      var column_vector = nieznormalizowane_dane.getColumnVector(i-1);
      column_vector = column_vector.map( function(value) {
        return (value - srednie_atrybutow[i-1])/odchylenie_atrybutow[i-1];
      } );
      nieznormalizowane_dane.setColumn(i-1, column_vector);
    }

    var znormalizowane_dane = nieznormalizowane_dane;
    return znormalizowane_dane;

  }

  function convertMatrixIntoHtmlTable(matrix_2d_array, m,  n){
    //var matrix_2d_array = matrix.to2DArray();

    var table = $("<table class=results></table>");

    var firstrow = $("<tr><th></th></tr>");
    for (var k = 1; k <= m; k++){

      firstrow.append("<th>M" + k  +  "</th>");
    }

    table.append(firstrow);

    for(var i = 0; i < n; i++ ){
      var current_array_row = matrix_2d_array[i];
      var current_table_row = $("<tr><th>N" + parseInt(i+1) + "</th></tr>");

      for(var j = 0; j < m; j++){
        var current_data = current_array_row[j];
        current_table_row.append("<td>" + current_data.toFixed(4) + "</td>");
      }

      table.append(current_table_row);
      //table.append("<tr>" + current_table_row + "</tr>");
    }

    //table = $("<table>" + table + "</table>");
    return table;
  }

  function convertArrayIntoTable(array, m){

    var table = $("<table class=results></table>");

    var firstrow = $("<tr></tr>");
    var lastrow = $("<tr></tr>");
    for (var k = 1; k <= m; k++){
      firstrow.append("<th>M" +  k +  "</th>");
      lastrow.append("<td>" + array[k - 1].toFixed(4) + "</td>");
    }
    table.append(firstrow);
    table.append(lastrow);

    return table;

  }

  function countCovarianceMatrix(matrix, m){
    var m = parseInt(m);
    var covarianceMatrix = new Matrix(m, m);
    for (var i=0; i<m; i++){
      var motherVector = matrix.getColumnVector(i);

      for (var j=0; j<m; j++){
        var cov = 0;
        var currentVector = matrix.getColumnVector(j);
        for (var k=0; k< currentVector.length ; k++ ){
          cov += currentVector[k]*motherVector[k];
        }
        covarianceMatrix[i][j] = cov;
        console.log(covarianceMatrix[i][j]);
      }
    }
    return covarianceMatrix;
  }

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




  $("#getData").on("click", function(){

    $(".first_step").addClass("hidden");
    $(".first_step").removeClass("visible");

    $(".second_step").addClass("visible");
    $(".second_step").removeClass("hidden");
    $(".second_step").text("DALEJ");

    $(".third_step").addClass("hidden");
    $(".third_step").removeClass("visible");

    $("fourth_step").addClass("hidden");
    $("fourth_step").removeClass("visible");


    var m = getM();
    var n = getN();

    var nieznormalizowane_dane = translateDataIntoMatrix(m, n);
    var nieznormalizowane_2d_array = nieznormalizowane_dane.to2DArray();

    var srednie_atrybutow = countMeans(nieznormalizowane_2d_array, m, n);
    console.log(srednie_atrybutow);

    var odchylenie_atrybutow = countStd(nieznormalizowane_2d_array, srednie_atrybutow, m, n );
    console.log(odchylenie_atrybutow);

    var znormalizowane_dane = normalization(srednie_atrybutow, odchylenie_atrybutow, nieznormalizowane_dane);

    //czyść
    $("#steps").empty();
    $("#steps").append("<h2>Krok 1:</h2>");

    //średnia
    $("#steps").append("<h3>Średnia z cech:</h3>");
    var srednia_cech_table = convertArrayIntoTable(srednie_atrybutow, m);
    $("#steps").append(srednia_cech_table);

    //odchylenie
    $("#steps").append("<h3>Odchylenie z cech:</h3>");
    var odchylenie_cech_table = convertArrayIntoTable(odchylenie_atrybutow, m);
    $("#steps").append(odchylenie_cech_table);

    $("#steps").append("<h3>Wzór, pod który podstawiamy:</h3>")
    $("#steps").append("<img src=krok1.jpg></img>");

    //macierz znormalizowana`
    $("#steps").append("<h3>Otrzymana znormalizowana macierz danych:</h3>");
    var table = convertMatrixIntoHtmlTable(znormalizowane_dane.to2DArray(), m, n);
    $("#steps").append(table);

    covarianceMatrix = countCovarianceMatrix(znormalizowane_dane, m);
  });

  $(".first_step").on("click", function() {
    $("#getData").trigger("click");

  });

  $(".second_step").on("click", function(){

    $("#steps").empty();
    $(".first_step").addClass("visible");
    $(".first_step").removeClass("hidden");
    $(".first_step").text("WSTECZ");

    $(".second_step").addClass("hidden");
    $(".second_step").removeClass("visible");

    $(".third_step").addClass("visible");
    $(".third_step").removeClass("hidden");
    $(".third_step").text("DALEJ");

    $("fourth_step").addClass("hidden");
    $("fourth_step").removeClass("visible");

    var m = getM();
    var covariance_table = convertMatrixIntoHtmlTable(covarianceMatrix.to2DArray(), m, m);

    $("#steps").append("<h2>Krok 2:</h2>")
    .append("<h3>Wzór, z którego zostanie wyznaczona macierz kowariancji:</h3>")
    .append("<img src=krok2.jpg></img>")
    .append("<h3>Obliczona macierz kowariancji między cechami:</h3>")
    .append(covariance_table);
  });

  $(".third_step").on("click", function(){

    var m = getM();
    $("#steps").empty();
    $(".first_step").addClass("hidden");
    $(".first_step").removeClass("visible");

    $(".third_step").addClass("hidden");
    $(".third_step").removeClass("visible");

    $(".second_step").addClass("visible");
    $(".second_step").removeClass("hidden");
    $(".second_step").text("WSTECZ");

    $(".fourth_step").addClass("visible");
    $(".fourth_step").removeClass("hidden");
    $(".fourth_step").text("DALEJ");

    $("#steps").empty();
    $("#steps").append("<h2>Krok 3:</h2>");

    var pca = new PCA(covarianceMatrix, {isCovarianceMatrix:'true', scale:'false', center:'false' });
    var lambdas = pca.getEigenvalues();
    var diagonalMartix = Matrix.diag(lambdas);
    $("#steps").append("<h3>Postać diagonalna macierzy kowariancji:</h3>")
    .append(convertMatrixIntoHtmlTable(diagonalMartix.to2DArray(), m, m ));
    $("#steps").append("<h3>Wzór, który wiąże diagonalną macierz kowariancji za pomocą przekształcenia <i>P</i> z macierzą znormalizowanych danych <i>Z</i></h3>")
    .append("<img src=krok3.jpg></img>");
    var eigenVectorsMatrix = pca.getEigenvectors();
    $("#steps").append("<h3>Wektory własne - macierz przekształcenia <i>P</i> </h3>")
    .append(convertMatrixIntoHtmlTable(eigenVectorsMatrix.to2DArray(), m, m ));
  });

  $(".fourth_step").on("click", function(){
    $(".first_step").addClass("hidden");
    $(".first_step").removeClass("visible");

    $(".third_step").addClass("visible");
    $(".third_step").removeClass("hidden");
    $(".third_step").text("WSTECZ");

    $(".second_step").addClass("hidden");
    $(".second_step").removeClass("visible");

    $(".fourth_step").removeClass("visible");
    $(".fourth_step").addClass("hidden");

    $("#steps").empty();
    $("#steps").append("<h2>Krok 4:</h2>");

    var pca = new PCA(covarianceMatrix, {isCovarianceMatrix:'true', scale:'false', center:'false' });
    var eigenVectorsMatrix = pca.getEigenvectors();
    var lambdas = pca.getEigenvalues();
    var diagonalMartix_lambdas = Matrix.diag(lambdas);


    //Kaiser Guttman - wartości własne
    var lambdas_kaiser_guttman = [];

    for (i = 0; i < lambdas.length; i++) {
      //spełniające warunek wartości własne
      if (lambdas[i]>=1){
        lambdas_kaiser_guttman.push(lambdas[i]);
      }
    }

    //Kaiser Guttman - nowy  układ współrzędnych
    var m_kaiser = parseInt(lambdas_kaiser_guttman.length);
    var n_kaiser = parseInt(getN());
    var matrix_kaiser_vectors = new Matrix(n_kaiser, m_kaiser);

    for (i = 0; i < lambdas.length; i++) {
      //spełniające warunek wartości własne
      if (lambdas[i]>=1){
        matrix_kaiser_vectors.addColumn(i, eigenVectorsMatrix.getColumn(i));
      }
    }

    //Printuj do htmla
    $("#steps").append("<h3>Kryterium <i>Kaisera-Guttmana</i></h3>")
    $("#steps").append("<p>Do wyboru nowego układu współrzędnych w algorytmie PCA " +
                        "stosuje się często kryterium Kaisera-Guttmana, ​które mówi, iż należy zachować składowe, " +
                        "dla których wartości własne są większe od 1 (czyli wkład składowej większy, niż wkład pojedynczej zmiennej.)</p>")
              .append("<p> Z tego warunku wynika, że wartości własne, które spełniają warunek: </p>");
    $("#steps").append(convertArrayIntoTable(lambdas_kaiser_guttman, lambdas_kaiser_guttman.length))
              .append("<p> A zatem nowe wymiary to:</p>")
              .append(convertMatrixIntoHtmlTable(matrix_kaiser_vectors, lambdas_kaiser_guttman.length, getN()));


  });
});
