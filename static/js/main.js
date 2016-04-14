// document on ready
function init() {
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
}

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

function del_row (row_id) {
        $("#input_detail_info").saveRow(row_id, '', '/save_row ');
    }

    function save_row (row_id) {
        $("#input_detail_info").delRowData(row_id);
    }

init();


function show_render() {
        var selected_project = $("#selected_project").val();
        if (selected_project.length == 0) {
             $("#detail").empty();
        }
        else {
             $("#detail").render("analysis?selected_project=" + encodeURIComponent(selected_project));
        }
    }