(function ($) {
    var util = {

        cache: {
            /*
             *fn1:{
             *    arguments1: result1,
             *    arguments2: result2
             *},
             *fn2:{
             *    arguments1: result1,
             *    arguments2: result2
             *}
             * */
        },
        /*underscore.js*/
        _throttle: function (func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            options || (options = {});
            var later = function () {
                previous = options.leading === false ? 0 : new Date;
                timeout = null;
                result = func.apply(context, args);
            };
            return function () {
                var now = new Date;
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        _getCache: function (params, primaryKey, obj, callback) {
            //primary key is a function name, secondary key is arguments.
            var cacheArr, secondaryKey = JSON.stringify(Array.prototype.slice.call(params));
            util.cache[primaryKey] || (util.cache[primaryKey] = {});
            cacheArr = util.cache[primaryKey];
            if (!cacheArr[secondaryKey]) {
                var result = callback.apply(obj);
                cacheArr[secondaryKey] = result;
            }
            return cacheArr[secondaryKey];
        },
        _singleTon: function (fn) {
            var instance;
            return function () {
                return instance || (instance = fn.apply(this, arguments));
            }
        }
    };
    $.fn.excelCopy = function (options) {
        var instance, _self = this, instances=[],
        /*extend default options*/
            opts = $.extend({}, $.fn.excelCopy.defaults, options);

        _self.each(function () {
            var $this = $(this);
            instances.push($this);
            /*opts = $.meta ? $.extend({}, opts, $this.data()) : opts;*/
            instance = $this.data('excelCopy');
            instance ? instance._init() : $this.data('excelCopy', new $.ExcelCopy(this, opts));
        });

        return instances;
    };
    $.fn.excelCopy.defaults = {
        enableCtrl: false,
        enableShift: false,
        enableCopy: false,
        selectedClass: 'excel-copy-active',
        selectedCellContentHandler: function () {}
    };

    $.ExcelCopy = function (elem, options) {
        this._init(elem, options);
    };
    $.ExcelCopy.prototype = {
        _init: function (elem, options) {
            var _self = this;
            this.isEnable = true;
            /*prevent original text select*/
            this.$el = $(elem).on('selectstart', function () {
                if(_self._isEnable()) return false;
            });
            this.enable();
            this._options = options;
            this._initEvent();
        },
        _isEnable: function(){
            return this.isEnable;
        },
        enable: function(){
            this.isEnable || (this.isEnable = true);
            this.$el.css({
                '-moz-user-select': 'none',
                '-webkit-user-select': 'none',
                '-ms-user-select': 'none',
                '-khtml-user-select': 'none',
                'user-select': 'none'
            });
        },
        disable: function(){
            this.isEnable && (this.isEnable = false);
            this._removeSelectedStyle();
            this.$el.css({
                '-moz-user-select': 'initial',
                '-webkit-user-select': 'initial',
                '-ms-user-select': 'initial',
                '-khtml-user-select': 'initial',
                'user-select': 'initial'
            });
        },
        _initEvent: function () {
            var _self = this;
            var startCell, endCell, selectedCellsArr;

            _self.$el.on('mousedown.excelcopy', function (event) {
                //mouse button from left to right, value is 0,1,2
                if (event.button) return;
                if(!_self._isEnable()) return;

                /*single selection*/
                _self._removeSelectedStyle();
                startCell = endCell = _self._getTargetCell(event.target);
                selectedCellsArr = _self._processSelectedCells(startCell, endCell, _self._addSelectedStyle);

                /*multiple selection*/
                _self.$el.on('mouseenter.excelcopy', 'td', function (event) {
                    //clear previous selection
                    _self._removeSelectedStyle();
                    endCell = _self._getTargetCell(event.target);
                    selectedCellsArr = _self._processSelectedCells(startCell, endCell, _self._addSelectedStyle);
                });

                $(document).one('mouseup.excelCopy', function (event) {
                    //clear mousemove event listener
                    _self.$el.off('mouseenter.excelcopy');
                    $(document).on('keydown.excelcopy', function (event) {
                        if(!_self._isEnable()) return;
                        //67 'C'
                        if (event.ctrlKey && event.keyCode == 67) {
                            _self._exeCopy(selectedCellsArr);
                            $(document).off('keydown.excelcopy');
                        }
                    });
                });
            });

            $(document).on('keydown', function (event) {
                //27 'ESC'
                if (event.keyCode == 27) {
                    _self._removeSelectedStyle();
                    //detach copy listener
                    $(document).off('keydown.excelcopy');
                }
            });
        },
        _addSelectedStyle: function (cell) {
            var selectedClass = this._options.selectedClass;
            $(cell).addClass(selectedClass);
        },
        _removeSelectedStyle: function () {
            var selectedClass = this._options.selectedClass;
            this.$el.find('.' + selectedClass).removeClass(selectedClass);
        },
        _createTextarea: util._singleTon(function () {
            return $('<textarea>').css({
                border: 0,
                clip: 'rect(0 0 0 0)',
                height: '1px',
                margin: '-1px',
                overflow: 'hidden',
                padding: 0,
                position: 'absolute',
                width: '1px'
            }).appendTo($(document.body));
        }),
        _exeCopy: function (selectedCellsArr) {
            var content = '', currentContent = '', selectedCellContentHandler = this._options.selectedCellContentHandler;
            for (var i = 0, rowI; rowI = selectedCellsArr[i++];) {
                for (var j = 0, colJ; colJ = rowI[j++];) {
                    currentContent = colJ.innerText;
                    if (selectedCellContentHandler && typeof selectedCellContentHandler === 'function') {
                        currentContent = selectedCellContentHandler.call(this, currentContent);
                    }
                    content += currentContent + '\t';
                }
                content += '\r\n';
            }
            this._createTextarea().val(content).get(0).select();
            document.execCommand("Copy");
        },
        _getTargetCell: function (target) {
            return {
                rowNum: target.parentNode.rowIndex,
                colNum: target.cellIndex
            };
        },
        _tableDomToBom: function () {
            var _self = this;

            //cache it, so it will be executed once
            return util._getCache(arguments, '_tableDomToBom', _self, function () {
                var bomTableArr = [];
                var rowsNum = this.$el[0].rows.length,
                    colsNum = this.$el[0].rows[0].cells.length;
                for (var i = 0; i < rowsNum; i++) {
                    bomTableArr.push([]);
                    for (var j = 0; j < colsNum; j++) {
                        bomTableArr[i].push(this.$el[0].rows[i].cells[j]);
                    }
                }
                return bomTableArr;
            });
        },
        _processSelectedCells: function (startCell, endCell, selectedCellHandler) {
            //calculate minimum rownum,cellnum,maximum rownum,cellnum
            var startCellRowNum = Math.min(startCell.rowNum, endCell.rowNum),
                startCellColNum = Math.min(startCell.colNum, endCell.colNum),
                endCellRowNum = Math.max(startCell.rowNum, endCell.rowNum),
                endCellColNum = Math.max(startCell.colNum, endCell.colNum),
                _self = this,
                selectedCellsArr = [],
                bomTableArr = this._tableDomToBom();

            for (var i = startCellRowNum; i <= endCellRowNum; i++) {
                selectedCellsArr.push([]);
                for (var j = startCellColNum; j <= endCellColNum; j++) {
                    if (selectedCellHandler && typeof selectedCellHandler === 'function') {
                        selectedCellHandler.call(this, bomTableArr[i][j]);
                    }
                    selectedCellsArr[selectedCellsArr.length - 1].push(bomTableArr[i][j]);
                }
            }
            return selectedCellsArr;
        }
    };
})(jQuery);
