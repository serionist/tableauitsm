(function () {
    const defaultIntervalInMin = '5';
    
    $(document).ready(function () {
        // ...
        // pass the object to initializeAsync() to map 'configure' key to a function called configure()
        // ...
        tableau.extensions.initializeAsync({'configure': configure}).then(function() {     
          // ...
          // ... code to set up event handlers for changes to configuration 
          });
        });
    
    
    
       function configure() { 
        // ... code to configure the extension
        // for example, set up and call displayDialogAsync() to create the configuration window 
        // and set initial settings (defaultIntervalInMin)
        // and handle the return payload 
        // ...
        tableau.extensions.ui.displayDialogAsync("configuration.html", defaultIntervalInMin, { height: 500, width: 500 }).then((closePayload) => {
          // The promise is resolved when the dialog has been expectedly closed, meaning that
          // the popup extension has called tableau.extensions.ui.closeDialog.
          // ...
    
          // The close payload is returned from the popup extension via the closeDialog() method.
         // ....
    
        }).catch((error) => {
          //  ... 
          // ... code for error handling
        });
      }
    
    })();  
    