Ext.namespace('ui','ui.component','ui.component._PortletTranslator');

//------------------------------------------------------------------------------
// PortletTranslator internals

// Store : Translator with Informations like Revcheck first table
ui.component._PortletTranslator.store = new Ext.data.Store({
    proxy : new Ext.data.HttpProxy({
        url: './do/getTranslatorInfo'
    }),
    reader : new Ext.data.JsonReader(
        {
            root          : 'Items',
            totalProperty : 'nbItems',
            id            : 'id'
        }, Ext.data.Record.create([
            {
                name    : 'id',
                mapping : 'id'
            }, {
                name    : 'name',
                mapping : 'name'
            }, {
                name    : 'email',
                mapping : 'mail'
            }, {
                name    : 'nick',
                mapping : 'nick'
            }, {
                name    : 'vcs',
                mapping : 'vcs'
            }, {
                name    : 'uptodate',
                mapping : 'uptodate',
                type    : 'int'
            }, {
                name    : 'stale',
                mapping : 'stale',
                type    : 'int'
            }, {
                name    : 'sum',
                mapping : 'sum',
                type    : 'int'
            }
        ])
    )
});
ui.component._PortletTranslator.store.setDefaultSort('nick', 'asc');

// PortletTranslator cell renderer for translator count
ui.component._PortletTranslator.translatorSumRenderer = function(value)
{
    if (value) {
        var v = (value === 0 || value > 1) ? value : 1;
        return String.format('('+_('{0} Translators')+')', v);
    } else {
        return false;
    }
};

// PortletTranslator cell renderer for up-to-date column
ui.component._PortletTranslator.uptodateRenderer = function(value)
{
    if (value === '0') {
        return false;
    } else {
        return '<span style="color:green; font-weight: bold;">' + value + '</span>';
    }
};

// PortletTranslator cell renderer for stale column
ui.component._PortletTranslator.staleRenderer = function(value)
{
    if (value === '0') {
        return false;
    } else {
        return '<span style="color:red; font-weight: bold;">' + value + '</span>';
    }
};

// PortletTranslator cell renderer for sum column
ui.component._PortletTranslator.sumRenderer = function(value)
{
    return (value === '0') ? '' : value;
};

// PortletTranslator columns definition
ui.component._PortletTranslator.gridColumns = [
    new Ext.grid.RowNumberer(), {
        id              : 'GridTransName',
        header          : _('Name'),
        sortable        : true,
        dataIndex       : 'name',
        summaryType     : 'count',
        summaryRenderer : ui.component._PortletTranslator.translatorSumRenderer
    }, {
        header    : _('Email'),
        width     : 110,
        sortable  : true,
        dataIndex : 'email'
    }, {
        header    : _('Nick'),
        width     : 70,
        sortable  : true,
        dataIndex : 'nick'
    }, {
        header    : _('VCS'),
        width     : 45,
        sortable  : true,
        dataIndex : 'vcs'
    }, {
        header      : _('UptoDate'),
        width       : 60,
        sortable    : true,
        renderer    : ui.component._PortletTranslator.uptodateRenderer,
        dataIndex   : 'uptodate',
        summaryType : 'sum'
    }, {
        header      : _('Stale'),
        width       : 90,
        sortable    : true,
        renderer    : ui.component._PortletTranslator.staleRenderer,
        dataIndex   : 'stale',
        summaryType : 'sum'
    }, {
        header      : _('Sum'),
        width       : 50,
        sortable    : true,
        renderer    : ui.component._PortletTranslator.sumRenderer,
        dataIndex   : 'sum',
        summaryType : 'sum'
    }
];

