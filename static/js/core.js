var readonly = false;
var //editable = true,
    is_original_data = false;
var diff_count = 0;
var brief_diff_count = 0;
var brief_compare_data;


var zTreeObj,zTreeObj_published, zTreeObj_agile; // the tree object
var added_rev_id = -1;

var bom = {};
bom.events = {treeOnClick: "treeOnClick"};
bom.confirm_is_show = false;
var zTree = bom.zTree = {};
var grids = bom.grids = {};
var $win,$doc,$nav,$brief,$detailTable, $detail, $revlistTable;



/**
 * format string with params
 */
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (s, i) {
        return args[i];
    });
};

var nav = bom.nav = {
    init: function() {
        $nav = $nav || $("#navigation");
        this.addListeners();
        //click on navigation
        $nav.on("click", ".navigation", function () {
            var tree_node_id = this.getAttribute("tid");
            $("#"+tree_node_id+"_a").click();
        });
        $nav.on("click", ".cancel-edit", function (){
            detail_is_editing = false;
            if (parseInt(rev_id) > 0) {
                bom.reload_page(rev_id);
                window.is_editing = false;
            } else {
                window.location = '/';
            }
        });
    },
    addListeners: function(){
        $nav.on(bom.events.treeOnClick, this.treeOnClick);
    },
    treeOnClick: function(evt, navi_html) {
        if ($nav.is(".visible") == false) {
            $nav.show();
        };
        navi_html += "<li class='command-group'>";
        var btns = detail.buttons;
        if (bom.node_type == "full_rack") {
            navi_html += (btns.export_button+btns.publish_button+btns.search_button+btns.save_button);
        } else if (bom.node_type != "customer") {
            navi_html += (btns.export_button+btns.search_button+btns.save_button+btns.switch_button);
        } else {
            navi_html += (btns.search_button+btns.save_button);
        }
        navi_html += "</li>";
        navi_html = "<li><a href='/' class='navigation'>Home</a></li>" + navi_html;
        $nav.html(navi_html);
    }
};

var brief = bom.brief = {
    init: function() {
        $brief = $brief || $("#brief");
        this.addListeners();
    },
    addListeners: function(){
        $brief.on(bom.events.treeOnClick, this.treeOnClick);
    },
    treeOnClick: function(evt, node_type, rev_id, parent_info) {
        if ($brief.is(".visible") == false) {
            $brief.show();
        };
        var url_brief = "hyve-plm/get_brief?node_type={0}&rev_id={1}&parent_info={2}&timestamp={3}".format(bom.node_type, rev_id, parent_info, Math.round(new Date().getTime()/1000));
        $brief.render(url_brief);
    }
};

var detail = bom.detail = {
    init: function() {
        $detail = $('#detail');
        this.addListeners();
    },
    addListeners: function(){
        $detail.on(bom.events.treeOnClick, this.treeOnClick);
    },
    treeOnClick: function(evt, node_type, rev_id, publish) {
        // click on other nodes will render detail page
        // bom.loading('loading'); //show loading layer
        $detail.offset({top:200});
        var url_detail = "hyve-plm/get_detail_page?node_type={0}&rev_id={1}&publish={2}&timestamp={3}".format(bom.node_type, rev_id, publish, Math.round(new Date().getTime()/1000));
        $detail.render(url_detail);
    }
};
/**
 * Collapse tree：expand to 1st level
 * @param treeId
 */
zTree.close_ztree = function(treeId){
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var nodes = treeObj.getNodes();
    for (var i in nodes) {
        treeObj.expandNode(nodes[i], false, true, false);
    }
 };
/**
 * Search tree, highlight results by fuzzy search
 * @param treeId
 * @param rev_ids search for rev_ids of the treenode property
 */
zTree.search_ztree = function(treeId, rev_ids) {
    this.searchByFlag_ztree(treeId, rev_ids, "");
}
/**
 * Search tree, highlight results by fuzzy search
 * @param treeId
 * @param rev_ids: search for rev_ids of the treenode property
 * @param flag: wether to highlight the nodes
 */
zTree.searchByFlag_ztree = function(treeId, rev_ids, flag) {
    //get all matched nodes
    var resultNodes = [];
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    for (var i in rev_ids) {
        var nodes = treeObj.getNodesByParam("rev_id", rev_ids[i], null);
        if (nodes.length > 0) {
            for (var j in nodes) {
                resultNodes.push(nodes[j]);
            }
        }
    }
    this.highlightAndExpand_ztree(treeId, resultNodes, flag);
}
/**
 * Highlight and expand tree, with specific nodes
 * @param treeId
 * @param resultNodes
 * @param flag
 */
zTree.highlightAndExpand_ztree = function(treeId, resultNodes, flag) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    //<1>. update all nodes to normal style - highlight:false
    var treeNodes = treeObj.transformToArray(treeObj.getNodes());
    for (var i = 0; i < treeNodes.length; i++) {
        treeNodes[i].highlight = false;
        treeObj.updateNode(treeNodes[i]);
    }
    //<2>.close tree
//    zTree.close_ztree(treeId);

    //<3>.highlight specific nodes, and expand
    if (resultNodes !== null) {
        for (var i = 0; i < resultNodes.length; i++) {
            var temp = this.expandParentNodes_ztree(treeId, resultNodes[i]);
            if (flag !== null && flag !== "") {
                if (resultNodes[i].highlight == flag) {
                    //highlight and expand
                    resultNodes[i].highlight = true;
                    treeObj.updateNode(resultNodes[i]);
                    //hightlight parentnode and grandpa... till root, and expand
                    this.expandParentNodes_ztree(treeId, resultNodes[i]);
                    // var parentNode = resultNodes[i].getParentNode();
                    // var parentNodes = getParentNodes_ztree(treeId, parentNode);
                    // treeObj.expandNode(parentNodes, true, false, true);
                    // treeObj.expandNode(parentNode, true, false, true);
                }
            } else {
                //highlight and expand
                resultNodes[i].highlight = true;
                treeObj.updateNode(resultNodes[i]);
                //hightlight parentnode and grandpa... till root, and expand
                this.expandParentNodes_ztree(treeId, resultNodes[i]);
                // var parentNode = resultNodes[i].getParentNode();
                // var parentNodes = getParentNodes_ztree(treeId, parentNode);
                // treeObj.expandNode(parentNodes, true, false, true);
                // treeObj.expandNode(parentNode, true, false, true);
            }
        }
    }
}
/**
 * Get parent node, till root
 */
zTree.getParentNodes_ztree = function(treeId, treeNode){
    if (treeNode !== null) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var parentNode = treeNode.getParentNode();
        return this.getParentNodes_ztree(treeId, parentNode);
    } else {
        return treeNode;
    }
}

zTree.expandParentNodes_ztree = function(treeId, treeNode) {
    while (treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var parentNode = treeNode.getParentNode();
        treeObj.expandNode(treeNode, true, false, true);
        treeNode = parentNode;
    }
}
/**
 * Get parent node id
 */
zTree.getParentRevIds = function(treeNode) {
    var parent_rev_ids = {};
    var parentNode = treeNode.getParentNode();
    while (parentNode) {
        parent_rev_ids[parentNode.node_type] = parentNode.rev_id;
        parentNode = parentNode.getParentNode();
    }
    return parent_rev_ids;
}
/**
 * Set style for node
 */
zTree.setFontCss_ztree = function(treeId, treeNode) {
    if (treeNode.id === 0) {
        //根节点
        return {
            color: "#333",
            "font-weight": "bold"
        };
    } else if (treeNode.isParent === false) {
        //叶子节点
        return (!!treeNode.highlight) ? {
            color: "green",
            "font-weight": "bold"
        } : {
            color: "",
            "font-weight": "normal"
        };
    } else {
        //父节点
        return (!!treeNode.highlight) ? {
            color: "green",
            "font-weight": "bold"
        } : {
            color: "",
            "font-weight": "normal"
        };
    }
}

zTree.refreshTree = function(url, params, treeId, setting, selectedNodeID, clickFlag) {
    bom.ajaxSend(url, params, function (data) {
        if (data.errcode) {
            alert(data.msg);
        } else {
            var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
            zTreeObj.destroy();
            zTreeObj = $.fn.zTree.init($("#" + treeId), setting, data.data);
            if (selectedNodeID > 0) {
                var selectedNode;
                if (bom.node_type == 'virtual-kit') {
                    selectedNode = zTreeObj.getNodeByParam('tId', zTree.current_tree_node_id)
                }
                else {
                    selectedNode = zTreeObj.getNodeByParam('rev_id', selectedNodeID);
                }
                var pnode = selectedNode.getParentNode();
                zTreeObj.expandNode(pnode);
                zTreeObj.selectNode(selectedNode);
                if (clickFlag) {
                    $("#" + selectedNode.tId + "_a").click();
                }
            } else {
                window.location = '/';
            }
        }
        bom.stop_loading('loading');
    });
};

zTree.treeOnClickAgile = function(event, treeId, treeNode) {
    // click on nodes will render detail page
    var navi_html = "";
    $detail.offset({top:200});
    zTree.current_tree_node_id = treeNode.tId;
    bom.node_type = treeNode.node_type;
    if ($nav.is(".visible") == false) {
        $nav.show();
    }

    var publish = false;
    if (treeId == 'agile-tree') {
        publish = "agile";
    }
    bom.node_type = treeNode.node_type;
    rev_id = escape(treeNode.rev_id);

    var url_detail = "hyve-plm/get_detail_page?node_type={0}&rev_id={1}&publish={2}&timestamp={3}".format(bom.node_type, rev_id, publish, Math.round(new Date().getTime()/1000));
    //$brief.render(url_brief);
    $detail.render(url_detail);

    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    treeObj.expandNode(treeNode, true);
    // get the all the parent of this node, and build navigation path
    navi_html += "<li class='command-group'>"+detail.buttons.export_button+"</li>";
    while (treeNode) {
        var tree_node_name = treeNode.name;
        var tree_node_id = treeNode.tId;
        tree_node_name = tree_node_name.length>20 ? tree_node_name.substr(0, 20)+"..."+tree_node_name.substr(tree_node_name.length-4) : tree_node_name
        navi_html = "<li><a href='#' class='navigation' tid={0} title='{1}' >{2}</a></li>".format(tree_node_id, tree_node_name, treeNode.name) + navi_html;
        treeNode = treeNode.getParentNode();
    }
    $nav.html(navi_html);
    $(".publish_model").hide();
    $(".search-spart").hide();
    $brief.hide();
    $detail.css('top', '20px');
    if (['root', 'agileModel'].indexOf(bom.node_type) == -1){
        $(".export_excel").show();
    }
    else{
        $(".export_excel").hide();
    }
};


