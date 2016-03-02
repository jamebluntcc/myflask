/**
 * [ajaxSend ajax request]
 * @param  {[type]} reqUest_url
 * @param  {[type]} post_data
 * @param  {[type]} callback
 * @param  {[type]} request_method default:POST
 * @param  {[type]} return_type    default:json
 * @param  {[type]} dict_vars
 */
function escapeValue(value){
    if (value) {
        var result = value.indexOf("<script") != -1 ? escape(value).substr(0, 50) : value;
        return result;
    }
    return '';
}

// format nonvalue cell
function noneValueFormat(cellvalue, options, rowObject) {
    if (cellvalue == 'None') {
        return '';
    } else if (!cellvalue) {
        return '';
    } else {
        return cellvalue;
    }
}

function noneValueUnFormat(cellvalue, options) {
    if (cellvalue == 'undefined') {
        return '';
    } else {
        return cellvalue;
    }
}

function linkValueUnFormat(cellvalue, options) {
    if (cellvalue == 'undefined') {
        return '';
    } else {
        return cellvalue;
    }
}

function rev_no_formatter(cellvalue, options, rowObject) {
    var colname = options.colModel.name.replace(' ', '_');
    if (!cellvalue) {
        return '';
    }
    return "<a href='#' rev_id='{0}' node_type='{1}' publish='{2}' name='{3}'>{4}</a>".format(rowObject.rev_id, rowObject.node_type, publish, colname, cellvalue);
}

