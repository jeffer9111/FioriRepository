sap.ui.define([
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/m/DatePicker",
    "sap/ui/core/date/UI5Date"
],
    (PersonalizableInfo, DatePicker, UI5Date) => {

        return {
            /**
             * Inicializar control de variantes para el filtro de búsqueda
             * @param {object} oController Controllador de la vista (this)
             * @param {string} sIdSmartVariantManagement Id del control sap.ui.comp.smartvariants.SmartVariantManagement
             * @param {string} sIdFilterBar Id del control ui.comp.filterBar.FilterBar
             * @param {string} sIdTable Id del control sap.m.Table
             */
            initVariant(oController, sIdSmartVariantManagement, sIdFilterBar, sIdTable) {
                this.applyData = this.applyData.bind(this);
                this.fetchData = this.fetchData.bind(this);
                this.getFiltersWithValues = this.getFiltersWithValues.bind(this);

                this.oSmartVariantManagement = oController.byId(sIdSmartVariantManagement);
                this.oFilterBar = oController.byId(sIdFilterBar);
                this.oTable = oController.byId(sIdTable);

                this.oFilterBar.registerFetchData(this.fetchData);
                this.oFilterBar.registerApplyData(this.applyData);
                this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);

                const oPersInfo = new PersonalizableInfo({
                    type: "filterbar",
                    keyName: "persistencyKey",
                    dataSource: "",
                    control: this.oFilterBar
                });
                this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
                this.oSmartVariantManagement.initialise(function () { }, this.oFilterBar);
            },

            applyData(aData) {
                aData.forEach(oDataObject => {
                    const oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);

                    let oValue = oDataObject.fieldData;

                    const sControlType = oControl.getMetadata().getName();
                    if (sControlType === "sap.m.DatePicker") {
                        let oUI5Date;
                        if (oValue) {
                            const sDateString = oValue;
                            const jsDate = new Date(sDateString); // Convert string to JS Date
                            oUI5Date = UI5Date.getInstance(jsDate); // Convert JS Date to UI5Date
                        }
                        oControl.setDateValue(oUI5Date); // Set the value to the DatePicket
                    } else {
                        oControl.setValue(oValue);
                    }
                }, this);
            },

            fetchData() {
                let aData = this.oFilterBar.getAllFilterItems().reduce((aResult, oFilterItem) => {
                    let sValue;

                    const oControl = oFilterItem.getControl();
                    const sControlType = oControl.getMetadata().getName();

                    if (sControlType === "sap.m.DatePicker") {
                        sValue = oControl.getDateValue();
                    } else {
                        sValue = oControl.getValue();
                    }

                    aResult.push({
                        groupName: oFilterItem.getGroupName(),
                        fieldName: oFilterItem.getName(),
                        fieldData: sValue
                    });

                    return aResult;
                }, []);

                return aData;
            },

            getFiltersWithValues() {
                const aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    const oControl = oFilterGroupItem.getControl();
                    let sValue;

                    const sControlType = oControl.getMetadata().getName();
                    if (sControlType === "sap.m.DatePicker") {
                        sValue = oControl.getDateValue()
                    } else {
                        sValue = oControl.getValue();
                    }

                    if (oControl && sValue) {
                        aResult.push(oFilterGroupItem);
                    }

                    return aResult;
                }, []);

                return aFiltersWithValue;
            },

            onSelectionChange(oEvent) {
                this.oSmartVariantManagement.currentVariantSetModified(true);
                this.oFilterBar.fireFilterChange(oEvent);
            },

            updateLabelsAndTable() {
                this.oTable.setShowOverlay(true);
            },

            disableOverlay() {
                this.oTable.setShowOverlay(false);
            }
        };

    });
