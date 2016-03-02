/**
 * Created by chenjialin on 16-2-15.
 */
$(document).ready(function(){
    function ajaxSend(reqUest_url, post_data, callback, request_method, return_type, dict_vars) {
        var params = {
        url: reqUest_url,
        data: post_data || '',
        type: request_method || 'GET',
        success: callback,
        error: function (request, textStatus, errorThrown) {
            alert("Request failed, please try again.");
        },
        return_type: return_type || 'json',
        cache: false,
        global: true,
        ajax_func_flag: false,
        custom_func: callback
        };
        if (dict_vars) {
            for (var key in dict_vars) {
                params[key] = dict_vars[key];
            }
        }
        $.ajax(params);
    }

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
});