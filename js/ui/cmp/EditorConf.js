Ext.namespace('ui','ui.cmp','ui.cmp._EditorConf');

//------------------------------------------------------------------------------
// EditorConf Win internals

// EditorConf Win-Menu template
ui.cmp._EditorConf.tplMenu = new Ext.XTemplate(
    '<tpl for=".">',
        '<div class="menu-wrap" id="tplMenu-{id}">',
            '<div class="menu {card}"></div>',
            '<span>{label}</span>',
        '</div>',
    '</tpl>'
);
ui.cmp._EditorConf.tplMenu.compile();

// EditorConf Win-Menu items definition for EN
ui.cmp._EditorConf.menuDefEn = [
    ['1', 'card1', _('Main')],
    ['4', 'card4', _('Module "Files with error"')],
    ['6', 'card6', _('Module "All files"')],
    ['7', 'card7', _('Module "Pending patches"')]
];

// EditorConf Win-Menu items definition for Non-EN
ui.cmp._EditorConf.menuDefNonEn = [
    ['1', 'card1', _('Main')],
    ['2', 'card2', _('Module "Files need translate"')],
    ['3', 'card3', _('Module "Files need update"')],
    ['4', 'card4', _('Module "Files with error"')],
    ['5', 'card5', _('Module "Files need reviewed"')],
    ['6', 'card6', _('Module "All files"')],
    ['7', 'card7', _('Module "Pending patches"')]
];

// EditorConf Win-Menu items store
ui.cmp._EditorConf.menuStore = new Ext.data.SimpleStore({
    id     : 0,
    fields : [
        { name : 'id'},
        { name : 'card'},
        { name : 'label'}
    ]
});

// EditorConf Win-Menu view
ui.cmp._EditorConf.viewMenu = Ext.extend(Ext.DataView,
{
    id           : 'conf-menu-view',
    tpl          : ui.cmp._EditorConf.tplMenu,
    singleSelect : true,
    overClass    : 'x-view-over',
    itemSelector : 'div.menu-wrap',
    store        : ui.cmp._EditorConf.menuStore,
    listeners : {
        selectionchange : function(view)
        {
            var r = view.getSelectedRecords();
            Ext.getCmp('confCard').layout.setActiveItem('conf-card-' + r[0].data.id);
        }
    }
});

// doc-editor Theme datastore
ui.cmp._EditorConf.themeStore = new Ext.data.SimpleStore({
    fields : ['themeFile', {
        name : 'themeName',
        type : 'string'
    }],
    data : [
        ['themes/ExtJsThemes/black/css/xtheme-black.css',                     _('Black')],
        ['themes/empty.css',                                                  _('Default')],
        ['themes/ExtJsThemes/darkgray/css/xtheme-darkgray.css',               _('DarkGray')],
        ['http://extjs.cachefly.net/ext-' + ExtJsVersion + '/resources/css/xtheme-gray.css', _('Gray')],
        ['themes/ExtJsThemes/gray-extend/css/xtheme-gray-extend.css',         _('Gray Extend')],
        ['themes/ExtJsThemes/indigo/css/xtheme-indigo.css',                   _('Indigo')],
        ['themes/ExtJsThemes/midnight/css/xtheme-midnight.css',               _('Midnight')],
        ['themes/ExtJsThemes/olive/css/xtheme-olive.css',                     _('Olive')],
        ['themes/ExtJsThemes/purple/css/xtheme-purple.css',                   _('Purple')],
        ['themes/ExtJsThemes/silverCherry/css/xtheme-silverCherry.css',       _('SilverCherry')],
        ['themes/ExtJsThemes/ubuntu_human/css/xtheme-human.css',              _('Ubuntu Human')]
    ]
});

ui.cmp._EditorConf.CommitChange = new Ext.util.DelayedTask(function()
{
    new ui.task.UpdateConfTask({
        item  : this.name,
        value : this.getValue()
    });
});

