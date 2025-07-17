#FilterBarVariant
1. Upload the file FilterBarVariant.js in your proyect
2. Call the module in your controller, for instance:
...
sap.ui.define([
  "<yourProyect>/<folder>/FilterBarVariant"
], (FilterBarVariant) => {
...
4. In the method onInit() call the method FilterBarVariant.initVariant sending this values:
a. View controller (this)
b. Id of the SmartFilterVariant
c. Id of the FilterBar
c. Id of the Table
5. In the View set the next properties to the filterBar control
a. filterChange="onFilterChange" and implement the next method:
onFilterChange() {
  FilterBarVariant.updateLabelsAndTable();
}
b. afterVariantLoad="onAfterVariantLoad"
onAfterVariantLoad() {
  FilterBarVariant.updateLabelsAndTable();
}
6. In order to the variant realices when the values of the filter are changed, set the corresponding property as liveChange or change, set the method onSelectionChange and implement it how is specified below:
onSelectionChange(oEvent) {
  this.oSmartVariantManagement.currentVariantSetModified(true);
  this.oFilterBar.fireFilterChange(oEvent);
}
7. When the filter is changed or a value of the filter is changed, the table set the property Overlay to true. In order to set it in false, call the method FilterBarVariant.disableOverlay() in the method that you use for search the data
