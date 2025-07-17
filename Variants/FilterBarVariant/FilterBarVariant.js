sap.ui.define([
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/core/date/UI5Date"
],
    (PersonalizableInfo, UI5Date) => {

        return {
            /**
             * Initialize control to the filterbar variant
             * @param {object} oController View Controller (this)
             * @param {string} sIdSmartVariantManagement sap.ui.comp.smartvariants.SmartVariantManagement control's ID 
             * @param {string} sIdFilterBar ui.comp.filterBar.FilterBar control's ID
             * @param {string} sIdTable sap.m.Table control's ID
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

            /**
             * Set data to the variant's controls  
             * @param {Array} aData 
             */
            applyData(aData) {
                aData.forEach(oDataObject => {
                    const oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                    const sControlType = oControl.getMetadata().getName();

                    let oValue = oDataObject.fieldData;

                    if (sControlType === "sap.m.DatePicker") {
                        let oUI5Date;
                        if (oValue) {
                            const jsDate = new Date(oValue); // Convert string to JS Date
                            oUI5Date = UI5Date.getInstance(jsDate); // Convert JS Date to UI5Date
                        }
                        oControl.setDateValue(oUI5Date); // Set the value to the DatePicket
                    } else {
                        oControl.setValue(oValue);
                    }
                }, this);
            },

            /**
             * When the variant is saved, it sends data from the filter bar to the variant
             * @returns 
             */
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

            /**
             * When a variant is selected, it returns the filter's controls with them respective value
             * @returns 
             */
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

            /**
             * Event hired when a filter bar's control value is changed
             * @param {Event} oEvent 
             */
            onSelectionChange(oEvent) {
                this.oSmartVariantManagement.currentVariantSetModified(true);
                this.oFilterBar.fireFilterChange(oEvent);
            },

            /**
             * Overlay the table
             */
            updateLabelsAndTable() {
                this.oTable.setShowOverlay(true);
            },

            /**
             * Disable the overlay
             */
            disableOverlay() {
                this.oTable.setShowOverlay(false);
            }
        };

    });