// EditorConf card1 - mainApp
ui.cmp._EditorConf.card1 = Ext.extend(Ext.TabPanel,
{
    id         : 'conf-card-1',
    autoScroll : true,
    activeTab  : 0,
    defaults   : { bodyStyle: 'padding: 5px;', autoHeight : true, autoScroll : true },

    initComponent : function()
    {
        Ext.apply(this,
        {
            items : [{
                title   : _('User Interface'),
                iconCls : 'iconUI',
                items   : [{
                    xtype   : 'fieldset',
                    title   : _('Main menu'),
                    iconCls : 'iconMenu',
                    items   : [{
                        xtype      : 'spinnerfield',
                        width      : 60,
                        name       : 'mainAppMainMenuWidth',
                        value      : PhDOE.user.conf.mainAppMainMenuWidth || 300,
                        fieldLabel : _('Main Menu width'),
                        minValue   : 0,
                        maxValue   : 10000,
                        accelerate : true,
                        enableKeyEvents : true,
                        listeners  : {
                            keyup : function()
                            {
                                    var cmp = Ext.getCmp('main-menu-panel'),
                                        val = this.getValue();
                                    PhDOE.user.conf.mainAppMainMenuWidth = val;
                                    cmp.setWidth(val);
                                    cmp.ownerCt.doLayout();

                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                            },
                            spin : function()
                            {
                                    var cmp = Ext.getCmp('main-menu-panel'),
                                        val = this.getValue();
                                    PhDOE.user.conf.mainAppMainMenuWidth = val;
                                    cmp.setWidth(val);
                                    cmp.ownerCt.doLayout();

                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                            }
                        }
                    }]
                }, {
                    xtype   : 'fieldset',
                    iconCls : 'iconThemes',
                    title   : _('Appearance'),
                    items   : [{
                        xtype          : 'combo',
                        fieldLabel     : _('Choose a theme'),
                        id             : 'conf-combo-theme',
                        valueField     : 'themeFile',
                        displayField   : 'themeName',
                        triggerAction  : 'all',
                        mode           : 'local',
                        forceSelection : true,
                        editable       : false,
                        value          : PhDOE.user.conf.theme,
                        store          : ui.cmp._EditorConf.themeStore,
                        listeners      : {
                            render : function()
                            {
                                Ext.getCmp('conf-combo-theme').store.sort('themeName');
                            },
                            select : function(c)
                            {
                                var hrefTheme = c.getValue();

                                Ext.get('appTheme').dom.href = hrefTheme;

                                new ui.task.UpdateConfTask({
                                    item  : 'theme',
                                    value : hrefTheme
                                });
                            }
                        }
                    }]
                }, {
                    xtype      : 'fieldset',
                    title      : _('On save file'),
                    iconCls    : 'iconSaveFile',
                    autoHeight : true,
                    defaults   : { hideLabel: true },
                    defaultType: 'radio',
                    items      : [{
                        autoHeight : true,
                        name       : 'onSaveFile',
                        checked    : (PhDOE.user.conf.onSaveFile === "ask-me") ? true : false,
                        boxLabel   : _('Ask me if I want to check for error before saving the file'),
                        inputValue : 'ask-me',
                        listeners  : {
                            check  : function(field)
                            {
                                if (field.checked) {
                                    new ui.task.UpdateConfTask({
                                        item  : 'onSaveFile',
                                        value : field.getRawValue()
                                    });
                                }
                            }
                        }
                    }, {
                        autoHeight : true,
                        name       : 'onSaveFile',
                        checked    : (PhDOE.user.conf.onSaveFile === "always") ? true : false,
                        boxLabel   : _('Always check for error before saving the file'),
                        inputValue : 'always',
                        listeners  : {
                            check : function(field)
                            {
                                if (field.checked) {
                                    new ui.task.UpdateConfTask({
                                        item  : 'onSaveFile',
                                        value : field.getRawValue()
                                    });
                                }
                            }
                        }
                    }, {
                        autoHeight : true,
                        name       : 'onSaveFile',
                        checked    : (PhDOE.user.conf.onSaveFile === "never") ? true : false,
                        boxLabel   : _('Never check for error before saving the file'),
                        inputValue : 'never',
                        listeners  : {
                            check : function(field)
                            {
                                if (field.checked) {
                                    new ui.task.UpdateConfTask({
                                        item  : 'onSaveFile',
                                        value : field.getRawValue()
                                    });
                                }
                            }
                        }
                    }]
                 }]
             }, {
                title   : _('External Data'),
                iconCls : 'iconExternalData',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('About mails'),
                    iconCls     : 'iconMailing',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        autoHeight  : true,
                        name        : 'mainAppLoadMailsAtStartUp',
                        checked     : PhDOE.user.conf.mainAppLoadMailsAtStartUp,
                        boxLabel    : _('Load mail at startUp'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'mainAppLoadMailsAtStartUp',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }, {
                    xtype       : 'fieldset',
                    title       : _('About bugs'),
                    iconCls     : 'iconBugs',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        autoHeight  : true,
                        name        : 'mainAppLoadBugsAtStartUp',
                        checked     : PhDOE.user.conf.mainAppLoadBugsAtStartUp,
                        boxLabel    : _('Load bugs at startUp'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'mainAppLoadBugsAtStartUp',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
             }]
        });
        ui.cmp._EditorConf.card1.superclass.initComponent.call(this);
    }
});

// EditorConf card2 - Module "Files Need Translate" Config
ui.cmp._EditorConf.card2 = Ext.extend(Ext.TabPanel,
{
    id         : 'conf-card-2',
    autoScroll : true,
    activeTab  : 0,
    defaults   : {
        bodyStyle  : 'padding: 5px;',
        autoHeight : true,
        autoScroll : true
    },

    initComponent : function()
    {
        Ext.apply(this,
        {
            items : [{
                title   : _('Menu'),
                iconCls : 'iconMenu',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('Nb files to display'),
                    iconCls     : 'iconFilesToDisplay',
                    defaults    : { hideLabel: true },
                    items       : [{
                        xtype      : 'spinnerfield',
                        width      : 60,
                        name       : 'newFileNbDisplay',
                        value      : PhDOE.user.conf.newFileNbDisplay || 0,
                        boxLabel   : _('files to display'),
                        minValue   : 0,
                        maxValue   : 10000,
                        accelerate : true,
                        enableKeyEvents : true,
                        listeners  : {
                            keyup : function()
                            {
                                ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                            },
                            spin : function()
                            {
                                ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                            }
                        }
                    }, {
                        xtype : 'displayfield',
                        value : _('0 means no limit'),
                        style : { fontStyle: 'italic'}
                    }]
                }]
            }, {
                title   : _('User Interface'),
                iconCls : 'iconUI',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('ScrollBars'),
                    iconCls     : 'iconScrollBar',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name        : 'newFileScrollbars',
                        checked     : PhDOE.user.conf.newFileScrollbars,
                        boxLabel    : _('Synchronize scroll bars'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'newFileScrollbars',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                },{
                    xtype       : 'fieldset',
                    title       : _('Google translate Panel'),
                    iconCls     : 'iconGoogle',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name        : 'newFileGGPanel',
                        checked     : PhDOE.user.conf.newFileGGPanel,
                        boxLabel    : _('Display the Google Translation Panel'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'newFileGGPanel',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
            }, {
                title   : _('Editor'),
                iconCls : 'iconEditor',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('SpellChecking'),
                    iconCls     : 'iconSpellCheck',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        autoHeight  : true,
                        name        : 'newFileSpellCheck',
                        checked     : PhDOE.user.conf.newFileSpellCheck,
                        boxLabel    : _('Enable spell checking'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'newFileSpellCheck',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
            }]
        });
        ui.cmp._EditorConf.card2.superclass.initComponent.call(this);
    }
});

// EditorConf card3 - Module "Files Need Update" Config
ui.cmp._EditorConf.card3 = Ext.extend(Ext.TabPanel,
{
    id         : 'conf-card-3',
    autoScroll : true,
    activeTab  : 0,
    defaults   : {
        bodyStyle  : 'padding: 5px;',
        autoHeight : true,
        autoScroll : true
    },

    initComponent : function()
    {
        Ext.apply(this,
        {
            items : [{
                title   : _('Menu'),
                iconCls : 'iconMenu',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('Nb files to display'),
                    iconCls     : 'iconFilesToDisplay',
                    defaults    : { hideLabel: true },
                    defaultType : 'spinnerfield',
                    items       : [{
                        width      : 60,
                        name       : 'needUpdateNbDisplay',
                        value      : PhDOE.user.conf.needUpdateNbDisplay || 0,
                        boxLabel   : _('files to display'),
                        minValue   : 0,
                        maxValue   : 10000,
                        accelerate : true,
                        enableKeyEvents : true,
                        listeners  : {
                            keyup : function()
                            {
                                ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                            },
                            spin : function()
                            {
                                ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                            }
                        }

                    }, {
                        xtype : 'displayfield',
                        value : _('0 means no limit'),
                        style : { fontStyle: 'italic'}
                    }]
                }]
            }, {
                title   : _('User Interface'),
                iconCls : 'iconUI',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('ScrollBars'),
                    iconCls     : 'iconScrollBar',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name        : 'needUpdateScrollbars',
                        checked     : PhDOE.user.conf.needUpdateScrollbars,
                        boxLabel    : _('Synchronize scroll bars'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'needUpdateScrollbars',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }, {
                    xtype       : 'fieldset',
                    title       : _('VCS Log'),
                    iconCls     : 'iconVCSLog',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name        : 'needUpdateDisplaylog',
                        checked     : PhDOE.user.conf.needUpdateDisplaylog,
                        boxLabel    : _('Automatically load the log when displaying the file'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'needUpdateDisplaylog',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        xtype          : 'fieldset',
                        checkboxToggle : true,
                        collapsed      : !PhDOE.user.conf.needUpdateDisplaylogPanel,
                        title          : _('Start with the panel open'),
                        listeners      : {
                            collapse : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'needUpdateDisplaylogPanel',
                                    value : false
                                });
                            },
                            expand : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'needUpdateDisplaylogPanel',
                                    value : true
                                });
                            }
                        },
                        items : [{
                            xtype      : 'spinnerfield',
                            width      : 60,
                            name       : 'needUpdateDisplaylogPanelWidth',
                            value      : PhDOE.user.conf.needUpdateDisplaylogPanelWidth || 375,
                            fieldLabel : _('Panel width'),
                            minValue   : 0,
                            maxValue   : 10000,
                            accelerate : true,
                            enableKeyEvents : true,
                            listeners  : {
                                keyup : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                },
                                spin : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                }
                            }
                        }]
                    }]
                }, {
                    xtype       : 'fieldset',
                    title       : _('Diff view'),
                    iconCls     : 'iconDiffView',
                    defaults    : { hideLabel: true },
                    defaultType : 'radio',
                    items       : [{
                        xtype          : 'fieldset',
                        checkboxToggle : true,
                        collapsed      : !PhDOE.user.conf.needUpdateDiffPanel,
                        title          : _('Start with the panel open'),
                        listeners      : {
                            collapse : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'needUpdateDiffPanel',
                                    value : false
                                });
                            },
                            expand : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'needUpdateDiffPanel',
                                    value : true
                                });
                            }
                        },
                        items : [{
                            xtype      : 'spinnerfield',
                            width      : 60,
                            name       : 'needUpdateDiffPanelHeight',
                            value      : PhDOE.user.conf.needUpdateDiffPanelHeight || 150,
                            fieldLabel : _('Panel height'),
                            minValue   : 0,
                            maxValue   : 10000,
                            accelerate : true,
                            enableKeyEvents : true,
                            listeners  : {
                                keyup : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                },
                                spin : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                }
                            }
                        }]
                    }, {
                        name       : 'needUpdateDiff',
                        checked    : (PhDOE.user.conf.needUpdateDiff === "using-viewvc") ? true : false,
                        boxLabel   : _('Using ViewVc from php web site'),
                        inputValue : 'using-viewvc',
                        listeners  : {
                            check  : function(field)
                            {
                                if (field.checked) {
                                    new ui.task.UpdateConfTask({
                                        item  : 'needUpdateDiff',
                                        value : field.getRawValue()
                                    });
                                }
                            }
                        }
                    }, {
                        name       : 'needUpdateDiff',
                        checked    : (PhDOE.user.conf.needUpdateDiff === "using-exec") ? true : false,
                        boxLabel   : _('Using diff -u command line'),
                        inputValue : 'using-exec',
                        listeners : {
                            check : function(field)
                            {
                                if (field.checked) {
                                    new ui.task.UpdateConfTask({
                                        item  : 'needUpdateDiff',
                                        value : field.getRawValue()
                                    });
                                }
                            }
                        }
                    }]
                }]
            }, {
                title   : _('Editor'),
                iconCls : 'iconEditor',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('SpellChecking'),
                    iconCls     : 'iconSpellCheck',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name      : 'needUpdateSpellCheckEn',
                        checked   : PhDOE.user.conf.needUpdateSpellCheckEn,
                        boxLabel  : String.format(_('Enable spell checking for the <b>{0}</b> file'), 'EN'),
                        listeners : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'needUpdateSpellCheckEn',
                                    value : field.getValue()
                                });
                            }
                        }
                    },{
                        name      : 'needUpdateSpellCheckLang',
                        checked   : PhDOE.user.conf.needUpdateSpellCheckLang,
                        boxLabel  : String.format(_('Enable spell checking for the <b>{0}</b> file'), Ext.util.Format.uppercase(PhDOE.user.lang)),
                        listeners : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'needUpdateSpellCheckLang',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
            }]
        });
        ui.cmp._EditorConf.card3.superclass.initComponent.call(this);
    }
});

