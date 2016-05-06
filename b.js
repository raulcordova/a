define(function (require) {
    "use strict";
    var $ = require('jquery'),
        ui = require('jqueryui'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        tpl = require('text!app/tpl/usuario.html'),
        template = _.template(tpl),
        _grid_locale = require("vendors/i18n/grid.locale-es"),
        _grid_core = require("vendors/jquery.jqGrid.min"),
        me = null;

    return Backbone.View.extend({
        events: {
        },

        initialize: function () {
            me = this;
            _view = this;
            this.render();
        },

        render: function () {
            $('#spnTitulo').text("LISTADO DE USUARIOS");
            this.$el.html(template());

            var arg = {
                Grid: '#tblGrd',
                Pager: '#divPgr',
                Url: 'api/usuario/',
                Id: 'Codigo',
                Sort: 'Codigo',
                Direction: 'ASC',
                ColNames: [' ', 'ID', 'Usuario', 'Nombres', 'Password'],
                ColModel: [
                    { name: 'act', index: 'act', width: 30, align: 'center', search: false, hidedlg: true, sortable: false, hidden:true },
                    { name: 'Codigo', index: 'Codigo', width: 40, align: 'center', hidden: true, searchoptions: { sopt: ['eq', 'ne'] }, editable: true, editoptions: { readonly: true, size: 10 } },
					          { name: 'Login', index: 'Login', width: 120, editable: true, editrules: { required: true }, editoptions: { maxlength: 12, "class": "anchoGrd required maxlength upper alphanumeric" } },
                    { name: 'Nombres', index: 'Nombres', width: 380, editable: true, editrules: { required: true }, editoptions: { maxlength: 150, "class": "anchoGrd required maxlength upper alpha" } },
                    { name: 'Password', index: 'Password', width: 100, editable: true, editrules: { required: true }, edittype: 'select', editoptions: { value: gl.strTipoRol, "class": "anchoGrd required" } }
                    //{ name: 'TipoEtapa', index: 'TipoEtapa', width: 15, hidden: true, hidedlg: true, editable: true, edittype: 'select', editoptions: { value: gl.strTipoEtapaConv, "class": "required" }, editrules: { edithidden: true, required: true }, formoptions: { label: 'Tipo Etapa' } },

                ],
                Width: 700,
                Caption: 'Listado',
                pEdit: true ,
                pAdd: true,
                pDel: false,
                pShowCol: false,
                pSearch: false,
                pToolbar: true,
                Shrink: false,                
                FnShowAfterAdd: this.addForm,
                FnShowAfterEdit: this.editForm
            };
            CargaGrid(arg);

            
            $('.butGrid').button();
            return this;
        },

        addForm: function () { $("#Login").removeAttr("disabled"); },
        editForm: function () { $("#Login").attr("disabled", "disabled"); },

        gridFunction: function (id, row) {
            var txt = "";
            txt = txt + "<button class='butGrid' onclick='javascript:_view.cambiarPassword(\"" + id + "\",\"" + row.Login + "\");' title='Cambiar Contraseña...'><i class='fa fa-key'></i></button>";
            return txt;
        },

        reloadGrid: function () {
            ReloadGrid('tblGrd');
        },

        validaUsuario: function () {
            $("#Login").keypress(function (e) {
                var regex = new RegExp("^[a-zA-Z0-9]+$");
                var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                if (regex.test(str)) {
                    return true;
                }

                e.preventDefault();
                return false;
            });
        },

        cambiarPassword: function (id, login) {
            $('#divPass').dialog({
                autoOpen: true,
                width: 300,
                zIndex: 998,
                minHeight: 100,
                height: 'auto',
                modal: true,
                title: 'Cambiar Password',
                open: function () {
                    $('#spnLogin').text(login);
                    $('#txtNewPass').val('');
                    $('#txtRePass').val('');
                },
                close: function () {
                    $('#divPass').dialog('close');
                },
                buttons: [{
                    id: "butPassOk",
                    text: "Cambiar",
                    click: function () {
                        me.cambiarPasswordOk();
                    }
                }, {
                    id: "butPassNo",
                    text: "Cancelar",
                    click: function () {
                        $('#divPass').dialog('close');
                    }
                }]
            });
        },

        cambiarPasswordOk: function () {
            var pass = $('#txtNewPass').val();
            var rePass = $('#txtRePass').val();

            if ($.trim(pass) == '') {
                CallMnsj("Debe ingresar un valor para el campo 'Nueva Contraseña'.", "E", function () { $('#txtNewPass').focus(); });
                return;
            }
            if ($.trim(rePass) == '') {
                CallMnsj("Debe ingresar un valor para el campo 'Repetir Contraseña'.", "E", function () { $('#txtRePass').focus(); });
                return;
            }

            if (pass != rePass) {
                CallMnsj("Los valores registrados en los campos 'Nueva Contraseña' y 'Repetir Contraseña' no coinciden.", "E");
            } else {
                var data = { login: $('#spnLogin').text(), pass: pass };
                var url = 'api/usuario/cambiarPass/0';
                CallJson2('PUT', url, JSON.stringify(data), function (data) {
                    CallMnsj('Se cambio la contraseña', "I", function () {
                        $('#divPass').dialog('close');
                    });
                }, function (xmlHttpError) {                    
                    CallMnsj(xmlHttpError.responseText);
                });
            }
        },


        disposeView: function (view) {
            Backbone.View.prototype.close = function () {
                this.unbind();
                this.undelegateEvents();
            };

            /* --Destroy current view */
            if (this.currentView !== undefined) {
                this.currentView.close();
            }

            /* --Create new view */
            this.currentView = view;
            this.currentView.delegateEvents();

            return this.currentView;
        }
    });

});