function original_file_formatter(cellvalue, options, rowObject) {
    var windows_path = rowObject.file_path,
        file_path;
    if (windows_path.indexOf('upload/') != -1) {
        file_path = 'static/datasheet/' + windows_path;
    } else {
        file_path = 'file:///\\\\FCA-FS6\\PVAShared\\' + windows_path.replace('ShareDrive/', '').replace(/\//g, '\\');
    }
    return "<a href='{0}' target='_blank'>{1}</a>".format(file_path, rowObject['Original File']);
}

// construct model for jqgrid
function get_colmodel(node_type, edit_page) {
    var col_model;
    if (node_type === "root") {
        col_model = [
            { name: 'change_type', index: 'change_type', hidden: true },
            { name: 'lock', index: 'lock', hidden: true },
            { name: 'Actions', index: 'Actions', sortable: false, sortable: false, hidden: true, width: getColumnWidth(node_type, 'Actions') || 100 },
            { name: 'part_master_id', index: 'part_master_id', hidden: true },
            { name: 'rev_id', index: 'rev_id', hidden: true },
            { name: 'Customer Name', index: 'Customer Name', hidden: get_hide_cookie('Customer Name'), editable: edit_page, editoptions: { maxLength: 50 }, width: getColumnWidth(node_type, 'Customer Name') || 500, searchoptions: { sopt: ['cn'] }},
            { name: 'Customer #', index: 'Customer #', hidden: get_hide_cookie('Customer #'), editable: edit_page, editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'Customer #') || 300, searchoptions: { sopt: ['cn'] }},
        ];
    } else if (node_type === "customer") {
        col_model = [
            { name: 'change_type', index: 'change_type', hidden: true },
            { name: 'lock', index: 'lock', hidden: true },
            { name: 'Actions', index: 'Actions', sortable: false, sortable: false, hidden: true, width: getColumnWidth(node_type, 'Actions') },
            { name: 'part_master_id', index: 'part_master_id', hidden: true },
            { name: 'rev_id', index: 'rev_id', hidden: true },
            { name: 'Name', index: 'Name', hidden: get_hide_cookie('Name'), editable: edit_page, editoptions: { maxLength: 31 }, width: getColumnWidth(node_type, 'Name') || 200, searchoptions: { sopt: ['cn'] }},
            { name: 'Life Cycle', index: 'Life Cycle', hidden: get_hide_cookie('Life Cycle'), editable: edit_page, edittype: 'select', editoptions: { value: life_cycle_list, maxLength: 20 }, sortable: false, width: getColumnWidth(node_type, 'Life Cycle'), searchoptions: { sopt: ['cn'] }},
            { name: 'Notes', index: 'Notes', hidden: get_hide_cookie('Notes'), editable: edit_page, sortable: false, editoptions: { maxLength: 200 }, width: getColumnWidth(node_type, 'Notes'), searchoptions: { sopt: ['cn'] }},
            { name: 'Group', index: 'Group', hidden: get_hide_cookie('Group'), editable: edit_page, edittype: 'select', editoptions: { value: folder_list, maxLength: 20 }, sortable: false, width: getColumnWidth(node_type, 'Group') || '100%', searchoptions: { sopt: ['cn'] }},
            { name: 'Creation Date', index: 'Creation Date', hidden: get_hide_cookie('Creation Date'), width: getColumnWidth(node_type, 'Creation Date') || 50, searchoptions: { sopt: ['cn'] }},
            { name: 'Created By', index: 'Created By', hidden: get_hide_cookie('Created By'), width: getColumnWidth(node_type, 'Created By'), searchoptions: { sopt: ['cn'] }},
            { name: 'Date', index: 'Date', hidden: get_hide_cookie('Date'), width: getColumnWidth(node_type, 'Date'), searchoptions: { sopt: ['cn'] }},
            { name: 'Updated By', index: 'Updated By', hidden: get_hide_cookie('Updated By'), width: getColumnWidth(node_type, 'Updated By'), searchoptions: { sopt: ['cn'] }},
            { name: 'Watch List', index: 'Watch List', hidden: get_hide_cookie('Watch List'), editable: edit_page, editoptions: { maxLength: 50 }, width: getColumnWidth(node_type, 'Watch List') || 200, searchoptions: { sopt: ['cn'] }},
        ];
    } else if (node_type === "platform") {
        col_model = [
            { name: 'change_type', index: 'change_type', hidden: true },
            { name: 'Actions', index: 'Actions', sortable: false, sortable: false, hidden: true, width: getColumnWidth(node_type, 'Actions') },
            { name: 'part_master_id', index: 'part_master_id', hidden: true },
            { name: 'rev_id', index: 'rev_id', hidden: true },
            { name: 'Description', index: 'Description', hidden: get_hide_cookie('Description'), editable: edit_page, editoptions: { maxLength: 31 }, width: getColumnWidth(node_type, 'Description'), searchoptions: { sopt: ['cn'] }},
            { name: 'Life Cycle', index: 'Life Cycle', hidden: get_hide_cookie('Life Cycle'), editable: edit_page, edittype: 'select', editoptions: { value: life_cycle_list, maxLength: 20 }, sortable: false, width: getColumnWidth(node_type, 'Life Cycle'), searchoptions: { sopt: ['cn'] }},
      //{name:'SNX Part', index:'SNX Part', hidden:get_hide_cookie('SNX Part'), editable:edit_page, width:getColumnWidth(node_type, 'SNX Part'), formatter:linkValueFormat, unformat:linkValueUnFormat, editoptions:{maxLength:50}},
            { name: 'SKU', index: 'SKU', hidden: get_hide_cookie('SKU'), editable: edit_page, width: getColumnWidth(node_type, 'SKU'), formatter: linkValueFormat, unformat: linkValueUnFormat, editoptions: { maxLength: 50 }, searchoptions: { sopt: ['cn'] } },
            { name: 'SNX Part#', index: 'SNX Part#', hidden: get_hide_cookie('SNX Part#'), editable: edit_page, width: getColumnWidth(node_type, 'SNX Part#'), formatter: noneValueFormat, unformat: noneValueUnFormat, editoptions: { maxLength: 50 }, searchoptions: { sopt: ['cn'] }},
            { name: 'Notes', index: 'Notes', hidden: get_hide_cookie('Notes'), editable: edit_page, editoptions: { maxLength: 200 }, width: getColumnWidth(node_type, 'Notes'), searchoptions: { sopt: ['cn'] }},
            { name: 'Created By', index: 'Created By', hidden: get_hide_cookie('Created By'), width: getColumnWidth(node_type, 'Created By'), searchoptions: { sopt: ['cn'] }},
            { name: 'Creation Date', index: 'Creation Date', hidden: get_hide_cookie('Creation Date'), width: getColumnWidth(node_type, 'Creation Date'), searchoptions: { sopt: ['cn'] }},
            { name: 'Latest REV', index: 'Latest REV', hidden: get_hide_cookie('Latest REV'), formatter: rev_no_formatter, width: getColumnWidth(node_type, 'Latest REV'), searchoptions: { sopt: ['cn'] }},
            { name: 'Date', index: 'Date', hidden: get_hide_cookie('Date'), width: getColumnWidth(node_type, 'Date'), searchoptions: { sopt: ['cn'] }},
            { name: 'Updated By', index: 'Updated By', hidden: get_hide_cookie('Updated By'), width: getColumnWidth(node_type, 'Updated By'), searchoptions: { sopt: ['cn'] }},
        ];
    } else if (node_type === "model") {
        col_model = [
            { name: 'change_type', index: 'change_type', hidden: true },
            { name: 'Actions', index: 'Actions', sortable: false, hidden: true, width: getColumnWidth(node_type, 'Actions') },
            { name: 'part_master_id', index: 'part_master_id', hidden: true },
            { name: 'rev_id', index: 'rev_id', hidden: true },
            { name: 'Type', index: 'Type', hidden: get_hide_cookie('Type'), editable: edit_page, edittype: 'select', editoptions: { value: group_list, maxLength: 50 }, width: getColumnWidth(node_type, 'Type') || 180, searchoptions: { sopt: ['cn'] }},
            { name: 'Name', index: 'Name', hidden: get_hide_cookie('Name'), editable: edit_page, editoptions: { maxLength: 31 }, width: getColumnWidth(node_type, 'Name'), searchoptions: { sopt: ['cn'] }},
            { name: 'Life Cycle', index: 'Life Cycle', hidden: get_hide_cookie('Life Cycle'), editable: edit_page, edittype: 'select', editoptions: { value: life_cycle_list, maxLength: 20 }, sortable: false, width: getColumnWidth(node_type, 'Life Cycle'), searchoptions: { sopt: ['cn'] }},
      //{name:'SNX Part', index:'SNX Part', hidden:get_hide_cookie('SNX Part'), editable:edit_page, formatter:linkValueFormat, unformat:linkValueUnFormat, editoptions:{maxLength:50}, width:getColumnWidth(node_type, 'SNX Part')||200},
            { name: 'SKU', index: 'SKU', hidden: get_hide_cookie('SKU'), editable: edit_page, width: getColumnWidth(node_type, 'SKU'), formatter: linkValueFormat, unformat: linkValueUnFormat, editoptions: { maxLength: 50 }, searchoptions: { sopt: ['cn'] } },
            { name: 'SNX Part#', index: 'SNX Part#', hidden: get_hide_cookie('SNX Part#'), editable: edit_page, width: getColumnWidth(node_type, 'SNX Part#'), formatter: noneValueFormat, unformat: noneValueUnFormat, editoptions: { maxLength: 50 }, searchoptions: { sopt: ['cn'] }},
            { name: 'Description', index: 'Description', hidden: get_hide_cookie('Description'), editable: edit_page, editoptions: { maxLength: 200 }, width: getColumnWidth(node_type, 'Description'), searchoptions: { sopt: ['cn'] }  },
            { name: 'Notes', index: 'Notes', hidden: get_hide_cookie('Notes'), editable: edit_page, sortable: false, editoptions: { maxLength: 200 }, width: getColumnWidth(node_type, 'Notes'), searchoptions: { sopt: ['cn'] }  },
            { name: 'QTY', index: 'QTY', hidden: get_hide_cookie('QTY'), editable: edit_page, editrules: { integer: true }, editoptions: { maxLength: 5 }, width: getColumnWidth(node_type, 'QTY') || 50, searchoptions: { sopt: ['cn'] } },
        ];
    }  else if (node_type === 'bom') {
        col_model = [
            //change_type is '' or null, means that not change, 1 means lead to add revision, 2 means that only notes change.
            { name: 'lock', index: 'lock', hidden: true },
            { name: 'change_type', index: 'change_type', hidden: true },
            { name: "sort_id", index: "sort_id", sorttype: "int", key:true, hidden:true },
            { name: 'Actions', index: 'Actions', sortable: false, hidden: true, width: getColumnWidth(node_type, 'Actions') },
            { name: 'part_master_id', index: 'part_master_id', hidden: true },
            { name: 'rev_id', index: 'rev_id', hidden: true },
            { name: 'mfg_part_rev_id', index: 'mfg_part_rev_id', hidden: true },
            { name: 'cust_part_rev_id', index: 'cust_part_rev_id', hidden: true },
            { name: '#', index: '#', hidden: get_hide_cookie('#'), frozen: false, editable: edit_page, formatter: noneValueFormat, editoptions: { maxLength: 8 }, width: getColumnWidth(node_type, '#') || 50, searchoptions: { sopt: ['cn'] } },
            { name: 'Type', index: 'Type', hidden: get_hide_cookie('Type'), editable: edit_page, edittype: 'select', editoptions: { value: group_list, maxLength: 50 }, width: getColumnWidth(node_type, 'Type') || 180, searchoptions: { sopt: ['cn'] } },
            { name: 'SNX Part#', index: 'SNX Part#', hidden: get_hide_cookie('SNX Part#'), editable: edit_page, width: getColumnWidth(node_type, 'SNX Part#'), formatter: noneValueFormat, unformat: noneValueUnFormat, editoptions: { maxLength: 50 }, searchoptions: { sopt: ['cn'] } },
            { name: 'MFG Part#', index: 'MFG Part#', hidden: get_hide_cookie('MFG Part#'), formatter: noneValueFormat, unformat: noneValueUnFormat, editable: edit_page, editoptions: { maxLength: 50 }, width: getColumnWidth(node_type, 'MFG Part#'), searchoptions: { sopt: ['cn'] } },
      //{name:'SNX Part', index:'SNX Part', hidden:get_hide_cookie('SNX Part'), editable:edit_page, formatter:linkValueFormat, unformat:linkValueUnFormat, editoptions:{maxLength:50}, width:getColumnWidth(node_type, 'SNX Part')||200},
            { name: 'SKU', index: 'SKU', hidden: get_hide_cookie('SKU'), editable: edit_page, width: getColumnWidth(node_type, 'SKU'), formatter: linkValueFormat, unformat: linkValueUnFormat, editoptions: { maxLength: 50 }, searchoptions: { sopt: ['cn'] } },
            { name: 'Description', index: 'Description', hidden: get_hide_cookie('Description'), editoptions: { maxLength: 200 }, editable: edit_page, width: getColumnWidth(node_type, 'Description'), searchoptions: { sopt: ['cn'] } },
            { name: 'Vendor', index: 'Vendor', hidden: get_hide_cookie('Vendor'), editable: edit_page, edittype: 'select', editoptions: { value: vendor_list, maxLength: 100 }, width: '100%', width: getColumnWidth(node_type, 'Vendor') || '100%', searchoptions: { sopt: ['cn'] } },
            { name: 'QTY', index: 'QTY', hidden: get_hide_cookie('QTY'), editable: edit_page, editoptions: { maxLength: 5 }, width: getColumnWidth(node_type, 'QTY') || 50, searchoptions: { sopt: ['cn'] } },
            { name: 'Percent', index: 'Percent', hidden: get_hide_cookie('Percent'), editable: edit_page, editoptions: { maxLength: 5 }, width: getColumnWidth(node_type, 'Percent') || 50, searchoptions: { sopt: ['cn'] } },
            { name: 'Customer Part#', index: 'Customer Part#', hidden: get_hide_cookie('Customer Part#'), editable: edit_page, formatter: noneValueFormat, unformat: noneValueUnFormat, editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'Customer Part#'), searchoptions: { sopt: ['cn'] } },
            { name: 'Unit Cost', index: 'Unit Cost', hidden: get_hide_cookie('Unit Cost'), editable: edit_page, width: getColumnWidth(node_type, 'Unit Cost'), searchoptions: { sopt: ['cn'] } },
            { name: 'Notes', index: 'Notes', hidden: get_hide_cookie('Notes'), editable: edit_page, sortable: false, editoptions: { maxLength: 200 }, width: getColumnWidth(node_type, 'Notes'), searchoptions: { sopt: ['cn'] } },
            { name: 'F/W', index: 'F/W', hidden: get_hide_cookie('F/W'), editable: edit_page, editoptions: { maxLength: 50 }, width: getColumnWidth(node_type, 'F/W'), searchoptions: { sopt: ['cn'] } },
            { name: 'Life Cycle', index: 'Life Cycle', hidden: get_hide_cookie('Life Cycle'), editable: edit_page, edittype: 'select', editoptions: { value: life_cycle_list, maxLength: 20 }, sortable: false, width: getColumnWidth(node_type, 'Life Cycle'), searchoptions: { sopt: ['cn'] } },
            { name: 'Part Maintenance', index: 'Part Maintenance', hidden: get_hide_cookie('Part Maintenance'), formatter: noneValueFormat, unformat: noneValueUnFormat, editable: true, editoptions: { maxLength: 50 }, width: getColumnWidth(node_type, 'Part Maintenance'), searchoptions: { sopt: ['cn'] } },
        ];
    } else if (node_type === "agileModel"){
        col_model = [
            { name: 'model', index: 'model', hidden: get_hide_cookie('model'), editable: edit_page, editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'model') || 300, searchoptions: { sopt: ['cn'] }},
        ];
    } else if (node_type === "agileEntireRack"){
        col_model = [
            { name: 'cust_part_no', index: 'cust_part_no', hidden: get_hide_cookie('cust_part_no'), editable: edit_page, editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'cust_part_no') || 300, searchoptions: { sopt: ['cn'] }},
        ];
    } else if (node_type === "agileBom"){
        col_model = [

            { name: "sort_id", index: "sort_id", sorttype: "int", key:true, hidden:true },
            //{ name: 'top_sku_id', index: 'top_sku_id', hidden: get_hide_cookie('top_sku_id'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'top_sku_id') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'cust_part_no', index: 'cust_part_no', hidden: get_hide_cookie('cust_part_no'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'cust_part_no') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'part_type', index: 'part_type', hidden: get_hide_cookie('part_type'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'part_type') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'description', index: 'description', hidden: get_hide_cookie('description'), editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'description') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'bom_qty', index: 'bom_qty', hidden: get_hide_cookie('bom_qty'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'bom_qty') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'find_num', index: 'find_num', hidden: get_hide_cookie('find_num'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'find_num') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'life_cycle_phase', index: 'life_cycle_phase', hidden: get_hide_cookie('life_cycle_phase'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'life_cycle_phase') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'mfg_name', index: 'mfg_name', hidden: get_hide_cookie('mfg_name'), editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'mfg_name') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'mfg_part_no', index: 'mfg_part_no', hidden: get_hide_cookie('mfg_part_no'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'mfg_part_no') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'bios', index: 'bios', hidden: get_hide_cookie('bios'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'bios') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'bmc_impi', index: 'bmc_impi', hidden: get_hide_cookie('bmc_impi'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'bmc_impi') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'firmware', index: 'firmware', hidden: get_hide_cookie('firmware'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'firmware') || 100, searchoptions: { sopt: ['cn'] }},
            { name: 'category', index: 'category', hidden: get_hide_cookie('category'),  editoptions: { maxLength: 9 }, width: getColumnWidth(node_type, 'category') || 100, searchoptions: { sopt: ['cn'] }},
        ];
    }
    return col_model;
}