// EditorConf card4 - Module "Files with Error" Config
ui.cmp._EditorConf.card4 = Ext.extend(Ext.TabPanel,
{
    id         : 'conf-card-4',
    autoScroll : true,
    activeTab  : 0,
    defaults   : {
        bodyStyle  : 'padding: 5px;',
        autoHeight : true,
        autoScroll : true
    },

    initComponent : function()
    {
        Ext.apply(this,
        {
            items : [{
                title   : _('Menu'),
                iconCls : 'iconMenu',
                items   : [{
                    hidden      : ( PhDOE.user.lang === 'en' ),
                    xtype       : 'fieldset',
                    title       : _('Error type'),
                    iconCls     : 'iconFilesError',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name       : 'errorSkipNbLiteralTag',
                        checked    : PhDOE.user.conf.errorSkipNbLiteralTag,
                        boxLabel   : _('Skip nbLiteralTag error'),
                        listeners  : {
                            check  : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorSkipNbLiteralTag',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
            }, {
                title   : _('User Interface'),
                iconCls : 'iconUI',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('ScrollBars'),
                    iconCls     : 'iconScrollBar',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name       : 'errorScrollbars',
                        checked    : PhDOE.user.conf.errorScrollbars,
                        boxLabel   : _('Synchronize scroll bars'),
                        listeners  : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorScrollbars',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }, {
                    xtype       : 'fieldset',
                    title       : _('Tools'),
                    iconCls     : 'iconConf',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name       : 'errorLogLoadData',
                        checked    : PhDOE.user.conf.errorLogLoadData,
                        boxLabel   : _('Automatically load the log when displaying the file'),
                        listeners : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorLogLoadData',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        name       : 'errorEntitiesLoadData',
                        checked    : PhDOE.user.conf.errorEntitiesLoadData,
                        boxLabel   : _('Automatically load entities data when displaying the file'),
                        listeners : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorEntitiesLoadData',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        name       : 'errorAcronymsLoadData',
                        checked    : PhDOE.user.conf.errorAcronymsLoadData,
                        boxLabel   : _('Automatically load acronyms data when displaying the file'),
                        listeners : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorAcronymsLoadData',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        xtype          : 'fieldset',
                        checkboxToggle : true,
                        collapsed      : !PhDOE.user.conf.errorDisplaylogPanel,
                        title          : _('Start with the panel open'),
                        listeners      : {
                            collapse : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorDisplaylogPanel',
                                    value : false
                                });
                            },
                            expand : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorDisplaylogPanel',
                                    value : true
                                });
                            }
                        },
                        items: [{
                            xtype      : 'spinnerfield',
                            width      : 60,
                            name       : 'errorDisplaylogPanelWidth',
                            value      : PhDOE.user.conf.errorDisplaylogPanelWidth || 375,
                            fieldLabel : _('Panel width'),
                            minValue   : 0,
                            maxValue   : 10000,
                            accelerate : true,
                            enableKeyEvents : true,
                            listeners  : {
                                keyup : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                },
                                spin : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                }
                            }
                        }]
                    }]
                }, {
                    xtype       : 'fieldset',
                    title       : _('Error description'),
                    iconCls     : 'iconFilesError',
                    defaults    : { hideLabel: true },
                    defaultType : 'radio',
                    items       : [{
                        xtype          : 'fieldset',
                        checkboxToggle : true,
                        collapsed      : !PhDOE.user.conf.errorDescPanel,
                        title          : _('Start with the panel open'),
                        listeners      : {
                            collapse : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorDescPanel',
                                    value : false
                                });
                            },
                            expand : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorDescPanel',
                                    value : true
                                });
                            }
                        },
                        items : [{
                            xtype      : 'spinnerfield',
                            width      : 60,
                            name       : 'errorDescPanelHeight',
                            value      : PhDOE.user.conf.errorDescPanelHeight || 150,
                            fieldLabel : _('Panel height'),
                            minValue   : 0,
                            maxValue   : 10000,
                            accelerate : true,
                            enableKeyEvents : true,
                            listeners  : {
                                keyup : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                },
                                spin : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                }
                            }
                        }]
                    }]
                }]
            }, {
                title   : _('Editor'),
                iconCls : 'iconEditor',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('SpellChecking'),
                    iconCls     : 'iconSpellCheck',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        hidden      : ( PhDOE.user.lang === 'en' ),
                        name        : 'errorSpellCheckEn',
                        checked     : PhDOE.user.conf.errorSpellCheckEn,
                        boxLabel    : String.format(_('Enable spell checking for the <b>{0}</b> file'), 'EN'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorSpellCheckEn',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        name        : 'errorSpellCheckLang',
                        checked     : PhDOE.user.conf.errorSpellCheckLang,
                        boxLabel    : String.format(_('Enable spell checking for the <b>{0}</b> file'), Ext.util.Format.uppercase(PhDOE.user.lang)),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'errorSpellCheckLang',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
            }]
        });
        ui.cmp._EditorConf.card4.superclass.initComponent.call(this);
    }
});

