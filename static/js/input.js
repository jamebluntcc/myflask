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


    $("#input_detail_info").jqGrid({
        datatype: 'local',
        height: 250,
        colNames: ['id', '样品名称', '生产编号', '浓度（ng/ul）', '体积(ul)', 'OD260/280' ,'制备时间' ,'建库类型','数据量', '质量检测'],
        colModel: [
            { name: 'id', index: 'id', hidden: true },
            { name: 'sample_name', index: 'sample_name', editable: true, width: 95},
            { name: 'product_num', index: 'product_num', editable: true},
            { name: 'concentration', index: 'concentration', editable: true},
            { name: 'volume', index: 'volume', editable: true},
            { name: 'od_260_or_280', index: 'od_260_or_280', editable: true},
            { name: 'pre_time', index: 'pre_time', editable: true},
            { name: 'database_type', index: 'database_type', editable: true},
            { name: 'data_quantity', index: 'data_quantity', editable: true},
            { name: 'quality_inspection', index: 'quality_inspection', editable: true},
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
});