function get_colnames(node_type) {
    var col_names;
    switch (node_type) {
    case 'root':
        col_names = ["rev_id", "Customer Name", "Customer #"];
        break;
    case 'customer':
        col_names = ["rev_id", "Name", "Life Cycle", "Group", "Notes", "Creation Date", "Created By", "Date", "Updated By", "Watch List"];
        break;
    case 'platform':
        col_names = ["rev_id", "Description", "Life Cycle", "SKU", "SNX Part#", "Notes", "Created By", "Creation Date", "Latest REV", "Date", "Updated By"];
        break;
    case 'model':
        col_names = ["rev_id", "Type", "Name", "Life Cycle", "SKU", "SNX Part#", "Description", "Notes", "QTY"];
        break;
    default:
        col_names = ["rev_id", "#", "Type", "SKU", "SNX Part#", "MFG Part#", "Description", "QTY", "Percent", "Unit Cost", "Vendor", "Customer Part#", "Notes", "F/W", "Life Cycle", "Part Maintenance"];
        break;
    }
    return col_names;
}

function is_column_editable(node_type, col_name) {
    var is_editable = false;
    var col_models = get_colmodel(node_type, true);
    for (var i = 0; i < col_models.length; i++) {
        if (col_name == col_models[i].name) {
            is_editable = col_models[i].editable;
            return is_editable;
        }
    }
    return is_editable;
}


