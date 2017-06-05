$(document).ready(function(){
	$("#sample_table").jqGrid(
		{
			url: 'save',
			datatype : 'local',
			height: 500,
			// height: 'auto',
			colNames: ['样品名称', '物种', '管数','建库类型','浓度(ng/uL)','体积(ul)','总量(ug)','片段长度(bp)','OD260/280' ,'OD260/230','备注'],
			colModel: [
						{ name: 'sample_name', index: 'sample_name', editable: true, width: 60},
						{ name: 'sepcies', index: 'sepcies', editable: true, width: 60},
						{ name: 'product_num', index: 'product_num', editable: true, width: 60},
						{ name: 'library_type', index: 'library_type', editable: true, width: 60},
						{ name: 'concentration', index: 'concentration', editable: true, width: 60},
						{ name: 'volume', index: 'volume', editable: true, width: 60},
						{ name: 'data_quantity', index: 'data_quantity', editable: true, width: 60},
						{ name: 'fragment_length', index: 'fragment_length', editable: true, width: 60},
						{ name: 'od_260_or_280', index: 'od_260_or_280', editable: true, width: 60},
						{ name: 'od_260_or_230', index: 'od_260_or_230', editable: true, width: 60},
						{ name: 'comment', index: 'comment', editable: true, width: 60}
					],
			gridComplete: function() {},
			caption : "建库测序样品",//表格的标题名字
			width: 1000
		});
	});

$(function(){
	//页面加载完成之后执行
	pageInit();
});
function pageInit(){
	show_old_sample();
}