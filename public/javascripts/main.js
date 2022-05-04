!function(){
    "use strict";
    
    window.MOJFrontend.initAll();

    var filterInput = document.getElementById('filterInput');
    var filterButton = document.getElementById('filterButton');
    var clearButton = document.getElementById('clearButton');

    if (filterInput && filterButton) {
        filterButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (filterInput.value) {
                window.location.assign(window.location.origin + window.location.pathname + '?search=' + filterInput.value);
            } else {
                window.location.assign(window.location.origin + window.location.pathname);
            }
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
    
            window.location.assign(window.location.origin + window.location.pathname);
        });
    }

    /* start advanced filter */
    var afAcquirerName = document.getElementById('acquirerName');
    var afNotificationType = document.getElementById('notificationType');
    var afSubmissionStart = document.getElementById('submissionStart');
    var afSubmissionEnd = document.getElementById('submissionEnd');
    var afStatus = document.getElementById('status');
    var advancedFilterButton = document.getElementById('advancedFilterButton');
    var advancedClearButton = document.getElementById('advancedClearButton');

    if ((afAcquirerName || afNotificationType || afSubmissionStart || afSubmissionEnd) && advancedFilterButton) {
        var cont = document.querySelectorAll('.govuk-width-container');
        var middleCont = cont[1];
        middleCont.setAttribute('class', 'govuk-width-container-report');

        var bluePart = document.querySelectorAll('.govuk-header__container');
        var blueLine = bluePart[0];
        blueLine.setAttribute('style', 'border-bottom: 10px solid;');

        advancedFilterButton.addEventListener('click', function(e) {
            e.preventDefault();
            var searchString = "";

            if (afAcquirerName.value != "") {
                searchString += searchString.length == 0 ? "?acquirerName=" + afAcquirerName.value : "&acquirerName=" + afAcquirerName.value;
            }
            if (afNotificationType.value != "NULL") {
                searchString += searchString.length == 0 ? "?notificationType=" + afNotificationType.value : "&notificationType=" + afNotificationType.value;
            }
            if (afSubmissionStart.value != "") {
                searchString += searchString.length == 0 ? "?submissionStart=" + afSubmissionStart.value : "&submissionStart=" + afSubmissionStart.value;
            }
            if (afSubmissionEnd.value != "") {
                searchString += searchString.length == 0 ? "?submissionEnd=" + afSubmissionEnd.value : "&submissionEnd=" + afSubmissionEnd.value;
            }
            if (afStatus.value != "NULL") {
                searchString += searchString.length == 0 ? "?status=" + afStatus.value : "&status=" + afStatus.value;
            }

            if (searchString) {
                window.location.assign(window.location.origin + window.location.pathname + searchString);
            } else {
                window.location.assign(window.location.origin + window.location.pathname);
            }
        });
    }

    if (advancedClearButton) {
        advancedClearButton.addEventListener('click', function(e) {
            e.preventDefault();
    
            window.location.assign(window.location.origin + window.location.pathname + "?cleared=true");
        });
    }
    /* end advanced filter */

    var conditionalDecisionYes = document.getElementById("decisionYes");
    var conditionalDecisionNo = document.getElementById("decisionNo");
    var conditionalRadio = document.getElementById("decisionConditional");

    if (conditionalDecisionYes && conditionalDecisionNo && conditionalRadio) {
        conditionalDecisionYes.addEventListener("click", function() {
            conditionalRadio.querySelectorAll("input[type=radio").forEach(function(radio) {
                radio.required = true;
            });
        });

        conditionalDecisionNo.addEventListener("click", function() {
            conditionalRadio.querySelectorAll("input[type=radio").forEach(function(radio) {
                radio.required = false;
            });
        });
    }
}();