function addEditActions(ids) {
    for (var i = 0; i < ids.length; i++) {
        var cl = ids[i];
        up = "<input type='button' class='move_up' onclick=\"move_up(this)\" />";
        down = "<input type='button' class='move_down' onclick=\"move_down(this)\" />";
        del = "<input type='button' class='del_row' title='Delete this part' onclick=\"del_row('detail-table','" + cl + "')\" />";
        add = "<input type='button' class='add_row' title='Add alternative part' onclick=\"add_row('detail-table','" + cl + "', '1')\" />";
        $("#detail-table").jqGrid('setRowData', ids[i], {
            "Actions":  del + up + down
        })
    }
}

function removeEditActions(ids) {
    for (var i = 0; i < ids.length; i++) {
        $("#detail-table").jqGrid('setRowData', ids[i], {
            "Actions": ''
        })
    }
}

//add alternative part
function add_alternative_part() {
    var selected_row = $("#detail-table").getGridParam('selrow');
    if (!selected_row) {
        alert('Please select a part with same group first.');
    } else {
        add_row('detail-table', selected_row, 1);
    }
}

//add regular part
function add_regular_part() {
    var selected_row = $("#detail-table").getGridParam('selrow');
    add_row('detail-table', selected_row, 0);

}

 // get all data in brief info
function get_brief_data() {
    var brief_data = {};
    if ($(".save-changes").css('display') == 'none') {
        for (i in brief_columns) {
            brief_data[brief_columns[i]] = escapeValue($("#brief-info input[name='{0}']".format(brief_columns[i])).val());
        }
        brief_data['Life Cycle'] = escapeValue($("#brief-info select").val());
        return brief_data;
    }
    var briefs = $("#brief-info div").find('input[name]');
    for (var i = 0; i < briefs.length; i++) {
        if (briefs[i].attributes.readonly == undefined) {
            brief_data[briefs[i].attributes.name.value] = escapeValue(briefs[i].value);
        }
    }
    var selectinput = $("#brief-info select")
    brief_data[selectinput.attr('name')] = escapeValue(selectinput.next().children().val());

    return brief_data
}

// get all data in jqgrid
function get_detail_data(jqgrid) {
    var detail_data = [];
    ids = $("#" + jqgrid).getDataIDs();
    for (i in ids) {
        var row_data = {};
        if ($("tr#" + ids[i]).attr('editable') === '1') {
            col_names = get_colnames(node_type);
            for (j in col_names) {
                if (is_column_editable(node_type, col_names[j])) {
                    idselector = col_names[j].replace('#', '\\#');
                    idselector = idselector.replace(' ', '\\ ');
                    idselector = idselector.replace('/', '\\/');
                    row_data[col_names[j]] = escapeValue($("#" + ids[i] + "_" + idselector).parent().find('input').val());
                } else {
                    row_data[col_names[j]] = escapeValue($("#" + jqgrid).getCell(ids[i], col_names[j]));
                }
                if (row_data[col_names[j]].indexOf('<a') != -1) {
                    row_data[col_names[j]] = escapeValue(row_data[col_names[j]].match(/\>\d{1,}/)[0].replace('>', ''));
                }
            }
            row_data['Type'] = escapeValue($("#" + ids[i] + "_Type").next().children().val());
            // row_data['rev_id'] = $("#"+jqgrid).getCell(ids[i], 'rev_id');
            if (node_type == 'bom') {
                row_data['Vendor'] = escapeValue($("#" + ids[i] + "_Vendor").next().children().val());
                // row_data['#'] = $("#"+ids[i]+" td:eq(1)").text()
            }
            row_data['part_master_id'] = escapeValue($("#" + jqgrid).getCell(ids[i], 'part_master_id'));
            row_data['change_type'] = escapeValue($("#" + jqgrid).getCell(ids[i], 'change_type'));
            row_data['mfg_part_rev_id'] = escapeValue($("#" + jqgrid).getCell(ids[i], 'mfg_part_rev_id'));
            row_data['cust_part_rev_id'] = escapeValue($("#" + jqgrid).getCell(ids[i], 'cust_part_rev_id'));
            row_data['rowid'] = ids[i];
            row_data['lock'] = escapeValue($("#" + jqgrid).getCell(ids[i], 'lock'));
            if (node_type == 'customer') {
                var input_watch_list = $("#" + ids[i] + "_Watch\\ List");
                var li_elements = $(input_watch_list[0].parentNode).find('li');
                var mail_str = "";
                if (li_elements) {
                    for (var i = 0; i < li_elements.length; i++) {
                        mail_str += li_elements[i].children[0].title + ',';
                    }
                }
                if (mail_str) {
                    mail_str = mail_str.substring(0, mail_str.length - 1);
                }
                // $("#"+jqgrid).saveRow(ids[i])
                // row_data = $("#"+jqgrid).getRowData(ids[i])
                row_data['Watch List'] = mail_str;
            }
            detail_data.push(row_data);
                // $("#"+jqgrid).editRow(ids[i])
        } else {
            row_data = $("#" + jqgrid).getRowData(ids[i]);
            detail_data.push(row_data);
        }
    }

    for (i in detail_data) {
        for (key in detail_data[i]) {
            detail_data[i][key] = detail_data[i][key] || '';
            detail_data[i][key] = $.trim(detail_data[i][key]);
        }
    }

    return detail_data
}

function get_num_in_line_no(line_no) {
    line_no = String(line_no);
    var num_in_line_no = line_no.replace(/[a-zA-Z]/ig, '');
    if (isNaN(num_in_line_no)) {
        num_in_line_no = 0
    }
    return parseInt(num_in_line_no)
}

function get_char_in_line_no(line_no) {
    line_no = String(line_no)
    return line_no.replace(/[0-9]/ig, '')
}

