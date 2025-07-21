# TableVariant
1. Upload the file TableVariant.js in your proyect
2. Call the module in your controller, for instance:
```
sap.ui.define([  
  "yourProyect/folder/TableVariant"  
], (TableVariant) => {  
```
3. In the method `onInit()` call the method `TableVariant.initVariantModel` sending this values:  
	a. View controller (this)  
	b. Id of the Table  
	c. Id of the filterInfo (doesn't work in the moment)  
	d. And array with all the columns of you table with the structure  
		- key: ID of the column  
		- label: Label of the column  
		- path: Name of the cell
```  
const aMetadataHelper = [  
  { key: "Id", label: i18nModel.getText("id"), path: "ID" },  
  { key: "CompanyCode", label: i18nModel.getText("companyCode"), path: "BUKRS" }  
];  
```
4. In the View create a buttom that will call the personalization options:  
	a. In the method defined in property press, call the method `TableVariant.openPersoDialog`, for example:  
	`TableVariant.openPersoDialog(["Columns", "Sorter", "Groups", "Filter"], oEvent.getSource());`
5. If you use a Variant, don't forget to add the library `"sap.ui.fl": {}` in the manifest.json file
