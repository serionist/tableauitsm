(function () {
    const defaultIntervalInMin = '5';
    
    $(document).ready(function () {
        // ...
        // pass the object to initializeAsync() to map 'configure' key to a function called configure()
        // ...
        tableau.extensions.initializeAsync({'configure': configure}).then(function() {    
          document.getElementById("open").removeAttribute("disabled");
          setError("open-error", null);
          });
        });
       function configure() { 
        tableau.extensions.ui.displayDialogAsync("configuration.html", null, { height: 500, width: 500 });
      }

     
    
    })();  
    
    function openticket(){
      document.getElementById('open-success').style.display = 'none';
      tableau.extensions.ui.displayDialogAsync("openticket.html", null, { height: 500, width: 500 }).then((closePayload) => {
        document.getElementById('open-success').style.display = 'block';
      });
    }
