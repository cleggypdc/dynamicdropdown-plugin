/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2011 Weblizards GbR (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de>
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.object.tags.dynamicDropdown");
pimcore.object.tags.dynamicDropdown = Class.create(pimcore.object.tags.select, {

    type: "dynamicDropdown",

    initialize: function (data, layoutConf) {
        this.data = data;
        this.fieldConfig = layoutConf;
        //this.fieldConfig.width = 250;
        this.mode = 'remote';

        this.fieldConfig.index = 15005;
    },

    getGridColumnEditor:function (field) {
        return null;
    },

    getGridColumnFilter:function (field) {
        return null;
    },
    
    getLayoutEdit: function () {


        var options_store = Ext.create('Ext.data.JsonStore', {
           proxy: {
               type: 'ajax',
               url: '/plugin/DynamicdropdownPlugin/dynamicdropdown/options',
               reader: {
                   type: 'json',
               },
               extraParams: {
                   source_parent: this.fieldConfig.source_parentid,
                   source_methodname: this.fieldConfig.source_methodname,
                   source_classname: this.fieldConfig.source_classname,
                   source_recursive: this.fieldConfig.source_recursive,
                   current_language: pimcore.settings.language,
                   sort_by: this.fieldConfig.sort_by
               }
           },
            autoLoad: true,
            listeners: {
                "load": function (store) {
                    this.component.setValue(this.data);
                }.bind(this)
            },
            fields: ['value', 'key']
        });


        var options = {
            name: this.fieldConfig.name,
            triggerAction: "all",
            editable: true,
            typeAhead: true,
            forceSelection: true,
            selectOnFocus: true,
            fieldLabel: this.fieldConfig.title,
            store: options_store,
            itemCls: "object_field",
            width: 300,
            displayField: "key",
            valueField: "value",
            mode: "local",
            autoSelect: true
        };

        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        }

        this.component = new Ext.form.ComboBox(options);
        return this.component;
    }    

});
