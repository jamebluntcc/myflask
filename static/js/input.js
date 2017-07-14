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
        // add project_leader
        var project_leader = $("#project_leader").find("option:selected").text();
        for (var i=0;i<sample_project_master.length;i++) {
            sample_project_master_info[sample_project_master[i].id] = sample_project_master[i].value;
        }
        sample_project_master_info['project_leader'] = project_leader

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
        // for (var i in master_info) {
        //     if (master_info[i].length == 0) {
        //         error_msg = '提交失败， 请输入样品基本信息。';
        //     }
        // }
        if (! master_info['project_name']) {
             return '请输入项目名称。';
        }
        else if (! master_info['cust_user']) {
             return '请输入客户姓名。';
        }

        return error_msg;
    }


    $("#submit").click(function() {
        var status = confirm("确认提交数据？");
        var action = $("#project_number").val() ? 'update' :'new';
        if (status) {

        }
        else {
            return;
        }
        var all_info = get_input_data();
        //console.log(all_info);
        var error_msg = check_input_data(all_info);
        if (error_msg.length > 0) {
            alert(error_msg);
            return;
        }
        all_info = JSON.stringify(all_info);
        ajaxSend('save_input', {'all_info': all_info, 'action': action}, function(data) {
            if (data.errcode !=0) {
                alert(data.msg);
            }
            else {
                alert(data.msg);
                if (action == 'new') {
                    var status = confirm("是否添加样品信息表？");
                    if (status) {
                        $('#page_detail').render('/get_sample_page?project_id=' + data.data);
                    }
                    else {
                        window.location.href='/';
                    }
                }
                else {
                     window.location.href='/';
                }
            }
        });
    });

});