function update_line_no(line_no, flag) {
    var num_in_line_no = get_num_in_line_no(line_no);
    var char_in_line_no = get_char_in_line_no(line_no);
    switch (flag) {
    case 'increase':
        return (num_in_line_no + 1) + char_in_line_no;
    case 'decrease':
        return (num_in_line_no - 1) + char_in_line_no;
    case 'add_group':
        if (char_in_line_no) {
            return num_in_line_no + String.fromCharCode(char_in_line_no.charCodeAt() + 1);
        } else {
            return num_in_line_no + 'A';
        }
    case 'remove_group':
        if (char_in_line_no != 'A') {
            return num_in_line_no + String.fromCharCode(char_in_line_no.charCodeAt() - 1);
        } else {
            return num_in_line_no
        }
    }
}

/**
     * Add a group to {group: [lineno]}
     * @param group group name
     */
    function add_part_to_group(group) {
        var lineno = ''
        if (group_lineno_map[group]) {
            var lineno_list = group_lineno_map[group];
            if (lineno_list.length == 1) {
                lineno_list[0] = update_line_no(lineno_list[0], 'add_group');
            }
            lineno = update_line_no(lineno_list[lineno_list.length - 1], 'add_group');
            lineno_list.push(lineno);
            group_lineno_map[group] = lineno_list;
            return lineno
        } else {
            group_num += 1;
            lineno = String(group_num);
            group_lineno_map[group] = [lineno];
            return lineno;
        }
    }

function del_part_from_group(group) {
    var lineno_list = group_lineno_map[group];
    if (lineno_list.length == 1) {
        delete group_lineno_map[group];
        for (g in group_lineno_map) {
            var lineno_list_g = group_lineno_map[g];
            if (get_num_in_line_no(lineno_list_g[0]) >= parseInt(lineno_list[0])) {
                for (i in lineno_list_g) {
                    lineno_list_g[i] = update_line_no(lineno_list_g[i], 'decrease');
                }
                group_lineno_map[g] = lineno_list_g;
            }
        }
        group_num -= 1;
    } else if (lineno_list.length == 2) {
        var num = get_num_in_line_no(lineno_list[0]);
        group_lineno_map[group] = [String(num)];
    } else {
        lineno_list.pop();
        group_lineno_map[group] = lineno_list;
    }
}

function create_line_no(jqgrid) {
    group_lineno_map = {};
    group_num = 0;

    var css = '';
    var ids = $("#" + jqgrid).getDataIDs();
    for (i = 0; i < ids.length; i++) {
        var this_group = $("#" + jqgrid).getCell(ids[i], 'Type');
        add_part_to_group(this_group);
    }
}

function refresh_line_no(jqgrid) {
    var ids = $("#" + jqgrid).getDataIDs();
    var index = {};
    for (var i = 0; i < ids.length; i++) {
        var group = $("#" + ids[i] + "_Type").next().children().val();
        if (!index[group]) {
            index[group] = 0;
        }
        var this_lineno = group_lineno_map[group][index[group]];
        index[group] += 1;
        $("#" + jqgrid).setCell(ids[i], '#', this_lineno);
    }
}

function add_row(jqgrid, currentRowId, alternative_flag) {
    var ids = $("#" + jqgrid).getDataIDs();
    var rowid = (ids.length == 0 ? 1 : Math.max.apply(Math, ids) + 1);
    var group = '-UNKNOWN-';

//    if (!alternative_flag) {
        if (currentRowId) {
            group = $("#" + currentRowId + "_Type").next().children().val();
            $("#" + jqgrid).jqGrid("addRowData", rowid, {
                'rev_id': added_rev_id,
                'part_master_id': added_rev_id,
                'Type': group,
                'lock': 0
            }, "after", currentRowId);
        } else {
            $("#" + jqgrid).jqGrid("addRowData", rowid, {
                'rev_id': added_rev_id,
                'part_master_id': added_rev_id,
                'lock': 0
            }, "end");
        }
        $("#" + jqgrid).editRow(rowid);
        addEditActions([rowid]);
        if (node_type == 'bom'){
            var str = "<div class='tree-wrap tree-wrap-ltr' style='width:18px;'><div class='ui-icon ui-icon-radio-off tree-leaf treeclick' style='left:0px;'></div></div><span class='cell-wrapperleaf'>" +
                "<input id='" + rowid + "_#' class='editable' type='text' maxlength='8' name='#' rowid='"+ rowid +"' style='width: 98%;'role='textbox'></span>";
            $($("#"+ rowid).children('td')[8]).append(str);
        }
    added_rev_id -= 1;

    setAutoComplete("input[name='SKU']", 'get_autocomplete', 'SKU');
    setAutoComplete("input[name='SNX Part#']", 'get_autocomplete', 'SNX Part#');
    setAutoComplete("input[name='Watch List']", 'get_autocomplete', 'Watch List');
    if (['bom', 'model', 'platform'].indexOf(node_type) != -1) {
        $("#" + rowid + " select").combobox();
        $("select[name='Life Cycle']").next().attr('name', 'Life Cycle');
        if (node_type == 'bom') {
            $("select[name='Type']").next().attr('name', 'Type');
            $("select[name='Vendor']").next().attr('name', 'Vendor');
            $("select[name='Vendor']").next().children().attr('name', 'Vendor');
            group = $("#" + rowid + "_Type").next().children().val();

            $("select[name='Type']+span>input").on('focus', function (e) {
                current_group = this.value;
            });

            $("select[name='Type']+span>input").on('blur', function (e) {
                if (this.value != current_group) {
                    del_part_from_group(current_group);
                    add_part_to_group(this.value);
                    //          refresh_line_no('detail-table');
                    current_group = this.value;
                }
            });

            var new_lineno = add_part_to_group(group);
            setEditable(rowid, ['#', ], true);
            //      $("#"+jqgrid).setCell(rowid, '#', new_lineno, true);
        } else if (node_type == 'model') {
            $("select[name='Type']").next().attr('name', 'Type');
        }
    }
    else if (node_type == 'customer'){
        $("#" + rowid + " select").combobox();
        $("select[name='Life Cycle']").next().attr('name', 'Life Cycle');
        $("select[name='Group']").next().attr('name', 'Group');
    }

    // set uneditable columns
    if (node_type == 'bom') {
        setEditable(rowid, ["MFG Part#", "Description", "Unit Cost", "Vendor", "Part Maintenance"], false);
    }
    $("span[name='Life Cycle'] input").attr('maxlength', '20');
}

function del_row(jqgrid, currentRowId) {
//    if (node_type == 'root' && $("#detail-table").getCell(currentRowId, 'lock') == '1'){
//        alert("cannot del this customer, readonly.");
//        return;
//    }
    var status = confirm("Are you sure to delete this item?");
    if (!status) {
        return false;
    }
    if (node_type == 'bom') {
//        var group = $("#" + currentRowId + "_Type").next().children().val();
//        del_part_from_group(group);
        $("#detail-table").delRowData(currentRowId);
    } else {
        $("#detail-table").delRowData(currentRowId);
    }
}

