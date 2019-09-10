$(document).ready(function() {
  tableau.extensions.initializeDialogAsync().then(function(openPayload) {
    document.getElementById("instance").value = tableau.extensions.settings.get("instance") || null;
    document.getElementById("username").value = tableau.extensions.settings.get("username") || null;
    document.getElementById("password").value = tableau.extensions.settings.get("password") || null;
    document.getElementById("save").removeAttribute("disabled");
    setError("save-error", null);

    for (const el of document.querySelectorAll('.mdc-text-field')) {
        new mdc.textField.MDCTextField.attachTo(el);
      }
  });
});

function save() {
  document.getElementById("save").setAttribute("disabled", "true");
  setError("instance-error", null);
  setError("username-error", null);
  setError("password-error", null);
  let anyError = false;
  const missingError = "Field is required";
  if (!document.getElementById("instance").value) {
    setError("instance-error", missingError);
    anyError = true;
  }
  if (!document.getElementById("username").value) {
    setError("username-error", missingError);
    anyError = true;
  }
  if (!document.getElementById("password").value) {
    setError("password-error", missingError);
    anyError = true;
  }
  if (anyError) {
      setError("save-error", "Fix validation errors before continuing");
      document.getElementById("save").removeAttribute("disabled");
    return;
  }

  tableau.extensions.settings.set("instance",  document.getElementById("instance").value);
  tableau.extensions.settings.set("username",  document.getElementById("username").value);
  tableau.extensions.settings.set("password",  document.getElementById("password").value);
  tableau.extensions.settings.saveAsync().then(e=>{
    document.getElementById("save").removeAttribute("disabled");
    tableau.extensions.ui.closeDialog();
  }).catch(e=>{
    setError("save-error", "Failed to save settings. Check console log");
    console.error(e);
    document.getElementById("save").removeAttribute("disabled");
  })

}