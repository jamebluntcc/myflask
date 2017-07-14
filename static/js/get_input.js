$(document).ready(function(){
    function validate_data(input_data){
        var check_data = {'project_number':input_data['sample_project_master_info']['project_number'],
                      'project_name':input_data['sample_project_master_info']['project_name'],
                      'cust_user':input_data['sample_project_master_info']['cust_user']};
        for(var each_info in check_data){
          if(check_data[each_info] == null || check_data[each_info] == ""){
            //   alert('666666666666666666');
            alert('请填写完整页面中带*号的地方');
            return false;
          }
        }
        return true;
    }
    function get_input_data() {
         var sample_project_master_info = {},
             sample_species_info = {},
             sample_status_info = {},
             sample_type_info = {},
             dna_sample_sequencing_type_info = {},
             rna_sample_sequencing_type_info = {};
         var sample_project_master = $(".sample_project_master");
         var sample_species = $(".sample_species");
         var sample_status = $(".sample_status");
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

         for (var i=0;i<sample_status.length;i++) {
            if (sample_status[i].type == 'checkbox') {
                sample_status_info[sample_status[i].id] = sample_status[i].checked? 'Y': 'N';
            }
            else {
                sample_status_info[sample_status[i].id] = sample_status[i].value;
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
         //for test add three validate data
         /*
         var check_data = {'project_number':sample_project_master_info['project_number'],
                            'project_name':sample_project_master_info['project_name'],
                            'cust_user':sample_project_master_info['cust_user']
                          }
        */
         var all_info = {
             'sample_project_master_info': sample_project_master_info,
             'sample_species_info': sample_species_info,
             'sample_status_info': sample_type_info,
             'dna_sample_sequencing_type_info': dna_sample_sequencing_type_info,
             'rna_sample_sequencing_type_info': rna_sample_sequencing_type_info
         };

         return all_info;
     }

    $("#submit").click(function() {
        alert('dddd');
        var all_info = get_input_data();
        console.log(all_info);
        var error_msg = validate_data(all_info);
        if (!error_msg) {
           return;
        }
        all_info = JSON.stringify(all_info);
        ajaxSend('save_input', {'all_info': all_info}, function(data) {
           if (data.errcode !=0) {
               alert(data.msg);
           }
           else {
               alert(data.msg);
               window.location.href='/';
           }
        });
        });
})