function compare_line_no(a, b) {
    digit_a = get_num_in_line_no(a);
    char_a = get_char_in_line_no(a);
    digit_b = get_num_in_line_no(b);
    char_b = get_char_in_line_no(b);
    if (digit_a < digit_b) {
        return -1
    } else if (digit_a > digit_b) {
        return 1
    } else {
        if (char_a.charCodeAt() < char_b.charCodeAt()) {
            return -1
        } else if (char_a.charCodeAt() > char_b.charCodeAt()) {
            return 1
        } else {
            return 0
        }
    }
}

function get_brief_compare_data(origin_brief_data, current_brief_data, title) {
    var data = {};
    var brief_changes = [];
    brief_diff_count = 0;
    brief_change_type = 0;
    for (i in title) {
        if (origin_brief_data[title[i]] == current_brief_data[title[i]]) {
            data[title[i]] = origin_brief_data[title[i]];
        } else {
            data[title[i]] = "<s title='{0}'>".format(origin_brief_data[title[i]]) + origin_brief_data[title[i]] + "</s>" + "<p class=color-orange title='{0}'>".format(current_brief_data[title[i]]) + current_brief_data[title[i]] + "</p>";
            brief_diff_count += 1;
            brief_changes.push(title[i]);
        }
    }
    if (brief_changes.length == 1 && brief_changes[0] == 'Notes'){
        brief_change_type = 2;
    }
    else if(brief_changes.length > 0){
        brief_change_type = 1;
    }
    return data;
}

function get_compare_data(detail_left, detail_right, compare_title) {
    var compare_data = [];
    var detail_left_dict = {};
    var detail_right_dict = {};
    var part_id_dict = {};
    var part_id_left = [];
    var part_id_right = [];
    var part_id_all = [];
    var detail_diff_count = 0;
    for (var i = 0; i < detail_left.length; i++) {
        var compare_key = detail_left[i]['part_master_id']+"_"+detail_left[i]['#'] + "_" + detail_left[i]['rev_id'];
        detail_left_dict[compare_key] = detail_left[i];
        part_id_left.push(compare_key);
    }
    for (var i = 0; i < detail_right.length; i++) {
        var compare_key = detail_right[i]['part_master_id']+"_"+detail_right[i]['#'] + "_" + detail_right[i]['rev_id'];
        detail_right_dict[compare_key] = detail_right[i];
        part_id_right.push(compare_key);
    }

    for (var i = 0; i < part_id_right.length; i++) {
        if (part_id_left.indexOf(part_id_right[i]) != -1) {
            part_id_dict[part_id_right[i]] = 'both';
        } else {
            part_id_dict[part_id_right[i]] = 'right';
        }
        part_id_all.push(part_id_right[i])
    }
    for (var i = 0; i < part_id_left.length; i++) {
        if (part_id_right.indexOf(part_id_left[i]) == -1) {
            part_id_dict[part_id_left[i]] = 'left';
            part_id_all.push(part_id_left[i])
        }
    }

//    part_id_all = part_id_all.sort(function (a, b) {
//        compare_line_no(a, b)
//    });
    for (var i = 0; i < part_id_all.length; i++) {
        var row = {};
        var mark = 0;
        if (part_id_dict[part_id_all[i]] == 'left') {
            for (var j = 0; j < compare_title.length; j++) {
                row[compare_title[j]] = "<s>" + (detail_left_dict[part_id_all[i]][compare_title[j]] || '') + "</s>";
                if (compare_title[j] != 'rev_id' && compare_title[j] != 'part_master_id') {
                    detail_diff_count += 1;
                }
                mark += 1;
            }
        } else if (part_id_dict[part_id_all[i]] == 'right') {
            for (var j = 0; j < compare_title.length; j++) {
                row[compare_title[j]] = "<p class=color-orange>" + (detail_right_dict[part_id_all[i]][compare_title[j]] || 'N/A') + "</p>";
                if (compare_title[j] != 'rev_id' && compare_title[j] != 'part_master_id') {
                    detail_diff_count += 1;
                }
                mark += 1;
            }
            var row_id = detail_right_dict[part_id_all[i]]['rowid'];
            $("#detail-table").setCell(row_id, 'change_type', '1');
        } else {
        //both
            var row_id = detail_right_dict[part_id_all[i]]['rowid'];
            if (node_type == 'bom' && detail_left_dict[part_id_all[i]]['#'].indexOf('-KIT') != -1){
                //don't compare phantom item
                $("#detail-table").setCell(row_id, 'change_type', '0');
                continue;
            }
            var change_item = [];
            for (var j = 0; j < compare_title.length; j++) {
                if (detail_left_dict[part_id_all[i]][compare_title[j]] != detail_right_dict[part_id_all[i]][compare_title[j]]){
                    change_item.push(compare_title[j]);
                    row[compare_title[j]] = "<s>" + (detail_left_dict[part_id_all[i]][compare_title[j]] || '') + "</s><br>" + "<p class=color-orange>" + (detail_right_dict[part_id_all[i]][compare_title[j]] || '') + "</p>"
                    if (compare_title[j] != 'rev_id' && compare_title[j] != 'part_master_id') {
                        detail_diff_count += 1;
                    }
                    mark += 1;

                }
                else {
                        row[compare_title[j]] = (detail_left_dict[part_id_all[i]][compare_title[j]] || '');
                    }
            }

            if (change_item.length == 1 && change_item[0] == 'Notes'){
                $("#detail-table").setCell(row_id, 'change_type', '2');
            }
            else if (change_item.length > 0){
                $("#detail-table").setCell(row_id, 'change_type', '1');
            }
        }
        if (mark > 0) {
            compare_data.push(row);
        }
    }
    data = {
        'compare_data': compare_data,
        'diff_count': detail_diff_count
    };
    return data;
}

function setAutoFillforEditSpart(inspector){
    var readonly_list = ['edit MFG Part#', 'edit Description', 'edit Unit Cost', 'edit Vendor'];
    $("input[title='edit "+inspector+"']").on('blur', function (e) {
        var obj = $("input[title='edit "+inspector+"']");
        if (obj.val().replace('.', '') == 'TBD'){
            for(var i=0;i<readonly_list.length;i++){
                $("input[title='" + readonly_list[i] + "']").removeAttr('readonly');
                $("input[title='" + readonly_list[i] + "']").val('');
                if(inspector == 'SKU'){
                    $("input[title='edit SNX Part#']").val('');
                }
                else{
                    $("input[title='edit SKU']").val('');
                }
            }
        }
        else{
            for(var i=0;i<readonly_list.length;i++){$("input[title='" + readonly_list[i] + "']").attr('readonly', '');}
            ajaxSend('get_part_info', {
                    'type': inspector,
                    'value': obj.val()
                }, function (data) {
                    get_ret_status(data);
                    if (!data.errcode) {
                        for(var i=0;i<readonly_list.length;i++){$("input[title='" + readonly_list[i] + "']").val(data.data[readonly_list[i].replace('edit ', '')]);}
                        $("input[title='edit SKU']").val(data.data['SKU']);
                        $("input[title='edit SNX Part#']").val(data.data['SNX Part#']);
                    }
                });
        }
    });
}