// EditorConf card5 - Module "Files need Reviewed" Config
ui.cmp._EditorConf.card5 = Ext.extend(Ext.TabPanel,
{
    id         : 'conf-card-5',
    autoScroll : true,
    activeTab  : 0,
    defaults   : {
        bodyStyle  : 'padding: 5px;',
        autoHeight : true,
        autoScroll : true
    },

    initComponent : function()
    {
        Ext.apply(this,
        {
            items : [{
                title   : _('Menu'),
                iconCls : 'iconMenu',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('Nb files to display'),
                    iconCls     : 'iconFilesToDisplay',
                    defaults    : { hideLabel: true },
                    defaultType : 'spinnerfield',
                    items       : [{
                        width      : 60,
                        name       : 'reviewedNbDisplay',
                        value      : PhDOE.user.conf.reviewedNbDisplay || 0,
                        boxLabel   : _('files to display'),
                        minValue   : 0,
                        maxValue   : 10000,
                        accelerate : true,
                        enableKeyEvents : true,
                        listeners  : {
                            keyup : function()
                            {
                                ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                            },
                            spin : function()
                            {
                                ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                            }
                        }

                    }, {
                        xtype: 'displayfield',
                        value: _('0 means no limit'),
                        style: { fontStyle: 'italic'}
                    }]
                }]
            }, {
                title   : 'User Interface',
                iconCls : 'iconUI',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('ScrollBars'),
                    iconCls     : 'iconScrollBar',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name       : 'reviewedScrollbars',
                        checked    : PhDOE.user.conf.reviewedScrollbars,
                        boxLabel   : _('Synchronize scroll bars'),
                        listeners  : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'reviewedScrollbars',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }, {
                    xtype       : 'fieldset',
                    title       : _('VCS Log'),
                    iconCls     : 'iconVCSLog',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name       : 'reviewedDisplaylog',
                        checked    : PhDOE.user.conf.reviewedDisplaylog,
                        boxLabel   : _('Automatically load the log when displaying the file'),
                        listeners : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'reviewedDisplaylog',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        xtype          : 'fieldset',
                        checkboxToggle : true,
                        collapsed      : !PhDOE.user.conf.reviewedDisplaylogPanel,
                        title          : _('Start with the panel open'),
                        listeners      : {
                            collapse : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'reviewedDisplaylogPanel',
                                    value : false
                                });
                            },
                            expand : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'reviewedDisplaylogPanel',
                                    value : true
                                });
                            }
                        },
                        items : [{
                            xtype      : 'spinnerfield',
                            width      : 60,
                            name       : 'reviewedDisplaylogPanelWidth',
                            value      : PhDOE.user.conf.reviewedDisplaylogPanelWidth || 375,
                            fieldLabel : _('Panel width'),
                            minValue   : 0,
                            maxValue   : 10000,
                            accelerate : true,
                            enableKeyEvents : true,
                            listeners  : {
                                keyup : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                },
                                spin : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                }
                            }
                        }]
                    }]
                }]
            }, {
                title   : 'Editor',
                iconCls : 'iconEditor',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('SpellChecking'),
                    iconCls     : 'iconSpellCheck',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name        : 'reviewedSpellCheckEn',
                        checked     : PhDOE.user.conf.reviewedSpellCheckEn,
                        boxLabel    : String.format(_('Enable spell checking for the <b>{0}</b> file'), 'EN'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'reviewedSpellCheckEn',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        name        : 'reviewedSpellCheckLang',
                        checked     : PhDOE.user.conf.reviewedSpellCheckLang,
                        boxLabel    : String.format(_('Enable spell checking for the <b>{0}</b> file'), Ext.util.Format.uppercase(PhDOE.user.lang)),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'reviewedSpellCheckLang',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
            }]
        });
        ui.cmp._EditorConf.card5.superclass.initComponent.call(this);
    }
});