zTree.treeOnClick = function(event, treeId, treeNode) {
    var publish = false;
    if (treeId == 'published-tree') {
        publish = true;
    }
    // click on Archive will do nothing but expand this node
    if(treeNode.node_type=='archive-customer'
        || treeNode.node_type=='archive-platform'
        || treeNode.node_type=='phantbom_group'
        || treeNode.node_type=='model_lifecycle'){
        if (publish) {
            zTreeObj_published.expandNode(treeNode);
        }
        else {
            zTreeObj.expandNode(treeNode);
        }
        return false;
    }


    zTree.current_tree_node_id = treeNode.tId; //get current tree node
    bom.node_type = treeNode.node_type;
    rev_id = treeNode.rev_id;
    var parent_info = JSON.stringify(zTree.get_parent_info());
    $brief.trigger(bom.events.treeOnClick, [bom.node_type, rev_id, parent_info]);
    $detail.trigger(bom.events.treeOnClick, [bom.node_type, rev_id, publish]);

    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    treeObj.expandNode(treeNode, true);
    // get the all the parent of this node, and build navigation path
    var navi_html = "";
    var platform_tree_node = {'lock': 0};
    while (treeNode) {
        var tree_node_id = treeNode.tId;
        var tree_node_name = treeNode.name;
        tree_node_name = tree_node_name.length>20 ? tree_node_name.substr(0, 20)+"..."+tree_node_name.substr(tree_node_name.length-4) : tree_node_name;
        navi_html = "<li><a href='#' class='navigation' tid={0} title='{2}'>{1}</a></li>".format(tree_node_id, tree_node_name, treeNode.name) + navi_html;
        if (['bom', 'full_rack', 'platform'].indexOf(treeNode.node_type) != -1)
        {
            platform_tree_node = treeNode;
        }
        else if (bom.node_type == 'customer'){
            var platform_under_customer = treeNode.children;
            for (var i=0;i<platform_under_customer.length;i++){
                if (platform_under_customer[i]['node_type'] != 'archive-customer' && platform_under_customer[i].lock=='1'){
                    platform_tree_node = platform_under_customer[i];
                    break;
                }
            }
            break;
        }
        treeNode = treeNode.getParentNode();
    };

    $nav.trigger(bom.events.treeOnClick, [navi_html]);

    if (platform_tree_node != undefined && platform_tree_node.lock == '1'){ is_original_data = true;}else{is_original_data = false;}
    is_original_data = publish? false : is_original_data;
    grids.set_button_after_click_tree();
    grids.cur_edit_row = 0;
};



/**
 * ztree function for befor drop action
 */
zTree.beforeDrag = function(treeId, treeNodes) {
    for (var i in treeNodes) {
        if (treeNodes[i].node_type == 'full_rack') {
            return true;
        }
    }
    return false;
};

zTree.beforeDragOpen = function(treeId, treeNode) {
    if (treeNode.node_type == 'archive-customer' || treeNode.node_type == 'customer' || treeNode.node_type == 'platform') {
        return true;
    }
    return false;
};

zTree.get_platform_rev_id = function(treeNodes){
    var par_node_obj = treeNodes[0].getParentNode();
    var par_node_type = par_node_obj.node_type;
    while (par_node_type != 'platform' && par_node_type != 'archive-platform'){
        par_node_obj = par_node_obj.getParentNode();
        par_node_type = par_node_obj.node_type;
    }

    return par_node_obj.rev_id;
};


zTree.add_drag_revision = function(treeNodes, targetNode){
    var cur_rev_id = treeNodes[0].rev_id;
    if(targetNode=='' || targetNode==undefined || targetNode==null){
        return false;   //modify bugs that drag self to self
    }
    var target = targetNode.node_type;
    var parent_info = this.getParentRevIds(treeNodes[0]);
    var target_rev_id = targetNode.rev_id;
    var post_data = {
                'rev_id': cur_rev_id,
                'target': target,
                'node_type': treeNodes[0].node_type,
                'parent_info': parent_info,
                'target_rev_id': target_rev_id
            };
    bom.ajaxSend('hyve-plm/on_drag', {"data": JSON.stringify(post_data)}, function (data) {
        if (data.errcode != 0){
            bom.get_ret_status(data);
            return false;
        }
        else{
            this.refreshTree("hyve-plm/get_tree", {}, "tree", this.setting, cur_rev_id, true);
//            window.location = '/';
            return true;
        }

    });
};

zTree.beforeDrop = function(treeId, treeNodes, targetNode, moveType, isCopy) {
    var flag = false;
    var msg = "Invalid Action.\nOnly support archive a Project/Entire Rack, and drag an archived content back to its previous Customer/Project.";
    if (moveType == "inner") {
        if (treeNodes[0].node_type == 'platform'){
            if ((targetNode.node_type == 'archive-customer' && targetNode.rev_id == treeNodes[0].customer_id)
                ||(targetNode.node_type == 'customer'  && targetNode.rev_id == treeNodes[0].customer_id )){
                flag = true;
            }
        }
        else if (treeNodes[0].node_type == 'full_rack'){
            if (targetNode.node_type == 'archive-platform' && targetNode.rev_id == get_platform_rev_id(treeNodes)
                || (targetNode.node_type == 'platform' && targetNode.rev_id == get_platform_rev_id(treeNodes))){
                var platform_name = "";
                if (targetNode.node_type == 'platform'){
                    platform_name = targetNode.name;
                }
                else{
                    platform_name = targetNode.getParentNode().name;
                }
//                var warn_sentence = "Confirm: Are you sure to archive this?";
//                var status = confirm(warn_sentence);
//                if (!status){ return false;}
                flag = true;
            }
        }
    }
    if (flag){
        return add_drag_revision(treeNodes, targetNode);
    }
    else{
        alert(msg);
        return false;
    }
};

zTree.treeOnDrop = function(event, treeId, treeNodes, targetNode, moveType) {
//    zTree.refreshTree("get_tree", {}, "tree", zTree.setting, treeNodes[0].rev_id, true);
    return
};

zTree.get_parent_info = function() {
    //get parent rev_id
    var treeId = '';
    switch (bom.current_tree_tab) {
        case "BUILD":
            treeId = 'tree';
            break;
        case "PUBLISHED":
            treeId = 'published-tree';
            break;
        case "AGILE":
            treeId = "agile-tree";
            break;
    }
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var parent_info = {};

    if (bom.node_type != 'root') {
        var selected_nodes = treeObj.getSelectedNodes();
        if (selected_nodes.length > 0) {
            var treeNode = selected_nodes[0];
            parent_info = zTree.getParentRevIds(treeNode);
        }
    }

    return parent_info;
};

// tree setting
zTree.setting = {
    async: {
        //url: "get_sub_node",
        enable: true,
        contentType: "application/json",
        autoParam: ["node_type", "part_id", "publish"],
        type: "get"
    },
    view: {
        selectedMulti: false,
        dblClickExpand: false,
        fontCss: zTree.setFontCss_ztree
    },
    callback: {
        onClick: zTree.treeOnClick,
        // onRightClick: zTreeOnRightClick,
        // onRename: zTreeOnRename,
        beforeDrag: zTree.beforeDrag,
        beforeDragOpen: zTree.beforeDragOpen,
        beforeDrop: zTree.beforeDrop,
        onDrop: zTree.treeOnDrop
    },
    edit: {
        drap: {
            autoExpandTrigger: true,
            isCopy: false,
            isMove: true
        },
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
    }
};
// publish tree setting
zTree.setting_P = {
    async: {
        //url: "get_sub_node",
        enable: true,
        contentType: "application/json",
        autoParam: ["node_type", "part_id", "publish"],
        type: "get"
    },
    view: {
        selectedMulti: false,
        dblClickExpand: false,
        fontCss: zTree.setFontCss_ztree
    },
    callback: {
        onClick: zTree.treeOnClick
    }
};
// agile tree setting
zTree.setting_agile = {
    async: {
        enable: true,
        contentType: "application/json",
        autoParam: ["node_type", "part_id", "publish"],
        type: "get"
    },
    view: {
        selectedMulti: false,
        dblClickExpand: false,
        fontCss: zTree.setFontCss_ztree
    },
    callback: {
        onClick: zTree.treeOnClickAgile
    }
};

brief.origin_brief_data = {};
// get original brief data
brief.init_brief_data = function(){
    this.origin_brief_data = this.get_brief_data();
}
// get all data in brief info
brief.get_brief_data = function(){
    var brief_data = {};
    if (bom.node_type == 'root') {
        return brief_data;
    }
    for (var i in brief_columns) {
        var obj = $("#brief-info").find("td[name='" + brief_columns[i] + "']"),
            val = '';
        if (obj.length > 0) {
            val = $.trim((obj)[0].innerHTML);
        } else {
            val = $("#brief-info").find("input[name='" + brief_columns[i] + "']")[0].value;
        }
        brief_data[brief_columns[i]] = val;
    }
    brief_data['Life Cycle'] = detail.escapeValue($("#brief-info select").val());

    return brief_data;
};

brief.check_brief_input = function(brief_data){
    if (bom.node_type == 'customer'){
        if (brief_data['Customer Name'] == ''){
            return "Customer Name cannot be empty!";
        }
        else if (!brief_data['Customer #']){
            return "Customer # cannot be empty."
        }
        if (bom.check_Special_character(brief_data['Customer Name'])){
             return "invalid name '" + brief_data['Customer Name'] + "', Please modify and try again.";
        }
    }
    else if (bom.node_type == 'virtual-kit' || bom.node_type == 'phantbom') {
        return false;
    }
    else if (bom.node_type != 'root'){
        if (bom.check_Special_character(brief_data['Name'])){
             return "Invalid name: '" + brief_data['Name'] +  "', Please modify and try again.";
        }
        if (!brief_data['Name']){
            return "Name cannot be empty!";
        }
    }
};



brief.set_ipn_filter_hide_cookie = function(cookie_type, node_name, ipns){
    if (cookie_type == 'ipn_filter') {
        var cookie_name = bom.login_id + 'ipnfilter_' + node_name;
    }
    $.cookie(cookie_name, ipns);
};

brief.get_ipn_filter_hide_cookie = function(cookie_type, node_name, ipn){
    if (cookie_type == 'ipn_filter') {
        var cookie_name = bom.login_id + 'ipnfilter_' + node_name;
        var tmp_ipns = $.cookie(cookie_name);
        if (typeof(tmp_ipns) !== "undefined" && tmp_ipns !== "" && tmp_ipns !== null && tmp_ipns.indexOf(ipn) >= 0) {
            return true;
        } else {
            return false;
        }
    }
};

/**
 * [ajaxSend ajax request]
 * @param  {[type]} reqUest_url
 * @param  {[type]} post_data
 * @param  {[type]} callback
 * @param  {[type]} request_method default:POST
 * @param  {[type]} return_type    default:json
 * @param  {[type]} dict_vars
 */
bom.ajaxSend = function(reqUest_url, post_data, callback, request_method, return_type, dict_vars) {
//    $.getJSON(reqUest_url, post_data, callback, request_method);
    var params = {
        url: reqUest_url,
        data: post_data || '',
        type: request_method || 'GET',
        success: callback,
        error: function (request, textStatus, errorThrown) {
            alert("Request failed, please try again.");
            bom.stop_loading('loading');
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
};
bom.get_ret_status = function(data) {
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
        }
    }
};
// check upload file type
bom.checkFileType = function(filePath){
    var subfix = filePath.substring(filePath.lastIndexOf(".")+1);
    return true;
    if(subfix!="xls" && subfix!='txt' && subfix!="xlsx" && subfix!="jpg" && subfix!="jpeg" && subfix!='png'){
        return false;
    }
    return true;
};