//------------------------------------------------------------------------------
// PortletTranslator
ui.component._PortletTranslator.grid = Ext.extend(Ext.grid.GridPanel,
{
    loadMask         : true,
    autoScroll       : true,
    autoHeight       : true,
    plugins          : [new Ext.ux.grid.GridSummary()],
    store            : ui.component._PortletTranslator.store,
    columns          : ui.component._PortletTranslator.gridColumns,
    autoExpandColumn : 'GridTransName',
    sm               : new Ext.grid.RowSelectionModel({singleSelect:true}),
    lang             : this.lang,
    EmailPrompt      : new ui.component.EmailPrompt(),

    onRowDblClick : function(grid, rowIndex)
    {

        this.getSelectionModel().selectRow(rowIndex);

        if( this.ctxTranslatorName ) {
            this.ctxTranslatorEmail = null;
            this.ctxTranslatorName  = null;
        }

        this.ctxTranslatorEmail = this.store.getAt(rowIndex).data.email;
        this.ctxTranslatorName  = this.store.getAt(rowIndex).data.name;
        var nick  = this.store.getAt(rowIndex).data.nick;

        // Don't open the email Prompt if the user is "nobody"
        if( nick == 'nobody' ) {
            return;
        }

        this.EmailPrompt.setData(this.ctxTranslatorName, this.ctxTranslatorEmail);
        this.EmailPrompt.show('lastUpdateTime');
    },

    onContextClick : function(grid, rowIndex, e)
    {
        if(!this.menu) {
            this.menu = new Ext.menu.Menu({
                id    : 'submenu-translators',
                items : [{
                    scope   : this,
                    text    : '',
                    iconCls : 'iconSendEmail',
                    handler : function()
                    {
                        this.EmailPrompt.setData(this.ctxTranslatorName, this.ctxTranslatorEmail);
                        this.EmailPrompt.show('lastUpdateTime');
                    }
                }, '-', {
                    scope   : this,
                    text    : String.format(_('Send an email to the {0}'), String.format(PhDOE.appConf.projectMailList, this.lang)),
                    iconCls : 'iconSendEmail',
                    handler : function()
                    {
                        this.EmailPrompt.setData('Php Doc Team ' + this.lang, String.format(PhDOE.appConf.projectMailList, this.lang));
                        this.EmailPrompt.show('lastUpdateTime');
                    }
                }]
            });
        }

        this.getSelectionModel().selectRow(rowIndex);
        e.stopEvent();

        if( this.ctxTranslatorName ) {
            this.ctxTranslatorName  = null;
            this.ctxTranslatorEmail = null;
        }
        this.ctxTranslatorName  = this.store.getAt(rowIndex).data.name;
        this.ctxTranslatorEmail = this.store.getAt(rowIndex).data.email;

        var nick  = this.store.getAt(rowIndex).data.nick;

        // Don't open the contextMenu if the user is "nobody"
        if( nick == 'nobody' ) {
            return;
        }

        // Set the title for items[0]
        this.menu.items.items[0].setText('<b>' + String.format(_('Send an email to {0}'), this.ctxTranslatorName) + '</b>');

        this.menu.showAt(e.getXY());

    },

    initComponent: function(config)
    {
        ui.component._PortletTranslator.grid.superclass.initComponent.call(this);
        Ext.apply(this, config);
        this.on('rowcontextmenu', this.onContextClick, this);
        this.on('rowdblclick',    this.onRowDblClick,  this);
    }
});

//------------------------------------------------------------------------------
// PortletTranslator
ui.component.PortletTranslator = Ext.extend(Ext.ux.Portlet,
{
    title   : _('Translators'),
    iconCls : 'iconTranslator',
    layout  : 'fit',
    store   : ui.component._PortletTranslator.store,
    tools   : [{
        id : 'refresh',
        qtip: _('Refresh this grid'),
        handler: function() {
            ui.component._PortletTranslator.store.reload();
        }
    }],
    initComponent: function(config) {

        ui.component.PortletTranslator.superclass.initComponent.call(this);
        Ext.apply(this, config);

        this.add(new ui.component._PortletTranslator.grid({lang: this.lang}));

    }
});

// singleton
ui.component._PortletTranslator.instance = null;
ui.component.PortletTranslator.getInstance = function(config)
{
    if (!ui.component._PortletTranslator.instance) {
        if (!config) {
            config = {};
        }
        ui.component._PortletTranslator.instance = new ui.component.PortletTranslator(config);
    }
    return ui.component._PortletTranslator.instance;
};