// init compare window, flag to distinguish compare-revisions(0) and change-log(1)
function init_compare(divid, jqgrid, flag) {
    var spinner = start_spin(divid, 'black');
    var node_type_here = node_type;
    if(flag == 2){
        node_type_here = 'bom';
    }
    $("#" + jqgrid).jqGrid({
        datatype: "local",
        colModel: get_colmodel(node_type_here, false),
        height: $(window).height() * 0.5,
        autowidth: true,
        rowNum: 200,
        cmTemplate: {
            sortable: false
        },
        ignoreCase: true
    });

    $("#" + jqgrid).jqGrid('filterToolbar', {
        searchOperators: true,
        odata: [
            { oper: 'eq', text: 'equal' },
            { oper: 'ne', text: 'not equal' },
            { oper: 'lt', text: 'less' },
            { oper: 'le', text: 'less or equal' },
            { oper: 'gt', text: 'greater' },
            { oper: 'ge', text: 'greater or equal' },
            { oper: 'bw', text: 'begins with' },
            { oper: 'bn', text: 'does not begin with' },
            { oper: 'in', text: 'is in' },
            { oper: 'ni', text: 'is not in' },
            { oper: 'ew', text: 'ends with' },
            { oper: 'en', text: 'does not end with' },
            { oper: 'cn', text: 'contains' },
            { oper: 'nc', text: 'does not contain' }
        ]
    });
    if ($("#compare-rev").attr("aria-hidden") == "false") {
        //compare-table is show
        if (!$(".filter-compare-button")[0].checked) {
            $(".ui-search-toolbar").hide();
        } else {
            $(".ui-search-toolbar").show();
        }
    } else if ($("#change-log").attr("aria-hidden") == "false") {
        //compare-table is show
        if (!$(".filter-changelog-button")[0].checked) {
            $(".ui-search-toolbar").hide();
        } else {
            $(".ui-search-toolbar").show();
        }
    }

    refresh_compare(flag);
    spinner.stop();
}
// compare page, on change selection
function refresh_compare(flag) {
    diff_count = 0;
    var node_type_here = node_type;
    if(flag==2){node_type_here = 'bom';} //flag =2 means that edit searched part.
    var compare_title = get_colnames(node_type_here);
    var left = $("#compare-left option:selected");
    var right = $("#compare-right option:selected");
    var left_val = left.val();
    var right_val = right.val();
    var detail_left = [];
    var detail_right = [];
    var is_search_spart = $("#search-spart").attr('aria-hidden');

    if (!flag) {
        var jqgrid_id = 'compare-table';
        var diff_id = 'diff-count';
        var left_node_type = left.attr('node_type');
        var left_rev_id = left.val()
    } else {
        var jqgrid_id = 'changes-table';
        var diff_id = 'changes-count';
        right_val = '';
        var left_node_type = node_type;
        var left_rev_id = rev_id;
    }
    if (is_search_spart == 'false') {
        jqgrid_id = 'spart-changes-table';
        $("#" + jqgrid_id).clearGridData();
        var new_row_data = {};
        for (var i in row_data) {
            new_row_data[i] = row_data[i];
        }
        var data_had_change = false;
        var values_obj = $(".new-value");
        for (var i = 0; i < values_obj.length; i++) {
            var title = values_obj[i].title.replace('edit ', '');
            if (values_obj[i].value != row_data[title]) {
                data_had_change = true;
                new_row_data[title] = values_obj[i].value;
            }
        }
        var row = {};
        for (var i = 1; i < compare_title.length; i++) {
            if (row_data[compare_title[i]] != new_row_data[compare_title[i]]) {
                row[compare_title[i]] = "<s>" + (row_data[compare_title[i]] || '') + "</s><br>" + "<p class=color-orange>" + (new_row_data[compare_title[i]] || '') + "</p>";
                diff_count += 1
            } else {
                row[compare_title[i]] = (row_data[compare_title[i]] || '');
            }
        }
        $("#" + jqgrid_id).jqGrid("addRowData", 1, row);
        $("#spart-changes-count").html("Total " + diff_count + " differences");
        return;
    }
    $("#" + jqgrid_id).clearGridData();
    if (right_val) {
        ajaxSend("get_detail", {
            "node_type": right.attr('node_type'),
            "rev_id": right_val
        }, function (data) {
            get_ret_status(data);
            detail_right = data['data'];
            ajaxSend("get_detail", {
                "node_type": left_node_type,
                "rev_id": left_rev_id
            }, function (data) {
                get_ret_status(data);
                detail_left = data['data'];
                var compare_datas = get_compare_data(detail_left, detail_right, compare_title);
                var compare_data = compare_datas['compare_data'];
                diff_count += compare_datas['diff_count'];
                    // add data to jqgrid
                if (diff_count == 0) {
                    $("#gview_compare-table").hide();
                    $("#gview_changes-table").hide();
                    $(".no-changes").show();
                } else {
                    $(".no-changes").hide();
                    $("#gview_compare-table").show();
                    $("#gview_changes-table").show();
                    for (var i = 0; i < compare_data.length; i++) {
                        $("#" + jqgrid_id).jqGrid("addRowData", i + 1, compare_data[i])
                    }
                }
                $("#" + diff_id).html("Total " + parseInt(diff_count + brief_diff_count) + " differences")
            })
        })
    } else {
        detail_right = get_detail_data("detail-table");
        ajaxSend("get_detail", {
            "node_type": left_node_type,
            "rev_id": left_rev_id
        }, function (data) {
            get_ret_status(data);
            var compare_datas = get_compare_data(data['data'], detail_right, compare_title);
            var compare_data = compare_datas['compare_data'];
            diff_count += compare_datas['diff_count'];
            if (diff_count == 0) {
                $("#gview_compare-table").hide();
                $("#gview_changes-table").hide();
                $(".no-changes").show();
            } else {
                $(".no-changes").hide();
                $("#gview_compare-table").show();
                $("#gview_changes-table").show();
                for (var i = 0; i < compare_data.length; i++) {
                    $("#" + jqgrid_id).jqGrid("addRowData", i + 1, compare_data[i]);
                }
            }

            $("#" + diff_id).html("Total " + parseInt(diff_count + brief_diff_count) + " differences");
        })
    }
}

