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

pimcore.registerNS("pimcore.object.classes.data.dynamicDropdown");
pimcore.object.classes.data.dynamicDropdown = Class.create(pimcore.object.classes.data.data, {

    type: "dynamicDropdown",
    allowIndex: true,
		
    /**
      * define where this datatype is allowed
      */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true
    },

    allowedClassStore: null,

    initialize: function (treeNode, initData) {
        this.type = "dynamicDropdown";

        this.initData(initData);
        this.treeNode = treeNode;

        try {
            this.id = this.type + "_" + treeNode.getId();
        } catch(e) {
            //fallback for ext 3x
            this.id = this.type + "_" + treeNode.attributes.id;
        }

    },

    getTypeName: function () {
        return t("dynamicDropdown");
    },

    getGroup: function () {
        return "select";
    },

    getIconClass: function () {
        return "Dynamicdropdown_icon_element";
    },

    getLayout: function ($super) {

        $super();

        this.specificPanel.removeAll();
        this.specificPanel.add([
            {
                xtype: "spinnerfield",
                fieldLabel: t("width"),
                name: "width",
                value: this.datax.width
            }
        ]);

        this.specificPanel.add([
        {
            xtype: "textfield",
            fieldLabel: t("parentid"),
            name: "source_parentid",
            cls: "input_drop_target",
            value: this.datax.source_parentid,
            allowEmpty: false,
            listeners: {
                "render": function (el) {
                    new Ext.dd.DropZone(el.getEl(), {
                        reference: this,
                        ddGroup: "element",
                        getTargetFromEvent: function(e) {
                            return this.getEl();
                        }.bind(el),

                        onNodeOver : function(target, dd, e, data) {

                            try {
                                if (data.records.first().get('type') === "folder") {
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                }
                            } catch(e) {
                                //fallback for < pimcore 4
                                if (data.node.attributes.type === "folder") {
                                    return Ext.dd.DropZone.prototype.dropAllowed;
                                }
                            }

                            return Ext.dd.DropZone.prototype.dropNotAllowed;
                        },

                        onNodeDrop : function (target, dd, e, data) {
                            try {
                                if (data.records.first().get('type') === "folder") {
                                    this.setValue(data.records.first().get('path'));
                                    return true;
                                }
                            } catch(e) {
                                //fallback for < pimcore 4
                                if (data.node.attributes.type == "folder") {
                                    this.setValue(data.node.attributes.path);
                                    return true;
                                }
                            }
                            return false;
                        }.bind(el)
                    });
                }
            }

        }
        ]);

        var source_recursive = this.specificPanel.add([{
            xtype: "checkbox",
            fieldLabel: t("recursive"),
            name: "source_recursive",
//            id: "source_recursive",
            checked: this.datax.source_recursive
        }]);

        var sortby_combobox = this.specificPanel.add([
            {
                xtype: "combo",
                fieldLabel: t("Sort by"),
                name: "sort_by",
//                id: "sortby",
                listWidth: 'auto',
                triggerAction: 'all',
                editable: false,
                value: this.datax.sort_by ? this.datax.sort_by : "byid",
                store: [["byid", t("id")],["byvalue", t("value")]]
            }
        ]);

        //there's that much difference between 3.4 and 6 even the version checks are awkward :-(
        if(pimcore.settings.build > 3546) {
            var allowed_class_store = Ext.create('Ext.data.JsonStore', {
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: '/admin/class/get-tree',
                    reader: {
                        type: 'json'
                    }
                },
                storeId: 'dd_allowed_classes',
                fields: ['text','id']
            });

        } else {
            //fallback for ext3
            var allowed_class_store = new Ext.data.JsonStore({
                url: '/admin/class/get-tree',
                fields: ["text","id"]
            });

        }

        var classname_combobox = this.specificPanel.add([
        {
            xtype: "combo",
            fieldLabel: t("allowed_classes"),
            name: "source_classname",
            id: this.id + "_classname",
            method_id: this.id + "_methodnames",
            listWidth: 'auto',
            triggerAction: 'all',
            editable: false,
            store: allowed_class_store,
            displayField: "text",
            valueField: "text",
            queryMode: 'local',
            forceSelection: true,
            value: this.datax.source_classname,

            listeners: {
                expand: {
                    fn: function(combo, value) {
                        var methodnames = Ext.getCmp(this.method_id);
                        methodnames.disable();
                    }
                },
                collapse: {
                    fn: function(combo, value) {
                        var methodnames = Ext.getCmp(this.method_id);

                        var loadDone = function(store, records, options) {
                            store.un("load", loadDone);
                            methodnames.enable();
                        };

                        methodnames.store.on("load", loadDone);
                        methodnames.store.reload({
                            params: {
                                classname: combo.getValue()
                            }
                        });
                        methodnames.setValue("");
                    }
                }


            }
        }
        ]);

        if (pimcore.settings.build > 3546) {

            var methodnames_store = Ext.create('Ext.data.JsonStore', {
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: '/plugin/DynamicdropdownPlugin/dynamicdropdown/methods',
                    reader: {
                        type: 'json'
                    },
                    extraParams: {
                        classname: Ext.getCmp(this.id + "_classname").getValue()
                    }
                },
                storeId: 'dd_method_names',
                fields: ['key','value']
            });

        } else {

            var methodnames_store = new Ext.data.JsonStore({
                url: '/plugin/DynamicdropdownPlugin/dynamicdropdown/methods',
                fields: ["key","value"],
                baseParams: {
                    classname: Ext.getCmp(this.id + "_classname").getValue()
                }
            });

        }

        this.specificPanel.add([
        {
            xtype: "combo",
            fieldLabel: t("methodname"),
            name: "source_methodname",
            id: this.id + "_methodnames",
            listWidth: 'auto',
            triggerAction: 'all',
            editable: false,
            store: methodnames_store,
            displayField: "value",
            valueField: "key",
            queryMode: 'local',
            forceSelection: true,
            value: this.datax.source_methodname
        }


        ]);

        return this.layout;
    },
    isValid: function ($super) {
        var data = this.getData();
        if (data.source_classname == "" || data.source_methodname == "" || data.source_parentid == "") return false;

        return $super();
    }
});