// EditorConf card6 - Module "All files" Config
ui.cmp._EditorConf.card6 = Ext.extend(Ext.TabPanel,
{
    id         : 'conf-card-6',
    autoScroll : true,
    activeTab  : 0,
    defaults   : {
        bodyStyle  : 'padding: 5px;',
        autoHeight : true,
        autoScroll : true
    },

    initComponent : function()
    {
        Ext.apply(this,
        {
            items : [{
                title   : _('User Interface'),
                iconCls : 'iconUI',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('Tools'),
                    iconCls     : 'iconConf',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name       : 'allFilesDisplayLog',
                        checked    : PhDOE.user.conf.allFilesDisplayLog,
                        boxLabel   : _('Automatically load the log when displaying the file'),
                        listeners  : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'allFilesDisplayLog',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        name       : 'allFilesEntitiesLoadData',
                        checked    : PhDOE.user.conf.allFilesEntitiesLoadData,
                        boxLabel   : _('Automatically load entities data when displaying the file'),
                        listeners  : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'allFilesEntitiesLoadData',
                                    value : field.getValue()
                                });
                            }
                        }
                    },{
                        name       : 'allFilesAcronymsLoadData',
                        checked    : PhDOE.user.conf.allFilesAcronymsLoadData,
                        boxLabel   : _('Automatically load acronyms data when displaying the file'),
                        listeners  : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'allFilesAcronymsLoadData',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        xtype          : 'fieldset',
                        checkboxToggle : true,
                        collapsed      : !PhDOE.user.conf.allFilesDisplaylogPanel,
                        title          : _('Start with the panel open'),
                        listeners      : {
                            collapse : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'allFilesDisplaylogPanel',
                                    value : false
                                });
                            },
                            expand : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'allFilesDisplaylogPanel',
                                    value : true
                                });
                            }
                        },
                        items: [{
                            xtype      : 'spinnerfield',
                            width      : 60,
                            name       : 'allFilesDisplaylogPanelWidth',
                            value      : PhDOE.user.conf.allFilesDisplaylogPanelWidth || 375,
                            fieldLabel : _('Panel width'),
                            minValue   : 0,
                            maxValue   : 10000,
                            accelerate : true,
                            enableKeyEvents : true,
                            listeners  : {
                                keyup : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                },
                                spin : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                }
                            }
                        }]
                    }]
                }]
            }, {
                title   : _('Editor'),
                iconCls : 'iconEditor',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('SpellChecking'),
                    iconCls     : 'iconSpellCheck',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name        : 'allFilesSpellCheck',
                        checked     : PhDOE.user.conf.allFilesSpellCheck,
                        boxLabel    : _('Enable spell checking'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'allFilesSpellCheck',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
            }]
        });
        ui.cmp._EditorConf.card6.superclass.initComponent.call(this);
    }
});