// check m file
bom.checkmFile = function(fileObj) {
    var objSpan = document.getElementById("m_file_upload");
    if(!bom.checkFileType(fileObj.value)){
        $("#m_file_error").show();
        $("#m_file_label").hide();
    } else {
        if(fileObj.value != ""){
            $("#m_file_label").show();
            $("#m_file_error").hide();
        }
    }
    if (bom.current_tree_tab == 'BUILD') {
        var m_rev_id = zTreeObj.getSelectedNodes()[0].rev_id;
    } else if (bom.current_tree_tab == "PUBLISHED") {
        var m_rev_id = zTreeObj_published.getSelectedNodes()[0].rev_id;
    }
    $(".m_rev_id").val(m_rev_id);

};
bom.start_spin = function(idselector, color) {
    var opts = {
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 5, // The line thickness
        radius: 10, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: color, // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    var target = document.getElementById(idselector);
    var spinner = new Spinner(opts);
    spinner.spin(target);
    return spinner;
};

bom.check_Special_character = function(text) {
    var pattern = new RegExp("[`~!@%$^&*()=|{}?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    return pattern.test(text);
};

bom.loading = function(idselector) {
    $("#" + idselector).show();
    var opts = {
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 5, // The line thickness
        radius: 10, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: 'white', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    if ($("#" + idselector).children().length == 1) {
        $("#" + idselector).show();
    } else {
        var target = document.getElementById(idselector);
        var spinner = new Spinner(opts);
        spinner.spin(target);
    }
}

bom.stop_loading = function(idselector) {
    $("#" + idselector).hide();
};

bom.set_hide_cookie = function(title, bol){
    var cookie_name = bom.login_id + '_' + bom.node_type + '_hide_title_' + title;
    $.cookie(cookie_name, bol, {expires: 365});
};
//get_hide_cookie(bom.node_type, 'Customer Name')
bom.get_hide_cookie = function(title){
    var cookie_name = bom.login_id + '_' + bom.node_type + '_hide_title_' + title;
    var bol = $.cookie(cookie_name);
    if (bol == 'true'){
        return true;
    }
    else{
        return false;
    }
};


bom.reload_page = function(rev_id) {
    var treeid = 'tree';
    switch (bom.current_tree_tab) {
        case "BUILD":
            treeid = 'tree';
            break;
        case "PUBLISHED":
            treeid = 'published-tree';
            break;
        case "AGILE":
            treeid = "agile-tree";
            break;
    }
    var treeObj = $.fn.zTree.getZTreeObj(treeid);
    var nodes = treeObj.getNodesByParam("rev_id", rev_id);
    if (nodes.length == 0) { return false; }
    var tree_node_id = "#" + nodes[0].tId + "_a";
    $(tree_node_id).click();
};

//export excel
bom.exportExcel = function() {
    bom.ajaxSend('hyve-plm/export_excel', {'node_type': bom.node_type, 'rev_id': rev_id, 'publish': publish}, function (data) {
        if (data.errcode != 0) {
            bom.get_ret_status(data);
        } else {
            window.location.href = 'static/datasheet/export/' + data.data;
        }
    }, 'POST');
};

//make original data become edit.
bom.switch_web_mode = function() {
    var status = confirm('Are you sure switch to online editing?');
    if (status){
        bom.ajaxSend('hyve-plm/switch_web_mode', {'rev_id': rev_id}, function (data) {
            if (data.errcode != 0) {
                bom.get_ret_status(data);
            } else {
                zTreeObj.getSelectedNodes()[0].lock='0';
                zTree.refreshTree("hyve-plm/get_tree", {}, "tree", zTree.setting, rev_id, true);
                $(".switch_web_mode").hide();
            }
        });
    }
}

bom.publish_full_rack = function() {
    $("#publish-confirm").modal('show');
};

/**
 * save column width to cookie after resize
 * @param  {int} newwidth newwidth is the is the new width of the column
 * @param  {int} index index is the index of the column in colModel
 * @return {boolean} true
 */
bom.saveColumnWidth = function(newwidth, index) {
    var column_name = $detailTable.getGridParam('colModel')[index].name;
    var cookie_name = "detail_table_column_width_{0}_{1}".format(bom.node_type, column_name);
    $.cookie(cookie_name, newwidth, {
        expires: 365
    });
};

bom.saveColumnWidth_bu = function(newwidth, index) {
    var column_name = $("#parts-table").getGridParam('colModel')[index].name;
    var cookie_name = "batch_update_column_width_{0}".format(column_name);
    $.cookie(cookie_name, newwidth, {
        expires: 365
    });
};

bom.getColumnWidth = function(node_type, column_name) {
    var width = $.cookie("detail_table_column_width_{0}_{1}".format(bom.node_type, column_name));
    if (width) {
        width = parseInt(width);
    }
    return width;
};

bom.getColumnWidth_bu = function(column_name) {
    var width = $.cookie("batch_update_column_width_{0}".format(column_name));
    if (width) {
        width = parseInt(width);
    }
    return width;
};

bom.show_change_log = function() {
    if ( grids.has_no_save_part() ) {
        alert('Unsaved rows existed, please click save button on that row before saving page.');
        return;
    }
    //check duplicate
    var new_detail_data = detail.get_detail_data("detail-table");
    var check_detail_info = detail.check_detail_input(new_detail_data);
//    var check_detail_info = false;
    if (check_detail_info){
        alert(check_detail_info);
        return;
    }
    var new_brief_data = brief.get_brief_data();
    var check_brief_info = brief.check_brief_input(new_brief_data);
    if (check_brief_info){
        alert(check_brief_info);
        return;
    }
    if (bom.node_type != 'root'){
        brief_compare_data = grids.get_brief_compare_data(brief.origin_brief_data, new_brief_data, brief_columns);
    }
    detail_compare_data = grids.get_compare_data(origin_detail_data, new_detail_data, grids.get_colnames(bom.node_type));
    if (detail_compare_data.diff_count == 0 && brief_diff_count == 0) {
        alert("Page not change.");
    }
    else {
        $('#change-log').modal('show');
    }
    return;
};

bom.save_data = function(add_revision) {
    detail_is_editing = false;
    added_rev_id = -1;
    // if only change note, not vertify add revision notes.
    if (['root', 'customer', 'platform', 'virtual-kit'].indexOf(bom.node_type) == -1 && $("#change-notes").length>0 && $("#change-notes")[0].style.display != 'none') {
        var changelog = $("#notes").val();
        if ($.trim(changelog).length == 0) {
            $("#notes-warning").addClass('glyphicon glyphicon-exclamation-sign');
            $("#notes-warning").html("Notes is required.");
            $("#notes").focus();
            $("#notes").attr("placeholder", "Notes is required for adding revision!");
            return false;
        }
    }

    bom.loading('loading');
    var detail_data = detail.get_detail_data("detail-table");
    var brief_data = brief.get_brief_data();
    var parent_info = zTree.get_parent_info();
    var change_log = detail.escapeValue($("#change-log textarea").val());
    var only_brief_change = false;
    var update_other_bom_planing_group = false;
    if (brief_diff_count > 0 && diff_count == 0) {
        only_brief_change = true;
    }

    if (['bom', 'phantbom'].indexOf(bom.node_type)!=-1 && grids.plnning_part_group_changed) {
        var status = confirm('Defected Planning Part Group changed, do you want update other BOM?');
        if (status) {
            update_other_bom_planing_group = true;
        }
    }

    if (['root', 'customer', 'platform'].indexOf(bom.node_type) != -1 || !add_revision){
        var state = "Confirm save changes.";
    }
    else{
        var state = "Confirm to add new revision?"
    }
    if($("#change-log").attr('aria-hidden') == 'false'){
        var status = confirm(state);
        if (!status) {
            bom.stop_loading('loading');
            return false;
        }
    }
    $("#change-log").modal('hide');
    var post_data = {
        "rev_id": bom.rev_id,
        "node_type": bom.node_type,
        "detail_data": detail_data,
        "brief_data": brief_data,
        "parent_info": parent_info,
        "change_log": change_log,
        "only_brief_change": only_brief_change,
        "add_revision": add_revision,
        "publish": publish,
        "update_other_bom_planing_group": update_other_bom_planing_group
    };
    if (diff_count == 0 && brief_diff_count == 0 && $("#change-log").attr('aria-hidden') == 'false') {
        alert("This page not changed, add revision fail.");
        bom.stop_loading('loading');
    } else {
            bom.ajaxSend('hyve-plm/is_latest_revision', {
                'rev_id': bom.rev_id,
                'node_type': bom.node_type
            }, function (flag) {
                if (!flag && !add_revision){
                    alert('Only add revision is allowed for editing old revision.');
                    bom.stop_loading('loading');
                    return;
                }
                else if (flag || publish == 'true'){
                    bom.ajaxSend('hyve-plm/add_revision', { "data": JSON.stringify(post_data) }, function (data) {
                        if (data.errcode != 0) {
                            bom.stop_loading('loading');
                            bom.get_ret_status(data);
                        } else {
                            var new_rev_id = data['data'];
                            var build_title = data['build_title'];
                            if (publish == 'false') {
                                zTree.refreshTree("hyve-plm/get_tree", {}, "tree", zTree.setting, new_rev_id, true);
                            }
                            else {
                                bom.stop_loading('loading');
                            }
                            $("img").attr('title', build_title);
                            //init plnning_part_group_changed to origin value for judge whether changed next save data.
                            grids.plnning_part_group_changed = false;
                        }
                    }, 'POST')
                } else {
                    var status = confirm("Warnning: Current version is not latest revision, are you sure to continue?");
                    if (status) {
                        bom.ajaxSend('hyve-plm/add_revision', { "data": JSON.stringify(post_data) }, function (data) {
                            if (data.errcode != 0) {
                                bom.stop_loading('loading');
                                bom.get_ret_status(data);
                            } else {
                                var new_rev_id = data['data'];
                                var build_title = data['build_title'];
                                zTree.refreshTree("hyve-plm/get_tree", {}, "tree", zTree.setting, new_rev_id, true);
                                $("img").attr('title', build_title);
                                //init plnning_part_group_changed to origin value for judge whether changed next save data.
                                grids.plnning_part_group_changed = false;
                            }
                        }, 'POST');
                    }
                    else{
                        bom.stop_loading('loading');
                    }
                }
            });
    }
};

bom.init = function() {
    /**
     * [render template]
     * @param  {[type]} url URL
     */

    jQuery.fn.extend({
        render: function (url) {
            $(this).load(url, function (result) {
                $(".z").hide();
            });
        },
        /**
         * centerWindow
         */
        centerWindow: function () {
            var width = $(window).width(),
                height = $(window).height(),
                left = width - $(this).width() > 0 ? (width - $(this).width()) / 2 : 0,
                top = height - $(this).height() > 0 ? (height - $(this).height()) / 2 : 0;
            $(this).css({
                left: left,
                top: top
            });
            $(".z").show();
            $(this).removeClass("sZoom").addClass("sZoom").show();
        }
    });
    jQuery.extend({
        hideWindow: function () {
            $(".window-base").hide();
            $(".z").hide();
        }
    });
    $.widget("custom.combobox", {
        _create: function () {
            this.wrapper = $("<span>")
                .addClass("custom-combobox")
                .insertAfter(this.element);
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },
        _createAutocomplete: function () {
            var selected = this.element.children(":selected"),
                value = selected.val() ? selected.text() : "";
            this.input = $("<input>")
                .appendTo(this.wrapper)
                .val(value)
                .attr("title", "")
                .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
            // .attr('attribute', 'value');
            .autocomplete({
                delay: 0,
                minLength: 0,
                source: $.proxy(this, "_source")
            })
                .tooltip({
                    tooltipClass: "ui-state-highlight"
                });
            this._on(this.input, {
                autocompleteselect: function (event, ui) {
                    ui.item.option.selected = true;
                    this._trigger("select", event, {
                        item: ui.item.option
                    });
                },
                autocompletechange: "_removeIfInvalid"
            });
        },
        _createShowAllButton: function () {
            var input = this.input,
                wasOpen = false;
            $("<a>")
                .attr("tabIndex", -1)
            // .attr( "title", "Show All Items" )
            .tooltip()
                .appendTo(this.wrapper)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass("ui-corner-all")
                .addClass("custom-combobox-toggle ui-corner-right")
                .mousedown(function () {
                    wasOpen = input.autocomplete("widget").is(":visible");
                })
                .click(function () {
                    input.focus();
                    // Close if already visible
                    if (wasOpen) {
                        return;
                    }
                    // Pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                });
        },
        _source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response(this.element.children("option").map(function () {
                var text = $(this).text();
                if (this.value && (!request.term || matcher.test(text)))
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }));
        },
        _removeIfInvalid: function (event, ui) {
            // Selected an item, nothing to do
            if (ui.item) {
                return;
            }
            // Search for a match (case-insensitive)
            var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            this.element.children("option").each(function () {
                if ($(this).text().toLowerCase() === valueLowerCase) {
                    this.selected = valid = true;
                    return false;
                }
            });
            // Found a match, nothing to do
            if (valid) {
                return;
            }
            // Remove invalid value
            this.input
            // .val( "" )
            .attr("title", value + " didn't match any item")
                .tooltip("open");
            // this.element.val( "" );
            this._delay(function () {
                this.input.tooltip("close").attr("title", "");
            }, 2500);
            this.input.autocomplete("instance").term = "";
        },
        _destroy: function () {
            this.wrapper.remove();
            this.element.show();
        }
    });
};

detail.editable = true;

detail.buttons = {
    export_button: "<button type='button' class='export_excel' title='Export this bom to an excel file' onclick='bom.exportExcel()'>Export</button>",
    publish_button: "<button type='button' class='publish_model' onclick='bom.publish_full_rack()' title='Publish this bom to CIS'>Publish</button>",
    copy_button:"<button type='button' class='copy-bom'>Copy</button>",
    save_button: "<button type='button' class='save-changes' data-toggle='modal' onclick='bom.show_change_log()' style='display:none'>Save</button>",
    search_button: "<button class='search-spart' type='button' data-toggle='modal' data-target='#search-spart' title='Search Part'>Search Part</button>",
    switch_button:"<button type='button' class='switch_web_mode' title='Switch to Web Edit mode.' onclick='bom.switch_web_mode()' style='display: none'>Switch</button>"
};
// format <a> cell
detail.linkValueFormat = function(cellvalue, options, rowObject) {
    if (cellvalue) {
        var reg_del = /<s>.*<\/s>/,
            reg_add = /<p.*>.*<\/p>/,
            reg = />.*</;
        var param = cellvalue.match(reg) ? (cellvalue.match(reg_add) ? cellvalue.match(reg_add)[0] : cellvalue.match(reg_del)[0]) : cellvalue;
        param = param.match(reg) ? param.match(reg)[0].replace('>', '').replace('<', '') : param;

        return "<a href='{2}/partPortal/main.jsp?pmCode={0}&InvType=-1200&CustNo=&model=inv' target='_blank'>{1}</a>".format(param.substring(param.indexOf('/') + 1), cellvalue, bom.MYCIS_HOST);
    } else {
        return "";
    }
};

detail.linkValueUnFormat = function(cellvalue, options) {
    if (cellvalue == 'undefined') {
        return '';
    } else {
        return cellvalue;
    }
};

// format <a> cell
detail.IPNlinkValueFormat = function(cellvalue, options, rowObject) {
    if (cellvalue) {
        var first_ipn = cellvalue.split(",", 1);
        var basic_text = first_ipn;
        if (cellvalue.split(",").length != 1) {
            var more_text =  ';<a id="IPN-More" class="IPN-title a-ipn " href=""  data-toggle="modal" data-target="#IPN-title" title={0}>More</a>'.format(cellvalue),
                basic_text = basic_text + more_text;
        }
        return '<span>' + basic_text + '</span>';
    } else {
        return "";
    }
};

// format percent cell
/*detail.percentCellForm = function(cellvalue, options, rowObject) {
    if (cellvalue) {
        cellvalue = cellvalue.toString();
        cellvalue = cellvalue.replace(/[^\d\.]/g, '');
        if (parseInt(cellvalue) > 100) {
            cellvalue = '100';
        }
        cellvalue = cellvalue + '%';
    } else {
        cellvalue = '';
    }
    return cellvalue;
}*/

detail.percentCellUnForm = function(cellvalue, options, rowObject) {
    cellvalue = cellvalue.replace('%', '');
    if (cellvalue) {
        cellvalue = parseFloat(cellvalue);
    }
    return cellvalue;
};

// format allocMode cell
/*detail.allocModeForm = function(cellvalue, options, rowObject) {
    if (cellvalue) {
        if (cellvalue == '1') {
            return 'Parallel';
        } else if (cellvalue == '2') {
            return 'Replacement';
        }
    } else {
        return '';
    }
}*/

detail.escapeValue = function(value) {
    if (value) {
        var result = value.indexOf("<script") != -1 ? escape(value).substr(0, 50) : value;
        return result;
    }
    return '';
};

// format nonvalue cell
detail.noneValueFormat = function(cellvalue, options, rowObject) {
    if (cellvalue == 'None') {
        return '';
    } else if (!cellvalue) {
        return '';
    } else {
        return cellvalue;
    }
};

detail.noneValueUnFormat = function(cellvalue, options) {
    if (cellvalue == 'undefined') {
        return '';
    } else {
        return cellvalue;
    }
};

detail.rev_no_unformatter = function(cellvalue, options) {
    if (cellvalue == 'undefined') {
        return '';
    } else {
        return cellvalue;
    }
};

detail.rev_no_formatter = function(cellvalue, options, rowObject) {
    var colname = options.colModel.name.replace(' ', '_');
    if (!cellvalue) {
        return '';
    }
    return "<a href='#' rev_id='{0}' node_type='{1}' publish='{2}' name='{3}'>{4}</a>".format(rowObject.rev_id, rowObject.node_type, publish, colname, cellvalue);
};

detail.original_file_formatter = function(cellvalue, options, rowObject) {
    var windows_path = rowObject.file_path,
        file_path = '';
    if (windows_path.indexOf('upload/') != -1) {
        file_path = 'static/datasheet/' + windows_path;
    } else {
        file_path = 'file:///\\\\FCA-FS6\\PVAShared\\' + windows_path.replace('ShareDrive/', '').replace(/\//g, '\\');
    }
    return "<a href='{0}' target='_blank'>{1}</a>".format(file_path, rowObject['Original File']);
};

detail.enterBuild = function() {
    publish = 'false';
    detail.editable = true;
    $('.copy-bom').show();
    $('.copy-row').show();
};

detail.enterPublished = function() {
    publish = 'true';
    detail.editable = false;
    // show checkbox for showing life cycle if its tab is not PUBLISHED
    $('.show-lifecycle').hide();
};

detail.enterAgile = function() {
    publish = 'agile';
    detail.editable = true;
    $('.copy-bom').show();
    $('.copy-row').show();
};

detail.set_jqgrid_width = function() {
    var $jqgrid = $detailTable.closest('.ui-jqgrid');

    $jqgrid.css('width', '');
    $jqgrid.find('.ui-jqgrid-view').css('width', '');
    $jqgrid.find('.ui-jqgrid-hdiv').css('width', '');
    $detailTable.closest('.ui-jqgrid-bdiv').css('width', '');
};

detail.set_jqgrid_height = function() {
    // calculate detail-table tbody tr max height by tommyx 2015-06-30 17:39:06
    if (bom.node_type == 'platform') {
        var tr_height = parseInt($("tbody tr:nth-child(2)", $detailTable).height());
        var tr_max_num = $("tbody tr", $detailTable).length-1;
        if (isNaN(tr_height)) {
            tr_height = 24;
            tr_max_num = 1;
        }
        var max_tbody_css_height = tr_height * (tr_max_num + 1.5);
        $detailTable.setGridHeight(max_tbody_css_height);
    }
};

detail.show_compare_page = function(){
    if ( grids.has_no_save_part() ) {
        alert('Unsaved rows existed, please click save button on that row before compare.');
        return;
    }
    else {
        $('#compare-rev').modal('show');
    }
};

detail.check_detail_input = function(detail_data) {
    var alert_msg = "",
        error_msg = "",
        has_duplicate_part = false,
        invalid_snx_part = false,
        part_abbr_info = {};

    //If has duplicate name, function will return the message, else will return false.
    if (bom.node_type == 'customer') {
        for(var i =0;i <detail_data.length; i++) {
            for(var j=i+1;j<detail_data.length;j++){
                if (detail_data[j]['Model Name'].toUpperCase() == detail_data[i]['Model Name'].toUpperCase()){
                    error_msg += "● Duplicate 'Model Name:' '"+ detail_data[j].Name +"' existed, please modify it and try again.\n";
                    break;
                }
            }
            if (!detail_data[i]['Model Name']){
                error_msg += "● Model Name cannot be empty!\n";
                break;
            }
        }
    }
    else if (bom.node_type == 'platform'){
        for(var i =0;i <detail_data.length; i++) {
            for(var j=i+1;j<detail_data.length;j++) {
                if (detail_data[j]['SNX Part#'].toUpperCase() == detail_data[i]['SNX Part#'].toUpperCase()) {
                    error_msg += "● Duplicate 'SNX Part#:' '" + detail_data[j]['SNX Part#'] + "' existed, please modify it and try again.\n";
                    break;
                }
            }
            if (!detail_data[i]['SNX Part#']){
                error_msg += "● The SNX Part# cannot be empty!\n";
                break;
            }
        }
    }
    else if (bom.node_type == 'full_rack'){
        for(var i =0;i <detail_data.length; i++) {
            for(var j=i+1;j<detail_data.length;j++) {
                if (detail_data[j]['SNX Part#'].toUpperCase() == detail_data[i]['SNX Part#'].toUpperCase()) {
                    error_msg += "● Duplicate 'SNX Part#:' '" + detail_data[j]['SNX Part#'] + "' existed, please modify it and try again.\n";
                    break;
                }
            }
            if (!detail_data[i]['SNX Part#']){
                error_msg += "● The SNX Part# cannot be null!\n";
                break;
            }
        }
    }
    else if (bom.node_type == 'root') {
        for(var i =0;i <detail_data.length; i++) {
            if (parseInt(detail_data[i]['Customer #']) <= 1){
                error_msg += "'● Customer #' cannot be 0 or 1.\n";
                break;
            }
            for(var j=i+1;j<detail_data.length;j++){
                if (detail_data[j]['Customer Name'].toUpperCase() == detail_data[i]['Customer Name'].toUpperCase()){
                    error_msg += "● Duplicate 'Customer Name:' '"+ detail_data[j]['Customer Name'] +"' existed, please modify it and try again.\n";
                    break;
                }
                if (detail_data[j]['Customer #'] == detail_data[i]['Customer #']){
                    error_msg += "● Duplicate 'Customer #' '"+ detail_data[j]['Customer #'] +"' existed, please modify it and try again.\n";
                    break;
                }
            }
            if (!detail_data[i]['Customer Name']) {
                error_msg += "● Customer Name cannot be empty.\n";
                break;
            }
            else if(!detail_data[i]['Customer #']) {
                error_msg += "● Customer # cannot be empty.\n";
                break;
            }
        }
    }
    else if (bom.node_type == 'bom' || bom.node_type == 'phantbom') {
        var percentage_error_line = [];
        var priority_dup_error_line = [];
        var priority_size_error_line = [];
        var planning_part_group_error_line = [];
        for(var i =0;i <detail_data.length; i++) {
            var line_no = detail_data[i]['#'];
            var num = split_num_from_line_no(line_no);
            if (is_alternative_part(line_no) && detail_data[i]['level'] != 1
                && ['Hidden', 'TBD'].indexOf(detail_data[i]['Planning Life Cycle']) == -1 && num) {
                if (part_abbr_info[num] == undefined) {
                    part_abbr_info[num] = {
                        'priority_list': [detail_data[i]['Priority']],
                        'min_priority': 20,
                        'max_n_priority': 0,
                        'total_percentage': parseFloat(detail_data[i]['Allocation Percentage'] || 0),
                        'num_count': 1,
                        'planning_part_group': detail_data[i]['Planning Part Group']
                    };
                    if (detail_data[i]['Pr Flag'] == 'Y') {
                        part_abbr_info[num]['min_priority'] = parseInt(detail_data[i]['Priority']);
                    }
                    else if (detail_data[i]['Pr Flag'] == 'N') {
                        part_abbr_info[num]['max_n_priority'] = parseInt(detail_data[i]['Priority']);
                    }
                }
                else {
                    part_abbr_info[num]['num_count'] += 1;
                    part_abbr_info[num]['total_percentage'] = part_abbr_info[num]['total_percentage'] + parseFloat(detail_data[i]['Allocation Percentage'] || 0)

                    if (part_abbr_info[num]['priority_list'].indexOf(detail_data[i]['Priority']) != '-1' && priority_dup_error_line.indexOf(num) == -1) {
                        priority_dup_error_line.push(num);
                    }
                    part_abbr_info[num]['priority_list'].push(detail_data[i]['Priority']);

                    if (detail_data[i]['Pr Flag'] == 'Y') {
                        if (detail_data[i]['Priority'] <= part_abbr_info[num]['max_n_priority'] && priority_size_error_line.indexOf(num) == -1) {
                            priority_size_error_line.push(num);
                        }
                        part_abbr_info[num]['min_priority'] = Math.min(part_abbr_info[num]['min_priority'], parseInt(detail_data[i]['Priority']))
                    } else {
                        if (detail_data[i]['Priority'] >= part_abbr_info[num]['min_priority'] && priority_size_error_line.indexOf(num) == -1) {
                            priority_size_error_line.push(num);
                        }
                        part_abbr_info[num]['max_n_priority'] = Math.max(part_abbr_info[num]['max_n_priority'], parseInt(detail_data[i]['Priority']))
                    }
                    //check line # must have same planning group name.
                    if (detail_data[i]['Planning Part Group'] != part_abbr_info[num]['planning_part_group'] && planning_part_group_error_line.indexOf(num) == -1) {
                        planning_part_group_error_line.push(num);
                    }
                }
            }
            if (['', 'TBD', 'Included'].indexOf(detail_data[i]['SNX Part#']) != -1) {
                invalid_snx_part = true;
            }
            for (var j = i + 1; j < detail_data.length; j++) {
                if (detail_data[j]['SNX Part#'].toUpperCase() == detail_data[i]['SNX Part#'].toUpperCase()) {
                    has_duplicate_part = true;
                    break;
                }
            }
        }

        for (var key in part_abbr_info) {
            if (part_abbr_info[key]['total_percentage'] != 100 && part_abbr_info[key]['num_count'] > 1) {
                percentage_error_line.push(key);
            }
        }
        if (percentage_error_line.length > 0 && spy_resource.indexOf('BOM_PUBLIC_MRP_EDIT') != -1) {
            error_msg += "● Total active component's allocation percentage does not equal to 100% in group " +
                percentage_error_line.join(', ') + "\n";
        }
        if (priority_dup_error_line.length > 0 && spy_resource.indexOf('ENG_BOM_PRIO_EDIT') != -1) {
            error_msg += "● Priority in group " + priority_dup_error_line.join(', ') +
                " is not unique!\n";
        }
        if (priority_size_error_line.length > 0 && spy_resource.indexOf('ENG_BOM_PRIO_EDIT') != -1) {
            error_msg += "● Please check group " + priority_size_error_line.join(', ') +
                '. Part\'s priority (with pr_flag no) must be lower than its alternative part with pr_flag yes.\n';
        }
        if (planning_part_group_error_line.length > 0 && spy_resource.indexOf('ENG_BOM_CAT_EDIT') != -1) {
            error_msg += "\n● The line # " + planning_part_group_error_line.join(', ') + "must have same planning group name.\n";
        }
        if (has_duplicate_part && spy_resource.indexOf('ENG_BOM_EDIT_BOM' != -1)) {
            alert_msg += "\n● Duplicate 'SNX Part #' existed in this BOM, please correct it or this will cause 2 issues:\n" +
                "\t1. Part with same part# will have same attributes.\n\t2. New added part will not be saved if its part# is duplicate with the existing one.\n";
        }
        if (invalid_snx_part) {
            alert_msg += "\n● Rows with empty/TBD/Included SNX Part# existed, these parts' planning attribute will not be saved.\n";
        }
    }
    else if (bom.node_type == 'virtual-kit') {
        for (var i = 0; i < detail_data.length; i++) {
            for (var j = i + 1; j < detail_data.length; j++) {
                if (detail_data[j]['SNX Part#'].toUpperCase() == detail_data[i]['SNX Part#'].toUpperCase()) {
                    error_msg += "● Duplicate 'SNX Part#:' '" + detail_data[j]['SNX Part#'] + "' existed, please modify and try again.\n";
                    break;
                }
            }
        }
    }
    if (error_msg) {
        return "Error: \n" + error_msg;
    }
    if (alert_msg) {
        alert("Warning: \n" + alert_msg);
    }
    return false;
};

detail.get_compare_report = function(){
    bom.ajaxSend('hyve-plm/get_compare_report', {}, function(data) {
            if (data.errcode != 0) {
                alert(data.msg);
            } else {
                window.location.href = 'static/datasheet/report/' + data.data;
            }
        }
    )
};


detail.ready = function() {
    //$brief = $brief || $("#brief");
    $detailTable = $("#detail-table");
    $detail = $('#detail');
    $revlistTable = $("#revlist-table");

    $detailTable.find('tr:first td').hide();
    copy_func = $detailTable.excelCopy({
            selectedCellContentHandler: function (content) {
                return content.replace('&nbsp;', '');
            }
        });
    copy_func[0].data('excelCopy').enable();

    var $rightMouseMenu = $("#right_mouse_menu");

    if($rightMouseMenu.length <= 0){
        $('body').append('<ul id="right_mouse_menu"><li class="right_mouse_menu">Copy</li></ul> ');
        $rightMouseMenu = $("#right_mouse_menu");
    }
    $rightMouseMenu.hide();

    switch (bom.current_tree_tab) {
        case "BUILD":
            detail.enterBuild();
            break;
        case "PUBLISHED":
            detail.enterPublished();
            break;
        case "AGILE":
            detail.enterAgile();
            break;
    }


    if (bom.login_id == 'timeout') {
        if (!bom.confirm_is_show) {
            bom.confirm_is_show = true;
            var status = confirm(data.msg);
            bom.confirm_is_show = false;
            if (status) {
                window.location = login_url_synnexcentral;
            }
        }
    }
    var parent_info = JSON.stringify(zTree.get_parent_info());
    var option = {
        'url': 'hyve-plm/get_detail?node_type={0}&rev_id={1}&publish={2}&parent_info={3}'.format(bom.node_type, escape(bom.rev_id), publish, parent_info),
        'datatype': "json",
        'colModel': grids.get_colmodel(bom.node_type, detail.editable),
        'loadtext': 'Loading....',
        'height': $('.tab-content', $detail).height() - 40,
        //autowidth: true,
        //width: undefined,
        'rowNum': '-1',
//            sortable: true,
        'jsonReader': {root: 'data'},
        'cmTemplate': {
            'sortable': false,
            'autoResizable': true
        },
        //'cellEdit': true,
        //'cellsubmit': 'clientArray',
        'resizeStop': bom.saveColumnWidth,
        'loadComplete': function () {
            origin_detail_data = detail.get_detail_data("detail-table");
            //if(bom.node_type === 'bom') {
             //   var curModel = option['colModel'];
             //   for(var i =0, len = curModel.length; i < len; i++) {
               //
               //     if(curModel[i]['name'] === 'Description') {
               //         var descWid = bom.getColumnWidth(bom.node_type, 'Description');
               //         if("undefined" != typeof descWid) {
                //            curModel[i].autoResizable = false;
                 //           curModel[i]['width'] = descWid;
                 //       }else{
                //            curModel[i].autoResizable = true;
               //             delete curModel[i].width;
                 //       }
                 //       console.log("Description Width", );

                  //      return;
                 //   }
              //  }
          //  }
        },
        //'autoresizeOnLoad': true,
        'gridComplete': function () {
            detail.set_jqgrid_width();
            if (need_show_life_cycle()){
                show_life_cycle();
            }
            // kit line will not be editable for Priority
            var row_ids = $detailTable.getDataIDs();
            if (bom.node_type == 'bom') {
                for (var i in row_ids) {
                    var color_value = $detailTable.getRowData(row_ids[i]).bgcolor;
                    grids.set_cell_color(row_ids[i], color_value);
                    var vendor_title = $detailTable.getCell(row_ids[i], 'Vendor_title');
                    var vendor_obj = $("#" + row_ids[i]).find("td[aria-describedby='detail-table_Vendor']");
                    if (vendor_obj.length>0){vendor_obj[0].title = vendor_title;}
                    switch (color_value) {
                        case 'red':
                            $("#"+ row_ids[i] + " td").addClass("color_red");
                            break;
                        case 'green':
                            $("#"+ row_ids[i] + " td").addClass("color_green");
                            break;
                        case 'yellow':
                            $("#"+ row_ids[i] + " td").addClass("color_yellow");
                            break;
                        case 'grey_ega':
                            $("#"+ row_ids[i] + " td").addClass("color_grey");
                            break;
                    }

                }
            }

            detail.set_jqgrid_height();
        },

        'beforeEditCell':function (rowid, cellname, value, iRow, iCol) {
            if (cellname=='Default BOM') {
                // alert ($detailTable.getRowData(rowid).bom_list);
                var bom_list2 = JSON.parse($detailTable.getRowData(rowid).bom_list);
                $detailTable.setColProp('Default BOM',  { editoptions:{value: bom_list2}});
                //$detailTable.setColProp('Priority',  { editoptions:{value: {1:1,6:6}}})
            }
        },

        'afterSaveCell': function(rowid, cellname, value, iRow, iCol) {
        }
    };

    if (bom.node_type == 'bom') {
        option['sortname'] = 'sort_id';
        option['treeGrid'] = true;
        option['ExpandColumn'] = '#';
        option['treeGridModel'] = 'adjacency';
        option['treeReader'] = {
                "parent_id_field":"boss_id",
                "level_field":"level",
                "leaf_field":"isLeaf",
                "expanded_field":"expanded",
                "loaded":"loaded"
        }
//     option['cmTemplate']['autoResizable'] = true;
//       option['autoresizeOnLoad'] = true;
    }

    if (bom.node_type == 'agileBom') {
        option['sortname'] = 'sort_id',
        option['treeGrid'] = true,
        option['ExpandColumn'] = 'cust_part_no',
        option['treeGridModel'] = 'adjacency',
        option['treeReader'] = {
                "parent_id_field":"boss_id",
                "level_field":"level",
                "leaf_field":"isLeaf",
                "expanded_field":"expanded",
                "loaded":"loaded"
        }
    }

    $detailTable.jqGrid(option);
    grids.set_colname_order();
    grids.set_button_after_click_tree();

    $revlistTable.jqGrid({
        datatype: "local",
        colNames: ["rev_id", "Date", "Notes", "REV #", "Updated By", "Original File"],
        colModel: [
            {
                name: 'rev_id',
                index: 'rev_id',
                hidden: true
            },
            {
                name: 'Date',
                index: 'Date',
                width: bom.getColumnWidth(bom.node_type, 'Date') || 50
            },
            {
                name: 'R_Notes',
                index: 'R_Notes',
                width: bom.getColumnWidth(bom.node_type, 'R_Notes'),
                editable: true
            }, // Notes --> R_Notes because this page has two 'Notes', we cannot get value from them.
            {
                name: 'REV #',
                index: 'REV #',
                width: bom.getColumnWidth(bom.node_type, 'REV #') || 20,
                formatter: detail.rev_no_formatter
            },
            {
                name: 'Updated By',
                index: 'Updated By',
                width: bom.getColumnWidth(bom.node_type, 'Updated By') || 50
            },
            {
                name: 'Original File',
                index: 'Original File',
                width: bom.getColumnWidth(bom.node_type, 'Original File') || 100,
                formatter: detail.original_file_formatter
            }
          ],
        height: $('.tab-content',$detail).height() - 50,
        width: $detail.width() - 2,
        rowNum: 200,
        editurl: 'edit_notes',
        cmTemplate: {
            sortable: false
        },
        sortname: 'Date',
        sortorder: "desc"
    });

    // default not show life cycle which is 'hidden'
    $detailTable.on('show.bs.tab', function (e) {
        row_ids = $detailTable.getDataIDs();
        for (i in row_ids) {
            if ($detailTable.jqGrid().getCell(row_ids[i], 'Life Cycle') == 'Hidden'){
                $('#'+row_ids[i]).hide();
            }
        }
    });

    $('.tab-detail, .tab-revlist').on('shown.bs.tab', function (e) {

        if (bom.is_lock == 0 && bom.current_tree_tab != 'PUBLISHED'){
            if (detail_is_editing) {
                $(".save-changes").toggle();
                $(".cancel-edit").toggle();
            } else {
                $(".edit-button").toggle();
            }
        }
    });

    function need_show_life_cycle(){
        var row_ids = $detailTable.getDataIDs();
        for (var i in row_ids) {
            if ($detailTable.jqGrid().getCell(row_ids[i], 'Life Cycle') == 'Hidden'){
                return true
            }
        }
        $(".show-lifecycle").hide()
    }

    // define show life cycle

    function show_life_cycle() {
        flag_show = $("#show-lifecycle").prop('checked');
        var row_ids = $detailTable.getDataIDs();
        if (flag_show == false) {
            for (var i in row_ids) {
                if ($detailTable.jqGrid().getCell(row_ids[i], 'Life Cycle') == 'Hidden'){
                    $('#'+row_ids[i]).hide();
                    var child_ids = get_children_row_id(row_ids[i]);
                    for (var i in child_ids) {
                        $('#'+ child_ids[i]).hide();
                    }
                }
            }
        }else{
            for (var i in row_ids) {
                $('#'+row_ids[i]).show();
            }
        }
    }

    // hide and show life cycle with 'hidden'
    $('#show-lifecycle').on('click', function (e) {
        show_life_cycle();
    });

    // when click filter button
    $('.filter-title').on('click', function (e) {
        var col_names = $detailTable.jqGrid('getGridParam','colNames');
        var hide_length = col_names.indexOf('rev_id')+1;
        col_names = col_names.slice(hide_length);
        var str = "";
        var part_info_html_str="<li><ul class='connectedSortable' id='part_info_title'> Part Info: <input class='check_all_group_title ui-sortable-handle' type='checkbox' checked>";
        var planning_attr_html_str = "<li><ul class='connectedSortable' id='planning_attr_title'> Planning attributes: <input class='check_all_group_title ui-sortable-handle' type='checkbox' checked>";
        var other_info_html_str = "<li><ul class='connectedSortable' id='other_info_title'> Other Info: <input class='check_all_group_title ui-sortable-handle' type='checkbox' checked>";
        var colnum_groups_info = get_group_title();
        var part_info_colnums = colnum_groups_info['part_info_colnums'];
        var planning_attr_colnums = colnum_groups_info['planning_attr_colnums'];
        var other_info_colnums = colnum_groups_info['other_info_colnums'];
        var group_title_order = colnum_groups_info['group_title_order'];
        var no_use_colname = bom.node_type=='bom'? ["level", "boss_id", "isLeaf", "expanded", "loaded", "icon", "bgcolor"] : [];
        for (var i = 0; i < col_names.length; i++) {
            if (no_use_colname.indexOf(col_names[i]) == -1) {
                var checked = bom.get_hide_cookie(col_names[i]) ? '' : 'checked';
                var tmp_str = "<li class='list-group-item'><input name='detail_title_" + col_names[i] + "' type='checkbox' sort_id=" + (i+hide_length) + ' ' + checked + " id='check_" + col_names[i] + "'/>" + col_names[i] + "</li>";
                if (bom.node_type != 'bom' && bom.node_type != 'phantbom') {
                    str += tmp_str;
                }
                else {
                    if (part_info_colnums.indexOf(col_names[i]) != -1) {
                        part_info_html_str += tmp_str;
                    }
                    else if (planning_attr_colnums.indexOf(col_names[i]) != -1) {
                        planning_attr_html_str += tmp_str;
                    }
                    else if (other_info_colnums.indexOf(col_names[i]) != -1) {
                        other_info_html_str += tmp_str;
                    }
                }
            }
        }
        if (bom.node_type == 'bom' || bom.node_type == 'phantbom') {
            var group_order_map = {'part_info': part_info_html_str,
                'planning_attr': planning_attr_html_str,
                'other_info': other_info_html_str};
            str = group_order_map[group_title_order[0]] +"</li></ul>" +
                group_order_map[group_title_order[1]] + "</li></ul>"  +
                group_order_map[group_title_order[2]] + "</li></ul>";
            document.getElementById("detail_title").innerHTML = str;
            grids.set_group_status();
        }
        else {
            document.getElementById("detail_title").innerHTML = str;
        }
        grids.set_move_column();
    });

    var his_notes_change_flag = false;
    $revlistTable.on("click", "td[aria-describedby='revlist-table_R_Notes']", function () {
        if (spy_resource.indexOf('ENG_BOM_EDIT_BOM') != -1 && bom.current_tree_tab == "BUILD") {
            var row_id = $(this).closest('tr').attr('id');
            $("#revlist-table").editRow(row_id);
            // TODO: if no changes on Notes, do not make his_notes_change_flag true.
            his_notes_change_flag = true;
        }
    });

    $revlistTable.on("blur", "td[aria-describedby='revlist-table_R_Notes'] input", function () {
        if (his_notes_change_flag) {
            his_rev_id = $(this).closest('tr').children()[0].textContent;
            row_id = $(this).closest('tr').attr('id');
            var saveparameters = {
                "successfunc": null,
                "url": null,
                "extraparam": {
                    'rev_id': rev_id,
                    'his_rev_id': his_rev_id,
                    'node_type': bom.node_type,
                    'notes_type': 'history_notes'
                },
                "aftersavefunc": null,
                "errorfunc": null,
                "afterrestorefunc": null,
                "restoreAfterError": true,
                "mtype": "POST"
            };
            $revlistTable.saveRow(row_id, saveparameters);
        }
        his_notes_change_flag = false;
    });

    if (['root', 'customer'].indexOf(bom.node_type) == -1) {
        bom.ajaxSend("hyve-plm/get_revision_history", {
            "node_type": bom.node_type,
            "rev_id": rev_id,
            "publish": publish
        }, function (data) {
            bom.get_ret_status(data);
            $revlistTable.clearGridData();
            var revlist_data = data['data'];
            for (var i = 0; i < revlist_data.length; i++) {
                $revlistTable.jqGrid('addRowData', i + 1, revlist_data[i]);
            }
            bom.stop_loading('loading');
        });
    }



    $detailTable.bind("contextmenu", function(event) {
        event.preventDefault();
        // alert($('.excel-copy-active').length);
        if ($('.excel-copy-active').length > 0) {
            $rightMouseMenu.show();
        } else {
            $rightMouseMenu.hide();
        }
        $rightMouseMenu.css({top: event.pageY + "px", left: event.pageX + "px"});
    });
    $rightMouseMenu.on("click", function(event) {
        copy_func[0].data('excelCopy').copy();
        // alert('copy content');
        $rightMouseMenu.hide();
    });

    $(document).mousedown(function(event) {
        if(!$(event.target).hasClass('right_mouse_menu')){
            switch(event.which) {
                case 1:
                    $rightMouseMenu.hide();
                    break;
            }
        }
    });

    // change value to hidden
    $detailTable.on("change", "td [name='Life Cycle']", function () {
        var row_id = $(this).closest('tr').attr('id');
        var life_cycle = document.getElementById(row_id + "_Life Cycle").value;
        if(bom.node_type == 'bom' || bom.node_type == 'phantbom') {
            grids.auto_fill_planing_life_cycle(row_id);
        }
        // var old_bgcolor = $detailTable.jqGrid().getCell(row_id, 'bgcolor');
        var old_bgcolor = '',
            class_color_name = '';

        if (bom.current_tree_tab == 'BUILD') {
            var kpart_rev_id = zTreeObj.getSelectedNodes()[0].rev_id;
        } else if (bom.current_tree_tab == "PUBLISHED") {
            var kpart_rev_id = zTreeObj_published.getSelectedNodes()[0].rev_id;
        }
        var snx_part_rev_id = $detailTable.jqGrid().getCell(row_id, 'rev_id');

        bom.ajaxSend('hyve-plm/fetch_bgcolor', {
            'rev_id': kpart_rev_id,
            'spart_rev_id': snx_part_rev_id
        }, function (data) {
            old_bgcolor = data;
            switch (old_bgcolor) {
                case 'red':
                    class_color_name = 'color_red';
                    break;
                case 'green':
                    class_color_name = 'color_green';
                    break;
                case 'yellow':
                    class_color_name = 'color_yellow';
                    break;
                case 'grey_ega':
                    class_color_name = 'color_grey';
                    break;
            }
            if ('Hidden' == life_cycle) {
                $("#" + row_id + " td").css({"background-color": '#AFAFAF', "color": '#000'});
                $("#"+ row_id + " td").removeClass(class_color_name);
                $("#"+ row_id + " td").addClass("color_grey");
                $(".color_row").hide();
            } else {
                // fetch Original bgcolor
                $("#"+ row_id + " td").removeClass("color_grey");
                $("#"+ row_id + " td").addClass(class_color_name);
                grids.color_row(row_id, old_bgcolor);
                $(".color_row").show();
            }
        });
    });
    var $briefInfo = $("#brief-info");
    $briefInfo.on('hide.bs.collapse', function () {
        $detail.animate({
            top: 100
        });
    });
    $briefInfo.on('hidden.bs.collapse', function () {
        $detailTable.setGridHeight($('.tab-content', $detail).height() - 30);
        $revlistTable.setGridHeight($('.tab-content',$detail).height() - 30);
    });
    $briefInfo.on('show.bs.collapse', function () {
        $detail.animate({
            top: 200
        });
        $detailTable.setGridHeight($('.tab-content',$detail).height() - 130);
        $revlistTable.setGridHeight($('.tab-content',$detail).height() - 130);
    });

    // brief section collapse

    //var readonly = false;


    var add_revision = true;
    var detail_compare_data;
    //TODO why del this two code?
//    var cur_edit_row;
//    is_getting_part_info = false;
    // store group value for one row befroe change
    var current_group;
    var detail_is_editing = false;
    var origin_planning_life_cycle = '';
    // click on Filter on Compare Revisions Page
    $(".filter-compare-button").unbind().click(function () {
        if ($("#compare-rev")[0].style.display != "none") {
            //compare-table is show
            //        $("#compare-table")[0].toggleToolbar()
            if ($(".filter-compare-button")[0].checked) {
                $(".ui-search-toolbar").show();
            } else {
                $(".ui-search-toolbar").hide();
            }
        }
    });

    // show IPN
    $detailTable.on("click", "a", function () {
        var parent_tr = this.parentNode.parentNode.parentNode;
        $detailTable.jqGrid('setSelection',parent_tr.id);
    });

    // click on Filter on Change Log Page
    $(".filter-changelog-button").unbind().click(function () {
        if ($("#change-log")[0].style.display != "none") {
            //change-log is show
            //      $("#changes-table")[0].toggleToolbar()
            if ($(".filter-changelog-button")[0].checked) {
                $(".ui-search-toolbar").show();
            } else {
                $(".ui-search-toolbar").hide();
            }
        }
    });

    //click on publish in Publish Notes
    $(".publish-model-button").unbind().click(function () {
        var changelog = $("#publish_notes").val();
        if ($.trim(changelog).length == 0) {
            $("#publish-notes-warning").addClass('glyphicon glyphicon-exclamation-sign');
            $("#publish-notes-warning").html("Notes is required for publish full rack.");
            $("#publish_notes").focus();
            $("#publish_notes").attr("placeholder", "Notes is required for adding revision!");
            return false;
        }
        $("#publish-confirm").modal('hide');
        var publish_notes = detail.escapeValue($("#publish-confirm textarea").val());
        var status = confirm("Confirm to publish?");
        if (!status) { return false;}
        bom.ajaxSend('hyve-plm/publish_full_rack', {'rev_id': rev_id,'notes': publish_notes}, function (data) { alert(data.msg);});
    });


    //click on OK in Filter Title Show
    $(".filter-title-button").unbind().click(function () {
        $("#filter-title").modal('hide');
        var permutation = [];
        var col_names = [];
        var col_objs = $("#detail_title").find('input');
        var bom_group_order = "";
        for (var i = 0; i < col_objs.length; i++) {
            var col_obj = col_objs[i];
            if (col_obj.className.indexOf('check_all_group_title') == -1) {
                var col_name = col_obj.name.replace('detail_title_', '');
                col_names.push(col_name);
                permutation.push($(col_obj).attr('sort_id'));
                if (!col_obj.checked) {
                    $detailTable.jqGrid('hideCol', col_name);
                    bom.set_hide_cookie(col_name, true);
                } else {
                    $detailTable.jqGrid('showCol', col_name);
                    bom.set_hide_cookie(col_name, false);
                }
            }
            else{
                bom_group_order += $(col_obj).parent()[0].id.replace('_title', '') + ',';
            }
        }
        var minInNumbers = Math.min.apply(Math, permutation);
        var hide_permutation = [];
        for (var i=0;i<minInNumbers;i++){
            hide_permutation.push(i.toString());
        }
        permutation = $.merge(hide_permutation, permutation);
        if (bom.node_type == 'bom') {
            var index_of_boss_id = $("#detail-table").jqGrid('getGridParam','colNames').indexOf('boss_id');
            permutation = $.merge(permutation,
                   [index_of_boss_id,index_of_boss_id+1,index_of_boss_id+2,index_of_boss_id+3,index_of_boss_id+4]);
        }
        $detailTable.jqGrid("remapColumns", permutation, true);
        detail.set_jqgrid_width();
        $.cookie(bom.node_type + '_colname_order', $detailTable.jqGrid('getGridParam','colNames'), {expires: 365});
        if (bom_group_order) {
            var part_info_title = "";
            var planning_attr_title = "";
            var other_info_title = "";
            var part_info = $("#part_info_title").find('input');
            var planning_attr = $("#planning_attr_title").find('input');
            var other_info = $("#other_info_title").find('input');

            for (var i=1; i<part_info.length;i++) {
                part_info_title += part_info[i].id.replace('check_', '') + ',';
            }
            for (var i=1; i<planning_attr.length;i++) {
                planning_attr_title += planning_attr[i].id.replace('check_', '') + ',';
            }
            for (var i=1; i<other_info.length;i++) {
                other_info_title += other_info[i].id.replace('check_', '') + ',';
            }
            part_info_title = part_info_title.substr(0, part_info_title.length-1);
            planning_attr_title = planning_attr_title.substr(0, planning_attr_title.length-1);
            other_info_title = other_info_title.substr(0, other_info_title.length-1);
            bom_group_order = bom_group_order.substr(0, bom_group_order.length-1);
            $.cookie('part_info_title', part_info_title, {expires: 365});
            $.cookie('planning_attr_title', planning_attr_title, {expires: 365});
            $.cookie('other_info_title', other_info_title, {expires: 365});
            $.cookie('bom_group_order', bom_group_order, {expires: 365});
        }
    });


    //click on save in editing view
    $(".add-revision").unbind().click(function () {
        bom.save_data(true);
    });

    $(".update-only").unbind().click(function () {
        bom.save_data(false);
    });
    // create line no
    var group_lineno_map = {};
    var group_num = 0;
    var added_rev_id = -1;


    // befor show modal window
    $("#compare-rev").on('show.bs.modal', function () {
        var width = window.innerWidth;
        $("#compare-rev .modal-dialog").width(width * 0.85);
        $("#compare-table").clearGridData();
        diff_count = 0;
    });

    $("#change-log").on('show.bs.modal', function () {
        $("#change-log .modal-dialog").width(1100);
        $("#changes-table").clearGridData();
        diff_count = 0;
    });

    $("#search-spart").on('show.bs.modal', function () {
        $("#search-spart .modal-dialog").width(1200);
        $("#changes-table").clearGridData();
        diff_count = 0;
    });

    $("#filter-title").on('shown.bs.modal', function () {
         $("#filter-title .modal-dialog").width(750);
         bind_select_event();
     });

    $('#compare-rev').on('shown.bs.modal', function () {
        $(".no-changes").hide();
        grids.init_compare('compare-content', 'compare-table', 0);
        $("#compare-left").on('change', function () {
            diff_count = 0;
            brief_diff_count = 0;
        });
        $("#compare-right").on('change', function () {
            diff_count = 0;
            brief_diff_count = 0;
        });
    });

    $('#IPN-title').on('show.bs.modal', function () {
        $('#IPN-title').children().children().children(':first').find('div').empty();
        var select_row_id = $detailTable.getGridParam('selrow');
        var array = $($detailTable.getCell(select_row_id, 'IPN')).children('').attr('title').split(',');
        $.each(array, function(index, content)
        {
            var tab = document.createElement("tab");
            tab.textContent = content;
            var br = document.createElement('br');
            $('#IPN-title').children().children().children(':first').find('div').append(tab);
            $('#IPN-title').children().children().children(':first').find('div').append(br);
        })
    });

    var row_data = {};

    $("#batch-update-search").unbind().click(function () {
        grids.init_batch_update("parts-table");
        $("#parts-table").clearGridData();
        var search_objs = $(".search_part");
        var search_info = {};
        var placeholder = ['SKU', 'SNX Part#', 'MFG Part#', 'Description', 'QTY', 'Unit Cost', 'Vendor', 'Customer Part#', 'Notes', 'F/W'];
        for (var i = 0; i < search_objs.length; i++) {
            var value = search_objs[i].value;
            if (placeholder.indexOf(value.replace('Input ', '')) != -1) {
                value = '';
            }

            search_info[search_objs[i].name] = value
        }
        var spinner = bom.start_spin("search-spart", 'black');
        bom.ajaxSend('hyve-plm/search_part', {
            'search_info': JSON.stringify(search_info)
        }, function (data) {
            var data = JSON.parse(data);
            for (var i = 0; i < data.length; i++) {
                $("#parts-table").jqGrid("addRowData", i + 1, data[i])
            }
            spinner.stop()
        });
    });
    $('#change-log').on('shown.bs.modal', function () {
        diff_count = 0;
        for (var name in brief_compare_data) {
            $("#changes-brief td[name='{0}'] div".format(name)).html(brief_compare_data[name]);
        }
        $(".no-changes").hide();
        grids.init_compare('changes-content', 'changes-table', 1);
        //zTreeObj.getSelectedNodes()[0].lock == 1 means that this part come from excel.
        //if this vk part from excel or has no spy 'ENG_BOM_EDIT_BOM', we can modify it's planning attributes, bug cannot add revision for it.
        if (bom.node_type == 'phantbom' && (spy_resource.indexOf('ENG_BOM_EDIT_BOM') == -1 || zTreeObj.getSelectedNodes()[0].lock == 1 ) &&
                (spy_resource.indexOf('ENG_BOM_PRIO_EDIT') != -1 || spy_resource.indexOf('BOM_PUBLIC_MRP_EDIT') != -1
                        || spy_resource.indexOf('ENG_BOM_PLAN_LC_EDIT') != -1)) {
            $("#change-notes").hide();
            $(".add-revision").hide();
        }
    });

    $(".copy-row").unbind().click(function () {
        if (! $("#detail-table_Actions").is(":hidden")) {
            alert('Unsaved rows existed, please click save button on that row before copy.');
            return;
        }
        var selected_row = $(".excel-copy-active");
        var row_ids = [];
        for(var i=0;i<selected_row.length;i++) {
            var row_id = selected_row[i].parentNode.id;
            var life_cycle = $detailTable.getCell(row_id, 'Life Cycle');
            if (row_ids.indexOf(row_id) == -1 && life_cycle != 'Hidden'){
                row_ids.push(row_id);
            }
        }
        set_copy(row_ids);
    });

    $(".copy-bom").unbind().click(function () {
        if (! $("#detail-table_Actions").is(":hidden")) {
            alert('Unsaved rows existed, please click save button on that row before copy.');
            return;
        }
        set_copy($detailTable.getDataIDs());
    });

    function set_copy(rowids){
        var set_alert = false;
        var row_datas = [];
        for(var i=0;i<rowids.length;i++){
            var row_data = $detailTable.getRowData(rowids[i]);
            if (bom.node_type == 'bom'){
                if (row_data['#'].indexOf('-KIT') == -1 && $('#' + rowids[i]).css('display') != 'none'){
                    row_datas.push(row_data);
                }
                else{
                    set_alert = true;
                }
            }
            else{
                row_datas.push(row_data);
            }
        }
        if (row_datas.length > 0) {
                    bom.ajaxSend('hyve-plm/set_copy_cache', { "data": JSON.stringify({'node_type': bom.node_type, 'copy_data': row_datas}) }, function (data) {
//                       if (bom.node_type == 'bom' && set_alert)
//                            {alert("Tips: Phantom line (line# with -KIT) will not be copy.");}
                        alert("Copy {0} rows Success".format(row_datas.length));
                        }, 'POST');
        }
        else {
            alert('Please select row you want copy first.')
        }

    }
    $(".paste-row").unbind().click(function () {
        var row_datas = [];
        var ids = $detailTable.getDataIDs();
        var max_row_id = (ids.length == 0 ? 1 : Math.max.apply(Math, ids) + 1);
        bom.loading("loading");
        bom.ajaxSend('hyve-plm/get_copy_cache', {}, function (data) {
            if (data.errcode != 0) {
                bom.get_ret_status(data);
            } else {
                var paste_cookie_data = data.data;
                if(paste_cookie_data){
                    var cookie_data = paste_cookie_data;
                    var cookie_node_type = cookie_data.node_type;

                    row_datas = cookie_data.copy_data;
                    if (cookie_node_type != bom.node_type){
                        alert('Page type mismatch, paste fail, please copy data in same type page.');
                        }
                    else{
                        for(var i=0;i<row_datas.length;i++) {
                            var row_data = row_datas[i];
                            var new_row_id = max_row_id + i;
                            row_data['rev_id'] = added_rev_id;
                            added_rev_id--;
                            row_data['part_master_id'] = "";
                            var line_no = row_data['#'];
                            row_data['#'] = bom.node_type=='phantbom' ? line_no : '';
                            row_data['lock'] = "0";
                            row_data['Creation Date'] = "";
                            row_data['Created By'] = "";
                            row_data['Date'] = "";
                            row_data['Updated By'] = "";
                            row_data['Default BOM'] = "";
                            row_data['bom_list'] = "";
                            row_data['IPN'] = "";
                            row_data['Latest REV'] = "";
                            row_data['Component IPN'] = "";
                            row_data['bgcolor'] = "";
                            $detailTable.jqGrid('addRowData', new_row_id, row_data);
                            if (bom.node_type == 'bom'){
                                grids.setEditable(new_row_id, ["MFG Part#", "Description", "Unit Cost", "Vendor", "Part Maintenance"], false);
                                var str = "<div class='tree-wrap tree-wrap-ltr' style='width:18px;'><div class='ui-icon ui-icon-radio-off tree-leaf treeclick' style='left:0px;'></div></div><span class='cell-wrapperleaf'>"
                                        + line_no +  "</span>";
                                $("#"+ new_row_id).find("[aria-describedby='detail-table_#']").append(str);
                            }
                        }
                        if (row_datas.length > 0){
                            alert('Paste ' + row_datas.length + ' rows Success!');
                            $(".save-changes").show();
                            $detailTable.saveRow(new_row_id, null, 'hyve-plm/save_row');
                            copy_func[0].data('excelCopy').disable();
                            copy_func[0].data('excelCopy').enable();
                        }
                        else{
                            alert('No matching data.');
                        }
                    }
                }
                else{
                    alert('No matching data.');
                }
            }
            bom.stop_loading("loading");
        });
    });

    // $(".m_upload_submit").on("click", function(){
    $("form[name=platformFileForm]").submit(function() {
        if (bom.current_tree_tab == 'BUILD') {
            var m_rev_id = zTreeObj.getSelectedNodes()[0].rev_id;
        } else if (bom.current_tree_tab == "PUBLISHED") {
            var m_rev_id = zTreeObj_published.getSelectedNodes()[0].rev_id;
        }
        var options = {
            url: 'bom_upload_file',
            type: 'post',
            success: function(data) {
                bom.stop_loading('loading');
                data = JSON.parse(data);
                date_obj = new Date();
                cur_time = date_obj.getFullYear() + '-';
                cur_time += date_obj.getMonth() + 1;
                cur_time += '-' + date_obj.getDate();
                cur_time += ' ' + date_obj.getHours();
                cur_time += ':'+date_obj.getMinutes();
                cur_time += ':'+date_obj.getSeconds();

                $("#m_file_msg").show();
                // $("#m_file_upload").val("");
                if (data.errcode != 0) {
                    msg = "<span style='color:red;'>" + data.msg + cur_time + "</span>";
                } else {
                    msg = data.msg + cur_time;
                }
                document.getElementById("m_file_msg").innerHTML = msg;
                timestamp = Math.round(new Date().getTime());
                bom.ajaxSend("hyve-plm/bom_upload_file", {"action": 'fetch_files', "m_rev_id": m_rev_id, "timestamp": timestamp }, function (data) {
                    res_obj = JSON.parse(data);
                    if (res_obj.errcode == 0 &&  res_obj.data.length> 0) {
                        var str = "";
                        str = '<table class="w100 table-bordered table-condensed" id="m_file_table">';
                        str += '<th>ID</th><th>File Name</th><th>Uploaded By</th>';
                        str += '<th>Created Time</th><th>Upload Time</th>';
                        str += '<th>Action</th>';
                        str += '<div id="m_file_content">';
                        for ( var i=0; i < res_obj.data.length; i++){
                            if (res_obj.data[i].modify_time == 'None') {
                                res_obj.data[i].modify_time = ''
                            }
                            i_start = i + 1;
                            str += '<tr id="m_file_tr_' + res_obj.data[i].id+ '"><td>'+ i_start +'</td>';
                            str += '<td class="td_filename_' +res_obj.data[i].id+'">';
                            str += '<a href="'+res_obj.data[i].file_path+'/'+res_obj.data[i].file_name+'" target="_blank">'+ res_obj.data[i].file_name +'</a></td>';
                            str += '<td>'+ res_obj.data[i].username +'</td>';
                            str += '<td style="display:none;" class="td_filepath_' +res_obj.data[i].id+'">'+ res_obj.data[i].file_path +'</td>';
                            str += '<td>'+ res_obj.data[i].create_time +'</td>';
                            str += '<td>'+ res_obj.data[i].modify_time +'</td>';
                            str += '<td><button type="button" class="m_file_delete" value="'+res_obj.data[i].id+'">';
                            str += '<img src="../static/image/delete.png" /></button></td>';
                            str += '</tr>';
                        }
                        str += '</div>';
                        str += '</table>';
                        $("#m_file_display").html(str);
                        // var display_table = document.getElementById("m_file_display");
                        // setTableInnerHTML(display_table, str);
                    }
                    //bom.get_ret_status(data);
                }, 'POST');
            },
            error: function(XmlHttpRequest, textStatus, errorThrown){
                bom.stop_loading('loading');
                alert('Internal server error, please try again.');
           }
        };
        bom.loading('loading');
        $("form[name=platformFileForm]").ajaxSubmit(options);
        return false;
    });

    $("#m_file_display").on('click', '.m_file_delete', function() {
        var confirm_status = confirm("Confirm Delete?");
        if (confirm_status) {
            var file_id = $(this).val();
            if (bom.current_tree_tab == 'BUILD') {
                var m_rev_id = zTreeObj.getSelectedNodes()[0].rev_id;
            } else if (bom.current_tree_tab == "PUBLISHED") {
                var m_rev_id = zTreeObj_published.getSelectedNodes()[0].rev_id;
            }

            var file_name = $(".td_filename_" + file_id).text();
            // var file_path = $(".td_filepath_"+ file_id).text();
            bom.ajaxSend("hyve-plm/bom_upload_file", {
                "action": 'delete_file',
                "m_rev_id": m_rev_id,
                "file_id": file_id,
                "file_name": file_name,
                "timestamp": Math.round(new Date().getTime())
            }, function (data) {
                var res_obj = JSON.parse(data);
                if (res_obj.errcode == 0 && res_obj.data.length > 0) {
                    var str = "";
                    str = '<table class="w100 table-bordered table-condensed" id="m_file_table">';
                    str += '<th>ID</th><th>File Name</th><th>Uploaded By</th>';
                    str += '<th>Created Time</th><th>Upload Time</th>';
                    str += '<th>Action</th>';
                    str += '<div id="m_file_content">';
                    for (var i = 0; i < res_obj.data.length; i++) {
                        if (res_obj.data[i].modify_time == 'None') {
                            res_obj.data[i].modify_time = res_obj.data[i].create_time;
                        }
                        i_start = i + 1;
                        str += '<tr id="m_file_tr_' + res_obj.data[i].id + '"><td>' + i_start + '</td>';
                        str += '<td class="td_filename_' + res_obj.data[i].id + '">';
                        str += '<a href="' + res_obj.data[i].file_path + '/' + res_obj.data[i].file_name + '" target="_blank">' + res_obj.data[i].file_name + '</a></td>';
                        str += '<td>' + res_obj.data[i].username + '</td>';
                        str += '<td style="display:none;" class="td_filepath_' + res_obj.data[i].id + '">' + res_obj.data[i].file_path + '</td>';
                        str += '<td>' + res_obj.data[i].create_time + '</td>';
                        str += '<td>' + res_obj.data[i].modify_time + '</td>';
                        str += '<td><button type="button" class="m_file_delete" value="' + res_obj.data[i].id + '">';
                        str += '<img src="../static/image/delete.png" /></button></td>';
                        str += '</tr>';
                    }
                    str += '</div>';
                    str += '</table>';
                    $("#m_file_display").html(str);
                    // var display_table = document.getElementById("m_file_display");
                    // setTableInnerHTML(display_table, str);
                } else {
                    var str = "";
                    // document.getElementById("m_file_display").innerHTML = str;
                    $("#m_file_display").html(str);
                    del_msg = 'Success delete!';
                    document.getElementById("m_file_msg").innerHTML = str;
                    document.getElementById("m_file_upload").innerHTML = del_msg;
                }
            }, 'POST');
        }
    });

    $detailTable.on("dblclick", "tr", function() {
        var row_id = this.id;
        grids.row_edit_check(row_id);
    });

    $("#detail .nav-tabs a").unbind().click(function() {
        var tab_name = this.className;
        if (tab_name == 'tab-detail') {
            $("#detail .command-group").show();
        }
        else if (tab_name == 'tab-revlist') {
            $("#detail .command-group").hide();
        }
    });

    $detailTable.on('keyup afterpaste blur', "input[name='Percent'], input[name='Spare Percentage'], input[name='Allocation Percentage'], input[name='Priority']", function () {
        this.value = this.value.replace(/[^\d\.]/g, '');
        if (parseInt(this.value) > 100) {
            this.value = '100';
        }
        var regu = /^(\d+)(\.?)(\d{0,2})$/;
        var re = new RegExp(regu);
        if (this.value && !re.test(this.value)) {
            alert('Percent must be a valid number, integer or with two decimal places!');
            this.value = '';
        }
    });

    $detailTable.on('keyup afterpaste blur', "input[name='QTY'], input[name='Prod Cycle Time'], input[name='Spare Qty'], input[name='Customer #']", function () {
        this.value = this.value.replace(/\D/g, '');
    });

    $detailTable.on('blur', "input[name='Watch List']", function () {
        var idselector = this.id.replace(' ', '\\ ');
        idselector = idselector.replace('#', '\\#');
        var width = $("#" + idselector).width();
        var prefix_id = idselector.substring(0, idselector.indexOf('_')+1);
        var title = "Please choose from drop down list or this will not be saved.";
        if (this.value){
            grids.validate_part_no(prefix_id+"Watch\\ List", false, width, title);
        }
        else{
            grids.validate_part_no(prefix_id+"Watch\\ List", true, width, title);
        }
    });

    $("form[name=ReplacefileForm]").submit(function() {
        var origin_file = $("#origin_file_path")[0].value;
        var new_file = $("#new_file")[0].value;
        if (origin_file == "" || new_file == "") {
            alert("file path or New file is null.");
            return;
        }
        var options = {
            url: 'hyve-plm/get_detail',
            type: 'post',
            data : {'origin_file': origin_file, 'node_type': 'agile_exec_r'},
            resetForm: false,
            success: function(data) {
                        alert(data);
            },
            error: function(){
                        alert('Upload fail!');
                    }
        };
        $("form[name=ReplacefileForm]").ajaxSubmit(options);
        return false;
    });

};