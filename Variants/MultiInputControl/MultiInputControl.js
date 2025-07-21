sap.ui.define([
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    (Token, Filter, FilterOperator) => {

        const oMultiInput = new Array();

        return {
            /**
             * Agregar control MultiInput
             * @param {object} oController Objecto controllador de la vista (this)
             * @param {string} sIdMultiInput Id del MultiInput
             * @param {string} sKey Campo clave (puede referirse al campo de una entidad)
             * @param {string} sText Campo descriptivo (puede referirse al campo de una entidad)
             * @returns 
             */
            addControl(oController, sIdMultiInput, sKey, sText) {
                const oControl = oController.byId(sIdMultiInput);

                if (!oControl) {
                    return;
                }

                oMultiInput.push({
                    id: sIdMultiInput,
                    control: oControl,
                    key: sKey,
                    text: sText
                });
            },
            /**
             * Convertir tokens del control MultiInput a un filtro
             * @param {string} sIdMultiInput Id del MultiInput
             * @param {string} sFieldFilter Nombre del campo a filtrar
             * @returns {sap.ui.model.Filter} Filtro
             */
            convertTokensInFilter(sIdMultiInput, sFieldFilter) {
                const oMultiInput = this.getMultiInput(sIdMultiInput);
                const aTokens = oMultiInput.control.getTokens();
                const aFilter = new Array();

                for (const key in aTokens) {
                    const oElement = aTokens[key];
                    aFilter.push(new Filter(sFieldFilter, FilterOperator.EQ, oElement.getKey()));
                }

                return aFilter;
            },

            /**
             * Obtener objeto MultiInput
             * @param {string} sIdMultiInput Id del MultiInput
             * @returns {object} Objeto MultiInput
             */
            getMultiInput(sIdMultiInput) {
                for (let i = 0; i < oMultiInput.length; i++) {
                    if (oMultiInput[i].id === sIdMultiInput) {
                        return oMultiInput[i];
                    }
                }
            },

            /**
             * Set the token to a control
             * @param {object} oEvent Event
             * @param {object} oCtrl Control
             * @param {string} sKeyNode Key for the token
             * @param {string} sTextNode Text for the token
             * @returns 
             * @public
             */
            setTokenToCtrl(oEvent, sIdMultiInput) {
                const oSelectedItem = oEvent.getParameter("selectedContexts");

                if (oSelectedItem === undefined) {
                    return;
                }

                const oMultiInput = this.getMultiInput(sIdMultiInput);
                // oMultiInput.control.removeAllTokens();

                for (const key in oSelectedItem) {
                    const oElement = oSelectedItem[key];
                    const oSelectedObject = oElement.getObject();
                    oMultiInput.control.addToken(new Token({
                        key: oSelectedObject[oMultiInput.key],
                        text: oSelectedObject[oMultiInput.text]
                    }));
                }
            },

            /**
             * Crear un token al presionar Enter
             * @param {Event} oEvent Evento disparador
             * @param {string} sIdMultiInput Id del MultiInput
             * @returns 
             */
            submitMultiInput(oEvent, sIdMultiInput) {
                const oMultiInput = this.getMultiInput(sIdMultiInput);
                let sValue = oEvent.getParameter("value");
                // Eliminar espacios
                sValue = sValue.replace(/\s+/g, "");
                // Si está vacío no se agrega el token
                if (!sValue) {
                    return;
                }

                oMultiInput.control.addToken(new Token({
                    key: sValue,
                    text: sValue
                }));
                //Limpiar el valor del campo 
                oMultiInput.control.setValue("");
            },

            /**
             * Actualizar token de un campo MultiInput
             * @param {Event} oEvent Evento que dispara la actualización
             * @param {string} sIdMultiInput Id del MultiInput
             */
            tokenUpdate(oEvent, sIdMultiInput) {
                const oRemoveTokens = oEvent.getParameter("removedTokens");
                const oMultiInput = this.getMultiInput(sIdMultiInput);


                for (const key in oRemoveTokens) {
                    oMultiInput.control.removeToken(oRemoveTokens[key]);
                }
            }
        };

    });