function setAutoComplete(selector, source_url, type) {
    $(selector).autocomplete({
        minLength: 1,
        autoFocus: true,
        delay: 500,
        source: function (request, response) {
            $.ajax({
                url: source_url,
                datatype: "json",
                data: {
                    "type": type,
                    "sub": request.term
                },
                type: "GET",
                contentType: "application/json",
                success: function (data) {
                    response($.map(data, function (val) {
                        return {
                            value: val
                        }
                    }))
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    return {
                        value: ''
                    }
                }
            });
        },
        select: function (event, ui) {
            if (selector == "input[name='Watch List']") {
                var name = $(".ui-state-focus").text();
                var html = "<li class='email_del'><img src='../static/image/delete.png' title='" + name + "'>" + name + "</img></li>";
                $(this).before(html);
            }
        },
        close: function (event, ui) {
            if (selector == "input[name='Watch List']") {
                $(".email_del").click(function () {
                    $(this).remove();
                });
                $(this).val('');
            }
        }
    });
}

function setAutoFill(selector, source_url) {
    $("#detail-table").on('blur', selector, function () {
        var obj = this;
        // TBD item should not be auto filled
        if (this.value == 'TBD' || this.value == "T.B.D.") {
            return false;
        }
        ajaxSend(source_url, {
            'type': this.name,
            'value': this.value
        }, function (data) {
            get_ret_status(data);
            if (!data.errcode) {
                var snx_part_no = data.data['SNX Part#'];
                var sku_no = data.data['SKU'];
                var vendor = data.data.Vendor;
                var mfg_pn = data.data['MFG Part#'];
                var des = data.data.Description;
                var unit_cost = data.data['Unit Cost'];
                var pm = data.data['Part Maintenance'];
                var rowid = obj.parentNode.parentNode.id;
                // if(vendor){
                if (selector == "input[name='SKU']") {
//                        if (snx_part_no) {
                        $("#" + rowid + " input[name='SNX Part#']").val(snx_part_no);
//                        }
                } else if (selector == "input[name='SNX Part#']") {
//                        if (sku_no) {
                        $("#" + rowid + " input[name='SKU']").val(sku_no);
//                        }
                }
                if (node_type == 'bom') {
                    $("#" + rowid + " input[name='Vendor']").val(vendor);
                    // }
                    // if(mfg_pn){
                    $("#" + rowid + " input[name='MFG Part#']").val(mfg_pn);
                    // }
                    // if(des){
                    $("#" + rowid + " input[name='Description']").val(des);
                    // }
                    // if(unit_cost){
                    $("#" + rowid + " input[name='Unit Cost']").val(unit_cost);
                    // }
                    $("#" + rowid + " input[name='Part Maintenance']").val(pm);
                }
            }
        });
    });
}

// batch update parts
function init_batch_update(jqgrid) {
    //  var spinner = start_spin(divid, 'black')
    $("#" + jqgrid).jqGrid({
        datatype: "local",
        colModel: [
            {
                name: 'spart_id',
                index: 'spart_id',
                hidden: true
            },
            {
                name: 'bom_id',
                index: 'bom_id',
                hidden: true
            },
            {
                name: 'model_id',
                index: 'model_id',
                hidden: true
            },
            {
                name: 'platform_id',
                index: 'platform_id',
                hidden: true
            },
            {
                name: 'customer_id',
                index: 'customer_id',
                hidden: true
            },
            {
                name: 'Customer',
                index: 'Customer',
                width: getColumnWidth_bu('Customer') || 200
            },
            {
                name: 'Platform',
                index: 'Platform',
                width: getColumnWidth_bu('Platform') || 200
            },
            {
                name: 'Model',
                index: 'Model',
                width: getColumnWidth_bu('Model') || 200
            },
            {
                name: 'BOM',
                index: 'BOM',
                width: getColumnWidth_bu('BOM') || 200
            },
            {
                name: '#',
                index: '#',
                frozen: true,
                width: getColumnWidth_bu('#') || 50
            },
            {
                name: 'Type',
                index: 'Type',
                width: getColumnWidth_bu('Type') || 180
            },
            {
                name: 'SNX Part#',
                index: 'SNX Part#',
                formatter: noneValueFormat,
                width: getColumnWidth_bu('SNX Part#') || 200
            },
            {
                name: 'MFG Part#',
                index: 'MFG Part#',
                formatter: noneValueFormat,
                width: getColumnWidth_bu('MFG Part#')
            },
            {
                name: 'SKU',
                index: 'SKU',
                formatter: linkValueFormat,
                width: getColumnWidth_bu('SKU') || 200
            },
            {
                name: 'Description',
                index: 'Description',
                width: getColumnWidth_bu('Description')
            },
            {
                name: 'Vendor',
                index: 'Vendor',
                width: '100%',
                width: getColumnWidth_bu('Vendor') || '100%'
            },
            {
                name: 'QTY',
                index: 'QTY',
                width: getColumnWidth_bu('QTY') || 50
            },
            {
                name: 'Customer Part#',
                index: 'Customer Part#',
                formatter: noneValueFormat,
                width: getColumnWidth_bu('Customer Part#')
            },
            {
                name: 'Unit Cost',
                index: 'Unit Cost',
                width: getColumnWidth_bu('Unit Cost')
            },
            {
                name: 'Notes',
                index: 'Notes',
                width: getColumnWidth_bu('Notes')
            },
            {
                name: 'F/W',
                index: 'F/W',
                width: getColumnWidth_bu('F/W')
            },
            {
                name: 'Life Cycle',
                index: 'Life Cycle',
                width: getColumnWidth_bu('Life Cycle')
            },
            {
                name: 'Part Maintenance',
                index: 'Part Maintenance',
                width: getColumnWidth_bu('Part Maintenance')
            },
          ],
        height: $(window).height() * 0.5,
        autowidth: true,
        rowNum: 200,
        cmTemplate: {
            sortable: false
        },
        multiselect: false,
        resizeStop: saveColumnWidth_bu
    });
    //  refresh_compare(flag);
    //  spinner.stop();
}

 //// make cell 'Life Cycle' & 'Type' & 'Vendor' combobox
function set_edit_detail_style() {
    $("select[name='Life Cycle']").combobox();
    $("select[name='Life Cycle']").next().attr('name', 'Life Cycle');
    $("select[name='Life Cycle']").next().children().attr('name', 'Life Cycle');
    $("span[name='Life Cycle'] input").attr('maxlength', '20');
    $("select[name='Group']").combobox();
    $("select[name='Group']").next().attr('name', 'Group');
    $("select[name='Group']").next().children().attr('name', 'Group');
    $("select[name='Type']").combobox();
    $("select[name='Type']").next().attr('name', 'Type');
    $("select[name='Type']").next().children().attr('name', 'Type');
    $("span[name='Type'] input").attr('maxlength', '50');
    $("select[name='Vendor']").combobox();
    $("select[name='Vendor']").next().attr('name', 'Vendor');
    $("select[name='Vendor']").next().children().attr('name', 'Vendor');
    $("span[name='Vendor'] input").attr('maxlength', '50');
}
