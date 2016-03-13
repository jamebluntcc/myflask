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
            rna_sample_sequencing_type_info = {};
        var sample_project_master = $(".sample_project_master");
        var sample_species = $(".sample_species");
        var sample_type = $(".sample_type");
        var dna_sample_sequencing_type = $(".dna_sample_sequencing_type");
        var rna_sample_sequencing_type = $(".rna_sample_sequencing_type");

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

        var all_info = {
            'sample_project_master_info': sample_project_master_info,
            'sample_species_info': sample_species_info,
            'sample_type_info': sample_type_info,
            'dna_sample_sequencing_type_info': dna_sample_sequencing_type_info,
            'rna_sample_sequencing_type_info': rna_sample_sequencing_type_info
        };

        return all_info
    }

    $("#submit").click(function() {
        var all_info = get_input_data();

        //console.log(all_info);
        //return;

        all_info = JSON.stringify(all_info);
        ajaxSend('save_input', {'all_info': all_info}, function(data) {
            if (data.errcode !=0) {
                alert(data.msg);
            }
            else {
                alert('Save success!');
            }
        });
    });

    $(".btn").click(function(){
      save();
    });

    //$win.keydown(function(event) {
    //  if (event.keyCode == '13'){
    //    save();
    //  }
    //});
    function save(){
      ajaxSend('/check_login?m='+(new Date()).getTime(), {"username":username, "password":password}, function(data){
        if (data.data == 'Login Success') {
          window.location.href='/';
        } else {
          alert(data.data);
        }
      }, 'POST');
    }
        $("#input_detail_info").jqGrid({
        datatype: 'local',
        height: 250,
        colNames: ['id','样品名称', '生产编号', '浓度（ng/ul）', '体积(ul)', 'OD260/280' ,'制备时间' ,'建库类型','数据量', '质量检测'],
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
        ],
        caption: "建库测序样品"
    });

    $("#add").unbind().bind('click', function(){
        var ids= $("#input_detail_info").getDataIDs();
        var new_row_id = ids.length == 0 ? '1' : parseInt(ids[ids.length-1].replace(/[^0-9]/ig,""))+1;
        var jq_obj = $("#input_detail_info");
        jq_obj.addRowData(new_row_id, {});
        jq_obj.editRow(new_row_id);
        current_input_row = new_row_id;
    });

    $("#del").unbind().bind('click', function(){
        if (current_input_row) {
            $("#input_detail_info").delRowData(current_input_row);
        }
        var ids= $("#input_detail_info").getDataIDs();
        current_input_row = ids.length == 0 ? '1' : parseInt(ids[ids.length-1].replace(/[^0-9]/ig,""));
    });

    $("#input_detail_info").on('click', "input", function (){
        current_input_row = this.parentNode.parentNode.id;
    })

});