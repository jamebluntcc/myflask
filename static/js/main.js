// document on ready
$(document).ready(function () {
    bom.life_cycle_list = {'null': '', 'TBD': 'TBD', 'Hidden': 'Hidden'};
    $win = $win || $(window),
    $doc = $doc || $(document),
    //$nav = $nav || $("#navigation");
    //$brief = $brief || $("#brief");
    $detailTable = $detailTable || $("#detail-table");
    $detail = $detail || $('#detail');
    $revlistTable = $revlistTable || $("#revlist-table");
    bom.init();
    //
    
    //
    $win.resize(grids.changeSize);
    //
    nav.init();
    brief.init();
    detail.init();
    
    // get current tree tab

    if (spy_resource.indexOf("ENG_BOM_VIEW_BUILD") != -1) {
        bom.current_tree_tab = "BUILD";
    } else if (spy_resource.indexOf("ENG_BOM_VIEW_PUBLISHED") != -1) {
        bom.current_tree_tab = "PUBLISHED";
    } else if (spy_resource.indexOf("ENG_BOM_VIEW_AGILE") != -1) {
        bom.current_tree_tab = "AGILE";
    }
    
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        bom.current_tree_tab = e.target.innerHTML;
    });
    
    var spinner = bom.start_spin('tree', 'black');
    $("#fileupload").val("");
    $("#search_condition").val("");
    // get the whole tree
    if (spy_resource.indexOf('ENG_BOM_VIEW_BUILD') != -1) {
        bom.ajaxSend("hyve-plm/get_tree", {}, function (data) {
        if (data.errcode != 0) {
            if (data.errcode == 111) {
                if (!bom.confirm_is_show) {
                        bom.confirm_is_show = true;
                        var status = confirm(data.msg);
                        bom.confirm_is_show = false;
                        if (status) {
                            window.location = login_url_synnexcentral;
                        }
                }
            } else {
                alert(data.msg);
                spinner.stop();
            }
        } else {
            zTreeObj = $.fn.zTree.init($("#tree"), zTree.setting, data['data']);
            var treenodes = zTreeObj.getNodes();
            if (treenodes.length == 1) {
                zTreeObj.expandNode(treenodes[0]);
            }
            spinner.stop();
            var needed_rev_id = "{{ needed_rev_id }}";
            if (needed_rev_id.length > 0) {
                bom.reload_page(needed_rev_id);
            }
        }
        });
    };
    if (spy_resource.indexOf('ENG_BOM_VIEW_PUBLISHED') != -1) {
        bom.ajaxSend("hyve-plm/get_tree", {"publish": "true"}, function (data) {
            if (data.errcode != 0 && data.errcode != 111) {
                alert(data.msg);
                spinner.stop();
            } else {
                zTreeObj_published = $.fn.zTree.init($("#published-tree"), zTree.setting_P, data['data']);
                var treenodes = zTreeObj_published.getNodes();
                if (treenodes.length == 1) {
                    zTreeObj_published.expandNode(treenodes[0]);
                }
            }
        });
    };
    if (spy_resource.indexOf('ENG_BOM_VIEW_AGILE') != -1) {
        bom.ajaxSend("hyve-plm/get_tree", {"publish": "agile"}, function (data) {
        if (data.errcode != 0 && data.errcode != 111) {
            alert(data.msg);
            spinner.stop();
        } else {
            zTreeObj_agile = $.fn.zTree.init($("#agile-tree"), zTree.setting_agile, data['data']);
            var treenodes = zTreeObj_agile.getNodes();
            if (treenodes.length == 1) {
                zTreeObj_agile.expandNode(treenodes[0]);
            }
        }
        });
    };
    $brief.render("hyve-plm/get_brief?node_type=root&rev_id=0&timestamp={0}".format(Math.round(new Date().getTime()/1000)));
    $detail.render("hyve-plm/get_detail_page?node_type=root&rev_id=0&timstamp={0}".format(Math.round(new Date().getTime()/1000)));

    $(".left-side").resizable({
        minWidth: 190,
        maxWidth: 470
    });
    $(".left-side").resize(function(event, ui){
        $(".right-side").offset({'left':ui.size.width});
        //detail.set_jqgrid_width();
        if (parseInt($(".left-side").width() > 400)) {
            $detailTable.setGridHeight($('.tab-content', $detail).height()-$(".ui-jqgrid-labels").height()*2);
            $revlistTable.setGridHeight($('.tab-content', $detail).height()-$(".ui-jqgrid-labels").height()*2);
        }
    });

    bom.stop_loading('loading');
    //bind side show/hide
    $("#sideToggler").on('click', function () {
        $('#wrap').toggleClass("open");
        var left_width = $(".left-side").width();
        if ($("#wrap").hasClass('open')) {
            $(".right-side").offset({'left':0});
        } else {
            $(".right-side").offset({'left':left_width});
        }
        /*
        $detailTable.setGridWidth($('.detail-section').width()-2);
        $revlistTable.setGridWidth($('.detail-section').width()-2);
        */
    });

    $(".right-side").on("dblclick", ".brief_value", function () {
        if ((is_original_data && publish=='false' && bom.node_type != 'customer') || publish == 'true' ||
            spy_resource.indexOf("ENG_BOM_EDIT_BOM") == -1) {
            alert("Sorry, you don't have spy to change this or this data is from Excel file.");
            return;
        }
        var brief_value = $.trim(this.innerHTML);
        var brief_name = $(this).attr('name');
        if (brief_name == 'Life Cycle') {
            $(this).find('select').show();
            $(this).find("span[name='Life Cycle']")[0].innerHTML = '';
        }
        else{
            $(this).replaceWith("<td><input type='text' name='"+brief_name+"' value='"+brief_value+"' class='' maxlength='50'/></td>")
        }
        $(".save-changes").show();
    });
    
    
    // click on the specific revision#
    $detail.delegate("a[name='REV_#']", "click",function () {
        bom.loading('loading');
        var node_type = this.getAttribute("node_type");
        var rev_id = this.getAttribute("rev_id");
        var parent_info = JSON.stringify(zTree.get_parent_info());
        var url_brief = "hyve-plm/get_brief?node_type={0}&rev_id={1}&parent_info={2}&timestamp={3}".format(node_type, rev_id, parent_info, Math.round(new Date().getTime()/1000));
        var url_detail = "hyve-plm/get_detail_page?node_type={0}&rev_id={1}&timestamp={2}&publish={3}".format(node_type, rev_id, Math.round(new Date().getTime()/1000), publish);
        $brief.render(url_brief);
        $detail.render(url_detail);
        $(".save-changes").hide();
        $(".cancel-edit").hide();
        grids.cur_edit_row = 0;
        if (!readonly){
            $(".edit-button").show();
        }
    });
    
    $detail.delegate("a[name='Latest_REV']", "click", function () {
        bom.loading('loading');
        var rev_id = this.getAttribute("rev_id");
        $(".modal-backdrop").hide();
        bom.reload_page(rev_id);
    });
    
    // upload file
    var fileupload = document.getElementById("fileupload"), fileExtRegExp = /(?:\.xl(?:s|sx|tx|sm|sb|am))$/i;
    if(fileupload) {
        fileupload.onchange = function () {
            var filename = fileupload.value.replace(/.*\\/, '');
            if (!filename) {
                return;
            }
            if (fileExtRegExp.test(filename)) {
                // $(".progress").show();
                $("#upload-label").html(filename);
                $("#ExcelForm").show();
                $(".left-side > .tab-content").css("top", 130);
            } else {
                $("#upload-label").html("<span style='color:red'>Format Error! Only support .xls, .xlsx.</span>");
                $("#ExcelForm").hide();
                $(".left-side > .tab-content").css("top", 110);
            }
        }
    }
    $("form[name=fileForm]").submit(function() {
        var options = {
            url: 'hyve-plm/upload',
            type: 'post',
            success: function(data) {
                data = JSON.parse(data);
                bom.stop_loading('loading');
                alert(data.msg);
                bom.ajaxSend("hyve-plm/get_tree", {"node_type": "root", "part_id": ""}, function (data) {
                    bom.get_ret_status(data);
                    zTreeObj.destroy();
                    zTreeObj = $.fn.zTree.init($("#tree"), zTree.setting, data['data']);
                    var treenodes = zTreeObj.getNodes();
                    if (treenodes.length == 1) { zTreeObj.expandNode(treenodes[0]); }
                });
            },
            error: function(XmlHttpRequest, textStatus, errorThrown){
                bom.stop_loading('loading');
                alert('Internal server error, please try again.');
            }
        };
        bom.loading('loading');
        $("form[name=fileForm]").ajaxSubmit(options);
        return false;
    });
    
    
    //search tree
    $("#search_condition").keydown(function (event) {
        if(event.key == "Enter"){
            var spinner = bom.start_spin('tree', 'black');
            var keyword = $('#search_condition').val();
            if (bom.check_Special_character(keyword)){
                alert('Cannot input ' + keyword);
                $('#search_condition').val('');
                spinner.stop();
                return;
            }
            var curr_tree_id = "tree";
            if (bom.current_tree_tab == "PUBLISHED") {
                curr_tree_id = "published-tree";
            }
    
            zTree.close_ztree(curr_tree_id);
            if(keyword == ""){
                zTree.refreshTree("hyve-plm/get_tree", {}, "tree", zTree.setting, rev_id, true);
            }
            bom.ajaxSend('hyve-plm/search_tree', {'key_word':keyword}, function(data){
                if (data.errcode == 0) {
                //   search_ztree(current_tree_id, data);
                    setTimeout(function() { zTree.search_ztree(curr_tree_id, data.data) }, 200)
                } else {
                    alert(data.msg);
                }
                spinner.stop();
            });
            $("#search_condition").focusin();
        }
    });

});


function split_num_from_line_no(string) {
    return string.replace(/[^0-9]/ig,"");
};

function is_alternative_part(line_no) {
    var reg = /^\d{1,2}[a-zA-Z]$/;
    var r = line_no.match(reg);
    return r != null;
}