// EditorConf card7 - Module "Pending Patch" Config
ui.cmp._EditorConf.card7 = Ext.extend(Ext.TabPanel,
{
    id         : 'conf-card-7',
    autoScroll : true,
    activeTab  : 0,
    defaults   : {
        bodyStyle  : 'padding: 5px;',
        autoHeight : true,
        autoScroll : true
    },

    initComponent : function()
    {
        Ext.apply(this,
        {
            items : [{
                title   : _('User Interface'),
                iconCls : 'iconUI',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('ScrollBars'),
                    iconCls     : 'iconScrollBar',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name       : 'patchScrollbars',
                        checked    : PhDOE.user.conf.patchScrollbars,
                        boxLabel   : _('Synchronize scroll bars'),
                        listeners  : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'patchScrollbars',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }, {
                    xtype       : 'fieldset',
                    title       : _('VCS Log'),
                    iconCls     : 'iconVCSLog',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name       : 'patchDisplaylog',
                        checked    : PhDOE.user.conf.patchDisplaylog,
                        boxLabel   : _('Automatically load the log when displaying the file'),
                        listeners : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'patchDisplaylog',
                                    value : field.getValue()
                                });
                            }
                        }
                    }, {
                        xtype          : 'fieldset',
                        checkboxToggle : true,
                        collapsed      : !PhDOE.user.conf.patchDisplaylogPanel,
                        title          : _('Start with the panel open'),
                        listeners      : {
                            collapse : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'patchDisplaylogPanel',
                                    value : false
                                });
                            },
                            expand : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'patchDisplaylogPanel',
                                    value : true
                                });
                            }
                        },
                        items: [{
                            xtype      : 'spinnerfield',
                            width      : 60,
                            name       : 'patchDisplaylogPanelWidth',
                            value      : PhDOE.user.conf.patchDisplaylogPanelWidth || 375,
                            fieldLabel : _('Panel width'),
                            minValue   : 0,
                            maxValue   : 10000,
                            accelerate : true,
                            enableKeyEvents : true,
                            listeners  : {
                                keyup : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                },
                                spin : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                }
                            }
                        }]
                    }]
                }, {
                    xtype       : 'fieldset',
                    title       : _('Patch content'),
                    iconCls     : 'iconPendingPatch',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        xtype          : 'fieldset',
                        checkboxToggle : true,
                        collapsed      : !PhDOE.user.conf.patchDisplayContentPanel,
                        title          : _('Start with the panel open'),
                        listeners      : {
                            collapse : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'patchDisplayContentPanel',
                                    value : false
                                });
                            },
                            expand : function()
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'patchDisplayContentPanel',
                                    value : true
                                });
                            }
                        },
                        items : [{
                            xtype      : 'spinnerfield',
                            width      : 60,
                            name       : 'patchDisplayContentPanelHeight',
                            value      : PhDOE.user.conf.patchDisplayContentPanelHeight || 375,
                            fieldLabel : _('Panel height'),
                            minValue   : 0,
                            maxValue   : 10000,
                            accelerate : true,
                            enableKeyEvents : true,
                            listeners  : {
                                keyup : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                },
                                spin : function()
                                {
                                    ui.cmp._EditorConf.CommitChange.delay(1000, null, this);
                                }
                            }
                        }]
                    }]
                }]
            }, {
                title   : _('Editor'),
                iconCls : 'iconEditor',
                items   : [{
                    xtype       : 'fieldset',
                    title       : _('SpellChecking'),
                    iconCls     : 'iconSpellCheck',
                    defaults    : { hideLabel: true },
                    defaultType : 'checkbox',
                    items       : [{
                        name        : 'patchSpellCheck',
                        checked     : PhDOE.user.conf.patchSpellCheck,
                        boxLabel    : _('Enable spell checking'),
                        listeners   : {
                            check : function(field)
                            {
                                new ui.task.UpdateConfTask({
                                    item  : 'patchSpellCheck',
                                    value : field.getValue()
                                });
                            }
                        }
                    }]
                }]
            }]
        });
        ui.cmp._EditorConf.card7.superclass.initComponent.call(this);
    }
});

