Ext.define('override.BarraSuperior', {
    override: 'seguridad.BarraSuperior',
    border: false,
    bodyCls: CONT.SEGURIDAD.getUsuario() == null ? 'barra_superior_sin_sesion' : 'barra_superior_sesion',
    layout: {
        type: 'hbox',
        pack: 'end'
    },
    //propios


    // == null ? 'barra_superior_sin_sesion' : 'barra_superior_sesion',barra_superior_sesion_otro
    fnObtenerEstiloTipoRol: function () {
        if (CONT.SEGURIDAD.getUsuario() != null) {
            //var idRol = CONT.SEGURIDAD.getRolActual().IdRol;
			var idRol = 24;
            return 'barra_superior_sesion';
        }
        return 'barra_superior_sin_sesion';
    },
    fnCrearComponentes: function (contenedor) {
        if (CONT.SEGURIDAD.getUsuario() != null) {
            var idRol = CONT.SEGURIDAD.getRolActual().IdRol;

            Ext.Ajax.request({
                url: 'Mod_Administracion/Administracion/Buscar_Termino_Condicion_Uso',
                method: 'POST',
                params: { '': idRol },
                success: function (response) {
                    if (response.responseText != null) {
                        var aData = Ext.decode(response.responseText);
                        var info = aData.Data;
                        if (info!=null && info.Texto!=null)
                            Ext.MessageBox.alert("TÃ©rminos y Condiciones", info.Texto);
                    }
                },
                failure: function (response, opts) {
                    if (window.console) console.log('server-side failure with status code ' + response.status, arguments);
                }
            });
        }

        return [{
            border: false,
            xtype: 'panel',
            width: 200,
            height: '100%',
            bodyPadding: '2 0 0 0',
            bodyCls: contenedor.fnObtenerEstiloTipoRol(),
            layout: {
                type: 'table',
                columns: 1
            },
            items: [{
                xtype: 'displayfield',
                cls: 'barraSuperiorRol',// 'barra_color_usuario'    ,
                id: 'barraSuperiorUltimoAcceso',
                padding: '0 10 0 10',
                hideLabel: false,
               // width: 200,
                value: ' '
            }]//
        }, {
            border: false,
            xtype: 'panel',
            flex: 1,
            height: '100%',
            bodyPadding: '2 0 0 0',
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            bodyCls: contenedor.fnObtenerEstiloTipoRol(),
            items: [{
                xtype: 'displayfield',
                hideLabel: true,
                cls: 'barra_color_usuario',
                padding: '0 10 0 10',
                id: 'barraSuperiorUsuario'
            }, {
                xtype: 'combobox',
                fieldLabel: 'Rol-Sede:',
                id: 'barraSuperiorRol',
                editable: false,
                hidden: CONT.SEGURIDAD.getUsuario() == null,
                store: Ext.create('Ext.data.Store', {
                    fields: ['IdRol', 'Rol']
                }),
                queryMode: 'local',
                displayField: 'Rol',
                valueField: 'IdRol',
                valign: 'right',
                width: 360,
                labelWidth: 100,
                height: 15,
                listeners: {
                    select: function (combo, records, eOpts) {
                        //var idRol = combo.getValue();
						var idRol = 24;
                        CONT.util.consultar({
                            ruta: CONF.URL.SEGURIDAD_CAMBIO_ROL,
                            parametro: { ID_ROL: idRol },
                            fnExito: function (data) {
                                //CONT.SEGURIDAD.setRolActual(records.data);
                                window.location.reload();
                            },
                            fnError: function (data) {
                                window.location.reload();
                            }
                        });


                    }
                }
            },
            //{
            //    xtype: 'panel',
            //    bodyCls: 'border_naranja',
            //    hidden: CONT.SEGURIDAD.getUsuario() == null,
            //    height: 20,
            //    border: false,
            //    width: 2
            //},
            {
                xtype: 'button',
                text: 'Cambiar ContraseÃ±a',
                ui: 'button_link',
                height: 20,
                width: 140,
                hidden: CONT.SEGURIDAD.getUsuario() == null,
                handler: function () {
                    //CONT.util.fnMostrarCambioClaveVentana();
                    window.location.href = CONF.URL.SEGURIDAD_CAMBIAR_CLAVE;
                }
            }
            //,
            //{
            //    xtype: 'panel',
            //    bodyCls: 'border_naranja',
            //    hidden: CONT.SEGURIDAD.getUsuario() == null,
            //    height: 20,
            //    border: false,
            //    width: 3
            //}
            ,
            {
                xtype: 'button',
                text: 'Cerrar SesiÃ³n',
                ui: 'button_link',
                height: 20,
                width: 140,
                valign: 'right',
                hidden: CONT.SEGURIDAD.getUsuario() == null,
                handler: contenedor.fnCrearCerrarSesion()
            },
            //{
            //    xtype: 'button',
            //    text: 'Registrar',
            //    ui: 'button_link',
            //    height: 20,
            //    width: 140,
            //    valign: 'right',
            //    hidden: CONT.SEGURIDAD.getUsuario() != null,
            //    handler: function () {
            //        Aplicacion.getApplication().fnRedirigirUrlSinReload('registro_usuario');
            //    }
            //},
            //{
            //    xtype: 'panel',
            //    bodyCls: 'border_naranja',
            //    hidden: CONT.SEGURIDAD.getUsuario() != null,
            //    height: 20,
            //    border: false,
            //    width: 3
            //},
            //{
            //    xtype: 'button',
            //    text: 'Iniciar SesiÃ³n',
            //    ui: 'button_link',
            //    height: 20,
            //    width: 140,
            //    valign: 'right',
            //    hidden: CONT.SEGURIDAD.getUsuario() != null,
            //    handler: function () {
            //        Aplicacion.getApplication().fnRedirigirUrlSinReload('login');
            //    }
            //},
            //{
            //    xtype: 'panel',
            //    bodyCls: 'border_naranja',
            //    height: 20,
            //    border: false,
            //    width: 3
            //},
            {
                xtype: 'displayfield',
                padding: '0 10 0 10',
                hideLabel: true,
                value: 'Compartir:',
                width: 50
            }, {
                xtype: 'ImageField',
                id: 'imgSocialFacebook',
                height: 20,
                width: 20,
                valign: 'right',
                //tooltip: 'Facebook',
                //title: 'Comparte #SICRECE',
                imgCls: 'social-icons',
                src: CONF.PARAMS.RUTA_THEME_COMPLETA + '/resources/img/face.png',
                fnClick: function (contenedor) {
                    CONT.util.compartirFacebookFinal();
                }
            }, {
                xtype: 'ImageField',
                id: 'imgSocialTwitter',
                height: 20,
                width: 20,
                valign: 'right',
                //tooltip: 'Twitter',
                //title: 'Comparte #SICRECE',
                imgCls: 'social-icons',
                src: CONF.PARAMS.RUTA_THEME_COMPLETA + '/resources/img/twit.png',
                fnClick: function () {
                    CONT.util.compartirTwiterFinal();
                }
            }]
        }];
    },
    actualizarDatos: function () {
        var msjUltimoAcceso = '';
        var msjBienvenida = '';

        if (CONT.SEGURIDAD.getUsuario() != null)
            msjBienvenida =
                "Bienvenido (a): " + CONT.SEGURIDAD.getUsuario().Apellidos + ', ' + CONT.SEGURIDAD.getUsuario().Nombres + ', Hello!';
        //CONT.SEGURIDAD.getUsuarioNombreCompleto();

        if (CONT.SEGURIDAD.getUsuario() != null && CONT.SEGURIDAD.getUsuario().UltimoInicioSesion != null) {
            
            msjUltimoAcceso = 'Ãšltimo acceso:  ' + moment(CONT.SEGURIDAD.getUsuario().UltimoInicioSesion).format('DD/MM/YYYY h:mm:ss a');;//CONT.PARAMETROS.FECHA_ULTIMO_ACCESO;//Ext.Date.format(CONT.PARAMETROS.FECHA_ULTIMO_ACCESO, 'Y/m/d');
        }
        if (Ext.getCmp('barraSuperiorUsuario'))
            Ext.getCmp('barraSuperiorUsuario').setValue(msjBienvenida);

        if (Ext.getCmp('barraSuperiorUltimoAcceso'))
            Ext.getCmp('barraSuperiorUltimoAcceso').setValue(msjUltimoAcceso);
        /*                                              moment().format('MMMM Do YYYY, h:mm:ss a'); // enero 20Âº 2016, 11:20:51 am
        if (Ext.getCmp('barraSuperiorAmbito') != null && (CONT.SEGURIDAD.getRolActual() != null && CONT.SEGURIDAD.getRolActual() != undefined)) {
            var id_Sede = CONT.SEGURIDAD.getRolActual().CodigoSede;
            var request = JSON.stringify(id_Sede);
            var lista = Ext.Ajax.request({
                url: 'SeguridadSicreceController/Obtener_Sede',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                params: request,
                success: function (response) {
                    var responseJson = Ext.JSON.decode(response.responseText);
                    Ext.getCmp('barraSuperiorAmbito').setValue(responseJson.DESCRIPCION);
                }
                , failure: function (response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        }*/

        if (Ext.getCmp('barraSuperiorRol') != null && CONT.SEGURIDAD.getListaRol() != null && CONT.SEGURIDAD.getListaRol() != undefined) {
            Ext.getCmp('barraSuperiorRol').store.loadData(CONT.SEGURIDAD.getListaRol());
            Ext.getCmp('barraSuperiorRol').setValue(CONT.SEGURIDAD.getRolActual().IdRol);
        }
    },
    listeners: {
        afterrender: function () {


            Ext.create('Ext.tip.ToolTip', {
                target: 'imgSocialFacebook',
                html: 'Comparte #SICRECE en Facebook',
                showDelay: 150,
                hideDelay: 100,
                padding: 4,
                trackMouse: true
            });

            Ext.create('Ext.tip.ToolTip', {
                target: 'imgSocialTwitter',
                html: 'Comparte #SICRECE en Twitter',
                showDelay: 150,
                hideDelay: 100,
                padding: 4,
                trackMouse: true
            });
        }
    }
});
