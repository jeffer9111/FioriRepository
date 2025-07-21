# MultiInputControl
1. Upload the file MultiInputControl.js in your proyect
2. Call the module in your controller, for instance:
```
sap.ui.define([  
  "yourProyect/folder/MultiInputControl  
], (MultiInputControl) => {  
```  
3. In the method `onInit()` call the method `MultiInputControl.addControl` sending this values:
a. View controller (this)
b. Id of the MultiInputControl
c. Key field of the entity where data is retrieved
d. Description field of the entity where data is retrieved

4. In the View create the MultiInput control with these properties:

   a. **valueHelpRequest** with its method that opens a modal dialog
   
   b. **tokenUpdate** with its method that will call the method `MultiInputControl.tokenUpdate`, for example:
   `MultiInputControl.tokenUpdate(idMultiInput);}`
   
   c. **submit** with its method that will call the method `MultiInputControl.onSubmitSupplier`, for example:
   `MultiInputControl.submitMultiInput(oEvent, "idMultiInput");`
    
5. If you use a TableSelectDialog for the modal dialog, you must to implement these properties:
   
   a. **onConfirmFrgmtSupplier** with its method that will call that method `MultiInputControl.setTokenToCtrl`, for example:
   `MultiInputControl.setTokenToCtrl(oEvent, "idMultiInput");`
