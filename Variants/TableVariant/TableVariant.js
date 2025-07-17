sap.ui.define([
    "sap/m/p13n/Engine",
    "sap/m/p13n/MetadataHelper",
    "sap/m/p13n/SelectionController",
    "sap/m/p13n/SortController",
    "sap/m/p13n/GroupController",
    "sap/m/p13n/FilterController",
    "sap/m/table/ColumnWidthController",
    "sap/ui/core/library",
    "sap/ui/model/Filter",
    'sap/ui/model/Sorter',
    "sap/m/ColumnListItem"
],
    (Engine, MetadataHelper, SelectionController,
        SortController, GroupController, FilterController, ColumnWidthController, coreLibrary, Filter,
        Sorter, ColumnListItem) => {

        return {

            initVariantModel(oController, sIdSmartVariantManagement, sIdTable, sComponentName, sIdFilterInfo) {
                this.oTable = oController.byId(sIdTable);
                this.oFilterInfo = oController.byId(sIdFilterInfo);
                this.oController = oController;

                this.oMetadataHelper = new MetadataHelper([
                    { key: "Id", label: "ID", path: "ID" },
                    { key: "CompanyCode", label: "Company Code", path: "BUKRS" },
                    { key: "StringDate", label: "String Date", path: "IDATE" },
                    { key: "ModificationDate", label: "Modification Date", path: "MDATE" },
                    { key: "Creditor", label: "Creditor", path: "DOC_NUMBER_BLDR" },
                    { key: "Supplier", label: "Supplier", path: "DOC_NUMBER_PROV" },
                    { key: "PaymentCondition", label: "Payment Condition", path: "ZTERM" },
                    { key: "PurchaseOrder", label: "Purchase Order", path: "EBELN" },
                    { key: "TypeMessage", label: "Type Message", path: "TYPE" },
                    { key: "Message", label: "Message", path: "MESSAGE" }
                ]);

                Engine.getInstance().register(this.oTable, {
                    helper: this.oMetadataHelper,
                    controller: {
                        Columns: new SelectionController({
                            targetAggregation: "columns",
                            control: this.oTable
                        }),
                        Sorter: new SortController({ control: this.oTable }),
                        Groups: new GroupController({ control: this.oTable }),
                        ColumnWidth: new ColumnWidthController({ control: this.oTable }),
                        Filter: new FilterController({ control: this.oTable })
                    }
                });

                Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
            },

            handleStateChange(oEvent) {
                const oState = oEvent.getParameter("state");
                if (!oState) {
                    return;
                }

                // Update column visibility and order
                this.updateColumns(oState);

                // Generate filters, sorters, and groups
                const aFilter = this.createFilters(oState);
                const aGroups = this.createGroups(oState);
                const aSorter = this.createSorters(oState, aGroups);

                // Dynamically create cell templates
                const aCells = oState.Columns.map((oColumnState) => {
                    const oProperty = this.oMetadataHelper.getProperty(oColumnState.key);

                    if (!oProperty) {
                        return new sap.m.Text({ text: "" }); // fallback
                    }

                    if (oColumnState.key === "Id") {
                        return new sap.m.ObjectIdentifier({ title: `{mainModel>${oProperty.path}}` });
                    }

                    if (oProperty.path === "MDATE") {
                        return new sap.m.Text({
                            text: {
                                path: `mainModel>${oProperty.path}`,
                                type: new sap.ui.model.type.Date({
                                    UTC: true,
                                    pattern: "dd/MM/yyyy"
                                })
                            }
                        });
                    }

                    return new sap.m.Text({ text: `{mainModel>${oProperty.path}}` });
                });

                // Rebind the table with generated template
                this.oTable.bindItems({
                    templateShareable: false,
                    path: "mainModel>/",
                    sorter: aSorter.concat(aGroups),
                    filters: aFilter,
                    template: new ColumnListItem({
                        type: "Navigation",
                        press: this.oController.onGoToDetaill.bind(this.oController),
                        cells: aCells
                    })
                });
            },

            updateColumns(oState) {
                const oTable = this.oTable;

                oTable.getColumns().forEach((oColumn) => {
                    oColumn.setVisible(false);
                    oColumn.setWidth(oState.ColumnWidth[this._getKey(oColumn)]);
                    oColumn.setSortIndicator(coreLibrary.SortOrder.None);
                    oColumn.data("grouped", false);
                });

                oState.Columns.forEach((oProp, iIndex) => {
                    const oCol = oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oProp.key);
                    if (oCol) {
                        oCol.setVisible(true);

                        oTable.removeColumn(oCol);
                        oTable.insertColumn(oCol, iIndex);
                    }
                });
            },

            createFilters(oState) {
                const aFilter = [];

                Object.keys(oState.Filter).forEach((sFilterKey) => {
                    const filterPath = this.oMetadataHelper.getProperty(sFilterKey).path;

                    oState.Filter[sFilterKey].forEach(function (oCondition) {
                        aFilter.push(new Filter(filterPath, oCondition.operator, oCondition.values[0]));
                    });
                });

                this.oFilterInfo.setVisible(aFilter.length > 0);

                return aFilter;
            },

            createGroups(oState) {
                const aGroupings = [];
                oState.Groups.forEach(function (oGroup) {
                    aGroupings.push(new Sorter(this.oMetadataHelper.getProperty(oGroup.key).path, false, true));
                }.bind(this));

                oState.Groups.forEach((oSorter) => {
                    const oCol = this.oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
                    oCol.data("grouped", true);
                });

                return aGroupings;
            },

            createSorters(oState, aExistingSorter) {
                const aSorter = aExistingSorter || [];

                oState.Sorter.forEach(function (oSorter) {
                    const oExistingSorter = aSorter.find(function (oSort) {
                        return oSort.sPath === this.oMetadataHelper.getProperty(oSorter.key).path;
                    }.bind(this));

                    if (oExistingSorter) {
                        oExistingSorter.bDescending = !!oSorter.descending;
                    } else {
                        aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
                    }
                }.bind(this));

                oState.Sorter.forEach((oSorter) => {
                    const oCol = this.oTable.getColumns().find((oColumn) => oColumn.data("p13nKey") === oSorter.key);
                    if (oSorter.sorted !== false) {
                        oCol.setSortIndicator(oSorter.descending ? coreLibrary.SortOrder.Descending : coreLibrary.SortOrder.Ascending);
                    }
                });

                if (aSorter.length === 0) {
                    aSorter.push(new Sorter('ID', false));
                }

                return aSorter;
            },

            openPersoDialog(aPanels, oSource) {
                Engine.getInstance().show(this.oTable, aPanels, {
                    contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
                    contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
                    source: oSource || this.oTable
                });
            },

            _getKey(oControl) {
                return oControl.data("p13nKey");
            }

        };

    });
