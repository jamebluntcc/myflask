/**
 * Created by chenjialin on 16-2-15.
 */
var current_input_row = 0;
$(document).ready(function(){
    function get_input_data() {
        var sample_project_master_info = {},
            sample_species_info = {},
            sample_type_info = {},
            dna_sample_sequencing_type_info = {},
            rna_sample_sequencing_type_info = {},
            sample_other_info = {};
        var sample_project_master = $(".sample_project_master");
        var sample_species = $(".sample_species");
        var sample_type = $(".sample_type");
        var dna_sample_sequencing_type = $(".dna_sample_sequencing_type");
        var rna_sample_sequencing_type = $(".rna_sample_sequencing_type");
        var sample_other = $(".sample_other");

        for (var i=0;i<sample_project_master.length;i++) {
            sample_project_master_info[sample_project_master[i].id] = sample_project_master[i].value;
        }

        for (var i=0;i<sample_species.length;i++) {
            if (sample_species[i].type == 'checkbox') {
                sample_species_info[sample_species[i].id] = sample_species[i].checked? 'Y': 'N';
            }
            else {
                sample_species_info[sample_species[i].id] = sample_species[i].value;
            }
        }

        for (var i=0;i<sample_type.length;i++) {
            if (sample_type[i].type == 'checkbox') {
                sample_type_info[sample_type[i].id] = sample_type[i].checked? 'Y': 'N';
            }
            else {
                sample_type_info[sample_type[i].id] = sample_type[i].value;
            }
        }

        for (var i=0;i<dna_sample_sequencing_type.length;i++) {
            if (dna_sample_sequencing_type[i].type == 'checkbox') {
                dna_sample_sequencing_type_info[dna_sample_sequencing_type[i].id] = dna_sample_sequencing_type[i].checked? 'Y': 'N';
            }
            else {
                dna_sample_sequencing_type_info[dna_sample_sequencing_type[i].id] = dna_sample_sequencing_type[i].value;
            }
        }

        for (var i=0;i<rna_sample_sequencing_type.length;i++) {
            if (rna_sample_sequencing_type[i].type == 'checkbox') {
                rna_sample_sequencing_type_info[rna_sample_sequencing_type[i].id] = rna_sample_sequencing_type[i].checked? 'Y': 'N';
            }
            else {
                rna_sample_sequencing_type_info[rna_sample_sequencing_type[i].id] = rna_sample_sequencing_type[i].value;
            }
        }

         for (var i=0;i<sample_other.length;i++) {
            if (sample_other[i].type == 'checkbox') {
                sample_other_info[sample_other[i].id] = sample_other[i].checked? 'Y': 'N';
            }
            else {
                sample_other_info[sample_other[i].id] = sample_other[i].value;
            }
        }



        var all_info = {
            'sample_project_master_info': sample_project_master_info,
            'sample_species_info': sample_species_info,
            'sample_type_info': sample_type_info,
            'dna_sample_sequencing_type_info': dna_sample_sequencing_type_info,
            'rna_sample_sequencing_type_info': rna_sample_sequencing_type_info,
            'sample_other_info': sample_other_info

        };

        return all_info
    }


    function check_input_data(input_data) {
        var error_msg = '';
        var master_info = input_data['sample_project_master_info'];
        for (var i in master_info) {
            if (master_info[i].length == 0) {
                error_msg = '提交失败， 请输入样品基本信息。';
            }
        }
        return error_msg;
    }


    $("#submit").click(function() {

        var status = confirm("确认提交数据？");
        var table_data = [];
        if (status) {
            var table_obj = $("#input_detail_info");
            var ids = table_obj.getDataIDs();
            for (var i in ids) {
                var row_data = table_obj.getRowData(ids[i]);
                table_data.push(row_data);
                if (row_data['sample_name'].indexOf('input') != -1) {
                    alert('请先确认表格数据！');
                    return;
                }
            }

        }
        else {
            return;
        }
        var all_info = get_input_data();
        var error_msg = check_input_data(all_info);
        if (error_msg.length > 0) {
            alert(error_msg);
            return;
        }
        all_info['table_data'] = table_data;
        all_info = JSON.stringify(all_info);
        ajaxSend('save_input', {'all_info': all_info, 'action': action}, function(data) {
            if (data.errcode !=0) {
                alert(data.msg);
            }
            else {
                alert(data.msg);
                window.location.href='/';
            }
        });
    });

    $(".btn").click(function(){
      save();
    });

    function save(){
      ajaxSend('/check_login?m='+(new Date()).getTime(), {"username":username, "password":password}, function(data){
        if (data.data == 'Login Success') {
          window.location.href='/';
        } else {
          alert(data.data);
        }
      }, 'POST');
    }


    function input_row_data() {
        if (action == 'update') {
                ajaxSend('get_detail_sample_data', {'project_number': project_number}, function(data) {
                    if (data.errcode !=0) {
                        alert(data.msg);
                    }
                    else {
                        var row_data = data.data;
                        var table_obj = $("#input_detail_info");
                        for (var i in row_data) {
                            table_obj.addRowData(i+1, data.data[i]);
                            table_obj.editRow(i+1)
                        }

                    }
                });
            }
    }

    table1_map = {
    '任单编号': 'any_single_num',
    '样品编号': 'sample_number',
    '样品名称': 'sample_name',
    '文库名称': 'library_name',
    'Index序号': 'index_num',
    'Index序列': 'index_sequence',
    '文库类型': 'library_type',
    '文库切胶长度': 'length_of_gel',
    '片段长度(bp)': 'fragment_length',
    '文库体积(ul)': 'library_volume',
    '数据量（raw data）': 'data_size'
}

    table2_map = {
        'WGCID': 'wg_cid',
        'LibID': 'lib_id',
        'SampleType': 'sample_type',
        'qRCB': 'q_rcb',
        'volume': 'volume',
        'OD': 'od',
        'RIN': 'rin',
        'LibSize': 'lib_size',
        'Quality': 'qty'
    }
    table3_map = {
    'WGCID': 'wg_cid',
    'Original Sample Name': 'original_sample_name',
    'Project ID': 'project_id_e',
    'Yield': 'yield',
    'Reads': 'reads'
}


    $("#input_detail_info").jqGrid({
        datatype: 'local',
        height: 250,
        colNames: ['id', '样品名称', '生产编号', '浓度（ng/ul）', '体积(ul)', 'OD260/280' ,'制备时间' ,'建库类型','数据量', '质量检测',
        '任单编号', '样品编号', '文库名称', 'Index序号' , 'Index序列', '文库类型', '文库切胶长度', '片段长度(bp)', '文库体积(ul)',
            ' 数据量（raw data）', 'WGCID', 'LibID', 'SampleType' , 'qRCB', 'OD', 'RIN', 'LibSize', 'Quality', 'Original Sample Name', 'Project ID', 'Yield', 'Reads'],
        colModel: [
            { name: 'id', index: 'id', hidden: true },
            { name: 'sample_name', index: 'sample_name', editable: true},
            { name: 'product_num', index: 'product_num', editable: true},
            { name: 'concentration', index: 'concentration', editable: true},
            { name: 'volume', index: 'volume', editable: true},
            { name: 'od_260_or_280', index: 'od_260_or_280', editable: true},
            { name: 'pre_time', index: 'pre_time', editable: true},
            { name: 'database_type', index: 'database_type', editable: true},
            { name: 'data_quantity', index: 'data_quantity', editable: true},
            { name: 'quality_inspection', index: 'quality_inspection', editable: true},

            { name: 'any_single_num', index: 'any_single_num', editable: true, hidden: hide},
            { name: 'sample_number', index: 'sample_number', editable: true, hidden: hide},
            { name: 'library_name', index: 'library_name', editable: true, hidden: hide},
            { name: 'index_num', index: 'index_num', editable: true, hidden: hide},
            { name: 'index_sequence', index: 'index_sequence', editable: true, hidden: hide},
            { name: 'library_type', index: 'library_type', editable: true, hidden: hide},
            { name: 'length_of_gel', index: 'length_of_gel', editable: true, hidden: hide},
            { name: 'fragment_length', index: 'fragment_length', editable: true, hidden: hide},
            { name: 'library_volume', index: 'library_volume', editable: true, hidden: hide},
            { name: 'data_size', index: 'data_size', editable: true, hidden: hide},

            { name: 'wg_cid', index: 'wg_cid', editable: true, hidden: hide},
            { name: 'lib_id', index: 'lib_id', editable: true, hidden: hide},
            { name: 'sample_type', index: 'sample_type', editable: true, hidden: hide},
            { name: 'q_rcb', index: 'q_rcb', editable: true, hidden: hide},
            { name: 'od', index: 'od', editable: true, hidden: hide},
            { name: 'rin', index: 'rin', editable: true, hidden: hide},
            { name: 'lib_size', index: 'lib_size', editable: true, hidden: hide},
            { name: 'qty', index: 'qty', editable: true, hidden: hide},


            { name: 'original_sample_name', index: 'original_sample_name', editable: true, hidden: hide},
            { name: 'project_id_e', index: 'project_id_e', editable: true, hidden: hide},
            { name: 'yield', index: 'yield', editable: true, hidden: hide},
            { name: 'reads', index: 'reads', editable: true, hidden: hide},



        ],
        gridComplete: function() {},
        caption: "建库测序样品"
    });

    $(".add").unbind().bind('click', function(){
        var ids= $("#input_detail_info").getDataIDs();
        var new_row_id = ids.length == 0 ? '1' : parseInt(ids[ids.length-1].replace(/[^0-9]/ig,""))+1;
        var jq_obj = $("#input_detail_info");
        jq_obj.addRowData(new_row_id, {});
        jq_obj.editRow(new_row_id);
        current_input_row = new_row_id;
    });

    $(".del").unbind().bind('click', function(){
        if (current_input_row) {
            $("#input_detail_info").delRowData(current_input_row);
        }
        var ids= $("#input_detail_info").getDataIDs();
        current_input_row = ids.length == 0 ? '1' : parseInt(ids[ids.length-1].replace(/[^0-9]/ig,""));
    });

    $("#input_detail_info").on('click', "input", function (){
        current_input_row = this.parentNode.parentNode.id;
    });

    $(".confirm_tables").unbind().bind('click', function() {
        var jq_obj = $("#input_detail_info");
        var ids= jq_obj.getDataIDs();
        for (var i in ids) {
            jq_obj .saveRow(ids[i], '', 'save_row');
        }
    });

    input_row_data();

    // upload file
    var fileupload = document.getElementById("fileupload"), fileExtRegExp = /(?:\.xl(?:s|sx|tx|sm|sb|am))$/i;
    if (fileupload) {
        fileupload.onchange = function () {
            var filename = fileupload.value.replace(/.*\\/, '');
            if (!filename) {
                return;
            }
            if (fileExtRegExp.test(filename)) {
                $("#upload-label").html(filename);
                $("#ExcelForm").show();
            } else {
                $("#upload-label").html("<span style='color:red'>Format Error! Only support .xls, .xlsx.</span>");
                $("#ExcelForm").hide();
            }
        }
    }





    $("#ExcelForm").unbind().bind('click', function() {
        var options = {
            url: 'upload',
            type: 'post',
            success: function(data) {
                var jq_obj = $("#input_detail_info");
                var ids= jq_obj.getDataIDs();
                var complete_data = data.data;
                for(var i in ids){
                    jq_obj.saveRow(ids[i], '', 'save_row');
                    var sample_name = jq_obj.getCell(ids[i], 'sample_name');
                    var sample_number = jq_obj.getCell(ids[i], 'sample_number');
                    var wg_cid = jq_obj.getCell(ids[i], 'wg_cid');

                    for(var key in complete_data) {
                        var sheet_data = complete_data[key];
                        for(var j in sheet_data) {
                            var row_data = sheet_data[j];
                            if (row_data['sample_name'] == sample_name) {
                                jq_obj.setRowData(ids[i], row_data);
                                break;
                            }
                            if (row_data['original_sample_name'] == sample_number) {
                                jq_obj.setRowData(ids[i], row_data);
                                break;
                            }
                            if (row_data['original_sample_name'] == sample_number) {
                                jq_obj.setRowData(ids[i], row_data);
                                break;
                            }

                        }
                    }
                    jq_obj.editRow(ids[i]);
                }

                alert(data.msg);

            },
            error: function(XmlHttpRequest, textStatus, errorThrown){
                alert('Internal server error, please try again.');
            }
        };
        $("form[name=fileForm]").ajaxSubmit(options);
    });

});