//------------------------------------------------------------------------------
// EditorConf Win
ui.cmp.EditorConf = Ext.extend(Ext.Window,
{
    id          : 'win-conf',
    layout      : 'border',
    width       : 700,
    height      : 470,
    iconCls     : 'iconConf',
    title       : _('Configuration'),
    modal       : true,
    plain       : true,
    bodyBorder  : false,
    closeAction : 'hide',
    buttons     : [{
        text   : _('Close'),
        handler: function()
        {
            Ext.getCmp('win-conf').hide();
        }
    }],

    listeners : {
        show : function()
        {
            var view = Ext.getCmp('conf-menu-view');
            view.select(view.getNode(0));
        }
    },

    initComponent : function()
    {
        if (PhDOE.user.lang === 'en') {
            ui.cmp._EditorConf.menuStore.loadData(ui.cmp._EditorConf.menuDefEn);
        } else {
            ui.cmp._EditorConf.menuStore.loadData(ui.cmp._EditorConf.menuDefNonEn);
        }

        Ext.apply(this,
        {
            items : [{
                id         : 'confMenu',
                region     : 'west',
                border     : false,
                width      : 190,
                autoScroll : true,
                items      : [new ui.cmp._EditorConf.viewMenu()]
            }, {
                id         : 'confCard',
                region     : 'center',
                border     : false,
                layout     : 'card',
                width      : 375,
                frame      : true,
                activeItem : 0,

                bbar : new Ext.ux.StatusBar({
                    defaultText    : _('All changes take effect immediately'),
                    defaultIconCls : 'confStatusBar'
                }),

                items : [
                    new ui.cmp._EditorConf.card1(),
                    new ui.cmp._EditorConf.card2(),
                    new ui.cmp._EditorConf.card3(),
                    new ui.cmp._EditorConf.card4(),
                    new ui.cmp._EditorConf.card5(),
                    new ui.cmp._EditorConf.card6(),
                    new ui.cmp._EditorConf.card7()
                ]
            }]
        });
        ui.cmp.EditorConf.superclass.initComponent.call(this);
    }
});