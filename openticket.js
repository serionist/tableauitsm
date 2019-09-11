$(document).ready(function() {
    tableau.extensions.initializeDialogAsync().then(function() {
    
       document.getElementById("submit").removeAttribute("disabled");
       setError("submit-error", null);
       setError("submit-progress", null);
      for (const el of document.querySelectorAll('.mdc-text-field')) {
          new mdc.textField.MDCTextField.attachTo(el);
        }
    });
  });


  async function submit(){
     

      setError("subject-error", null);
      setError("submit-error", null);
      setError("submit-progress", null);
      const title = document.getElementById("subject").value;
    if (!title) {
        setError("subject-error", "Field is required");
        setError("submit-error", "Please fix validation errors before submitting");
        return;
    }
    const instance = tableau.extensions.settings.get("instance") || null;
    const username = tableau.extensions.settings.get("username") || null;
    const password = tableau.extensions.settings.get("password") || null;
    if (!instance || !username || !password) {
        setError("submit-error", "Please configure extension first");
        return;
    }
    const authorizationHeaderValue = `Basic ${btoa(`${username}:${password}`)}`;
    document.getElementById("submit").setAttribute("disabled", "disabled");
    document.getElementById("progress").style.display = "block";
    setError("submit-progress", "Creating ticket...");
    const baseUrl = `https://${tableau.extensions.settings.get("instance")}.service-now.com/`
    const ticketObj = {
        impact: document.getElementById("impact").value,
        severity: document.getElementById("severity").value,
        urgency: document.getElementById("urgency").value,
        short_description: document.getElementById("subject").value,
        description: document.getElementById("description").value,
    };

    let response;
    try{
        const req = (await fetch(`${baseUrl}api/now/table/incident`, {
            method: 'POST', 
            credentials: 'include',
            headers: {
                'Authorization': authorizationHeaderValue,
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(ticketObj), // body data type must match "Content-Type" header
        }));
        response = await req.json()
    }
    catch(e){
       fail("Failed to open ticket. Check browser logs", e);
       return;
    }
    setError("submit-progress", "Ticket created. Generating metadata information...");
    let dashboard = tableau.extensions.dashboardContent.dashboard;
    const parameters = getParametersInfo(await dashboard.getParametersAsync());
    let sheets = [];
    for (let i = 0;i < dashboard.worksheets.length; i++)
      sheets.push(await getSheetInfo(dashboard.worksheets[i]));
   
    var summary = {
        dashboardName: dashboard.name,
        dashboardSize: dashboard.size,
        dashboardParameters: parameters,
        sheets: sheets,
        data: []
    };
    for (let i = 0; i< dashboard.worksheets.length;i++){
        setError("submit-progress", `Getting underlying data for worksheet: '${dashboard.worksheets[i].name}'...`);
        const underlyingData = await dashboard.worksheets[i].getUnderlyingDataAsync();
        summary.data.push({
            sheetName: dashboard.worksheets[i].name,
            columns: underlyingData.columns,
            data: underlyingData.data
        })
    }

    setError("submit-progress", "Uploading technical information");
    try{
        console.log(summary);
        const req = (await fetch(`${baseUrl}api/now/attachment/file?table_name=incident&table_sys_id=${response.result.sys_id}&file_name=technicalinfo.json`, {
            method: 'POST', 
            credentials: 'include',
            headers: {
                'Authorization': authorizationHeaderValue,
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(summary, null, 2), // body data type must match "Content-Type" header
        }));
        response = await req.json();
    }
    catch(e){
       fail("Failed to upload technical information. Check browser logs", e);
       return;
    }

   
    
    setError("submit-progress", "Complete");
    tableau.extensions.ui.closeDialog(`https://${instance}.service-now.com/nav_to.do?uri=incident.do?sys_id=${response.result.sys_id}`);
   
  }

  function fail(errorMsg, error){
    console.log(errorMsg, error);
    setError("submit-progress", null);
    setError("submit-error", errorMsg);
    document.getElementById("submit").removeAttribute("disabled");
    document.getElementById("progress").style.display = "none";
  }

  async function getSheetInfo(worksheet) {
      let filters = await worksheet.getFiltersAsync();
      let filterInfos = [];
      for (let i = 0;i< filters.length;i++)
        filterInfos.push(await getFilterInfo(filters[i]));

    return {
        name: worksheet.name,
        sheetType: worksheet.sheetType,
        size: worksheet.size,
        highlightedMarks: (await worksheet.getHighlightedMarksAsync()).data,
        selectedMarks: (await worksheet.getHighlightedMarksAsync()).data,
        parameters: getParametersInfo(await worksheet.getParametersAsync()),
        summaryData: await worksheet.getSummaryDataAsync(),
        filters: filterInfos,
        datasources: getDatasourcesInfo(await worksheet.getDataSourcesAsync())
    }
  }
  function getParametersInfo(parameters) {
    return parameters.map(p=> { return {
        id : p.id,
        allowableValues : p.allowableValues,
        dataType : p.dataType,
        name : p.name,
        currentValue : p.currentValue
    }
       
    })
  }
  function getDatasourcesInfo(datasources) {
      return datasources.map(d=>  {
          return {
            name: d.names
          }
      });
  }
  function getFilterInfo(filter) {
    return {
        fieldId: filter.fieldId,
        fieldName: filter.fieldName,
        filterType: filter.filterType,
        //field: await filter.getFieldAsync()
    }
  }

 