var CSVDataIE = '';
var baseURL = '';
function ngGridCsvExportPlugin(opts) {
    var self = this;
    self.grid = null;
    self.scope = null;
    self.init = function (scope, grid, services) {
        self.grid = grid;
        self.scope = scope;
        //You can ignore and remove baseURL if you are using some other path
        baseURL = scope.baseUrl;
        function showDs() {
            var keys = [];
            var displays = [];
            var cellfilter = [];

            //Storing all cells filters in array to format them while exporting to CSV e.g. Date, Currency, Number etc
            for (var cf in grid.config.columnDefs) { cellfilter.push(grid.config.columnDefs[cf].cellFilter); }

            //Storing all Cells title displayed in Grid in array to export in CSV
            for (var d in grid.config.columnDefs) { displays.push(grid.config.columnDefs[d].displayName); }
            
            //Storing all Cells keys (database table column bind with ng-grid) 
            for (var f in grid.config.columnDefs) { keys.push(grid.config.columnDefs[f].field); }
            var csvData = '';
 
            //Function to format the data depend on Cell format e.g. Currency, Date
            function csvStringify(keyName, str) {

                if (str == null) { // we want to catch anything null-ish, hence just == not ===
                    return '';
                }
                if (typeof (str) === 'number') {
                    if (keyName == "currency")
                        return "$" + CurrencyFormat(str);
                    else if (keyName == "percentage:2")
                        return (str * 100) + "%";
                    else
                        return str;
                }

                if (typeof (str) === 'boolean') {
                    return (str ? 'TRUE' : 'FALSE');
                }

                if (typeof (str) === 'string') {
                    if (keyName == 'date:"M/dd/yyyy"') {
                        return str.substring(0, 10);
                    }
                    else {
                        return str.replace(/"/g, '""');
                    }
                }

                return JSON.stringify(str).replace(/"/g, '""');
            }

            function swapLastCommaForNewline(str) {
                var newStr = str.substr(0, str.length - 1);
                return newStr + "\n";
            }

            for (var d in displays) {
                csvData += '"' + csvStringify("", displays[d]) + '",';
            }

            csvData = swapLastCommaForNewline(csvData);
            var gridData = grid.data;
            var cntr = 0;
            for (var gridRow in gridData) {
                for (k in keys) {
                    var curCellRaw;
                    if (opts != null && opts.columnOverrides != null && opts.columnOverrides[keys[k]] != null) {
                        curCellRaw = opts.columnOverrides[keys[k]](gridData[gridRow][keys[k]]);
                    }
                    else {
                        curCellRaw = gridData[gridRow][keys[k]];
                    }
                    csvData += '"' + csvStringify(cellfilter[cntr], curCellRaw) + '",';
                    cntr++;
                }
                cntr = 0;
                csvData = swapLastCommaForNewline(csvData);
            }

            //Creating HTML that would be added at end of ng-grid in footer with Export Button
            var fp = grid.$root.find(".ngFooterPanel");
            var csvDataLinkPrevious = grid.$root.find('.ngFooterPanel .csv-data-link-span');
            if (csvDataLinkPrevious != null) { csvDataLinkPrevious.remove(); }
            var csvDataLinkHtml = "<span class=\"csv-data-link-span\">";

            csvDataLinkHtml += "<br><a onclick='ExportJsontoCSV()'><button type='button' class='btn btn-primary'><span class='glyphicon glyphicon-export'></span>Export</button></a></br></span>";
            CSVDataIE = csvData;
            fp.append(csvDataLinkHtml);

        }
        setTimeout(showDs, 0);

        scope.catHashKeys = function () {
            var hash = '';
            for (var idx in scope.renderedRows) {
                hash += scope.renderedRows[idx].$$hashKey;
            }
            return hash;
        };
        scope.$watch('catHashKeys()', showDs);

        function isDate(date) {
            return ((new Date(date) !== "Invalid Date" && !isNaN(new Date(date))));
        }

    };
}

//Function to call MVC Action that will store data in session or any other container and send OK
//Response, once response come back it will other function that will download CSV file.
function ExportJsontoCSV() {

    $.ajax({
        //Double check baseURL if you have it, otherwise use your own code, this is simple JQuery POST
        url: baseURL + "CSVExport/ExporttoCSV/",
        type: "POST",
        data: { 'data': CSVDataIE },

        success: function () {
            window.location = baseURL + "CSVExport/DownloadCSVFile/";
        }

    });

}

//Function borrowed from www.willmaster.com/library/generators/currency-formatting.php to format Currency
function CurrencyFormat(number) {
    var decimalplaces = 2;
    var decimalcharacter = ".";
    var thousandseparater = ",";
    number = parseFloat(number);
    var sign = number < 0 ? "-" : "";
    var formatted = new String(number.toFixed(decimalplaces));
    if (decimalcharacter.length && decimalcharacter != ".") { formatted = formatted.replace(/\./, decimalcharacter); }
    var integer = "";
    var fraction = "";
    var strnumber = new String(formatted);
    var dotpos = decimalcharacter.length ? strnumber.indexOf(decimalcharacter) : -1;
    if (dotpos > -1) {
        if (dotpos) { integer = strnumber.substr(0, dotpos); }
        fraction = strnumber.substr(dotpos + 1);
    }
    else { integer = strnumber; }
    if (integer) { integer = String(Math.abs(integer)); }
    while (fraction.length < decimalplaces) { fraction += "0"; }
    temparray = new Array();
    while (integer.length > 3) {
        temparray.unshift(integer.substr(-3));
        integer = integer.substr(0, integer.length - 3);
    }
    temparray.unshift(integer);
    integer = temparray.join(thousandseparater);
    return sign + integer + decimalcharacter + fraction;
}