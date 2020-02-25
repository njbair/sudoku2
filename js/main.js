var sudoku2 = {
    gameBoard: (
        $('<table></table>')
            .addClass('gameBoard')
            .attr({
                'id'          : 'gameBoard',
                'border'      : '0',
                'cellpadding' : '0',
                'cellspacing' : '0'
            })
            .append($('<tbody></tbody>'))
    ),
    gameControls: (
        $('<div></div>')
            .addClass('gameControls')
            .append(
                $('<button></button>')
                    .html('Clear')
                    .addClass('gameControlsButton gameControlsButtonReset')
                    .attr({
                        'id' : 'gameControlsButtonReset'
                    })
                    .click(function(){
                        sudoku2.initGame();
                    })
            )
            .append(
                $('<button></button>')
                    .html('Solve')
                    .addClass('gameControlsButton gameControlsButtonSolve')
                    .attr({
                        'id' : 'gameControlsButtonSolve'
                    })
            )
            .append(
                $('<button></button>')
                    .html('Get Link')
                    .addClass('gameControlsButton gameControlsButtonGetLink')
                    .attr({
                        'id' : 'gameControlsButtonGetLink'
                    })
                    .click(function(){
                        sudoku2.getLink();
                    })
            )
    ),
    boardData: {
        rows: []
    },
    currentCell: {
        row: 0,
        col: 0
    },

    init: function(){
        sudoku2.walk(
            function(row){
                sudoku2.boardData.rows[row] = {
                    columns: []
                };
            },
            function(row, col){
                sudoku2.boardData.rows[row].columns[col] = {};        
            }
        );

        sudoku2.initBoard();
        sudoku2.initGame();
    },

    initBoard: function(){
        sudoku2.gameBoard
            .prependTo($('.gameBoardContainer'))
            .after(sudoku2.gameControls);
            
        sudoku2.walk(
            function(row){
                sudoku2.boardData.rows[row].rowElement = $('<tr></tr>')
                    .addClass('gameBoardTableRow')
                    .attr({
                        'id'       : "row" + row,
                        'data-row' : row
                    });

                sudoku2.gameBoard.append(sudoku2.boardData.rows[row].rowElement);
                
                if (row === 0) {
                    sudoku2.boardData.rows[row].rowElement.addClass('boardTop');
                }
                if (row === 8) {
                    sudoku2.boardData.rows[row].rowElement.addClass('boardBottom');
                }
                if (row % 3 === 0) {
                    sudoku2.boardData.rows[row].rowElement.addClass('blockTop');
                }
                if (row % 3 === 2) {
                    sudoku2.boardData.rows[row].rowElement.addClass('blockBottom');
                }
            },
            function(row, col){
                sudoku2.boardData.rows[row].columns[col].columnElement = $('<td></td>')
                    .addClass('gameBoardTableCell')
                    .attr({
                        'id'       : "row" + row + "col" + col,
                        'data-row' : row,
                        'data-col' : col
                    });
                sudoku2.boardData.rows[row].columns[col].inputElement = $('<a></a>')
                    .addClass('gameBoardInput')
                    .attr({
                        'id'       : "row" + row + "col" + col + "Input",
                        'data-row' : row,
                        'data-col' : col,
                        'type'     : 'text',
                        'href'     : '#'
                    });
                
                sudoku2.boardData.rows[row].rowElement.append(sudoku2.boardData.rows[row].columns[col].columnElement);
                sudoku2.boardData.rows[row].columns[col].columnElement.append(sudoku2.boardData.rows[row].columns[col].inputElement);
                
                if (row === 0) {
                    sudoku2.boardData.rows[row].columns[col].columnElement.addClass('boardTop');
                }
                if (row === 8) {
                    sudoku2.boardData.rows[row].columns[col].columnElement.addClass('boardBottom');
                }
                if (row % 3 === 0) {
                    sudoku2.boardData.rows[row].columns[col].columnElement.addClass('blockTop');
                }
                if (row % 3 === 2) {
                    sudoku2.boardData.rows[row].columns[col].columnElement.addClass('blockBottom');
                }
                if (col === 0) {
                    sudoku2.boardData.rows[row].columns[col].columnElement.addClass('boardFirst');
                }
                if (col === 8) {
                    sudoku2.boardData.rows[row].columns[col].columnElement.addClass('boardLast');
                }
                if (col % 3 === 0) {
                    sudoku2.boardData.rows[row].columns[col].columnElement.addClass('blockFirst');
                }
                if (col % 3 === 2) {
                    sudoku2.boardData.rows[row].columns[col].columnElement.addClass('blockLast');
                }
            }
        )
    },
    
    initGame: function(){
        sudoku2.walk(null, function(row, col){
            sudoku2.boardData.rows[row].columns[col].values = {
                1: null,
                2: null,
                3: null,
                4: null,
                5: null,
                6: null,
                7: null,
                8: null,
                9: null
            }
            
            sudoku2.boardData.rows[row].columns[col].inputElement.html('');
        });

        console.log(sudoku2.boardData);
    },
    
    walk: function(rowCallback, columnCallback){
        var row,col;
        var rowResult, columnResult;
        
        for (row=0; row<9; row++) {
            rowResult = null;
            
            if (rowCallback) {
                rowResult = rowCallback(row);
            }
            
            for (col=0; col<9; col++) {
                columnResult = null;
                
                if (columnCallback) {
                    columnResult = columnCallback(row, col);
                }    
            }
        }
        
        return { row: rowResult, col: columnResult };
    },
    
    moveCursor: {
        move: function(row, col, advance){
            var min = 0, max = 8;
            var newCell = {};
            
            advance = typeof advance !== 'undefined' ?  advance : false;

            newCell.row = sudoku2.currentCell.row + row;
            newCell.col = sudoku2.currentCell.col + col;
            
            if (newCell.row < min) {
                newCell.row = newCell.row + 9;
                if (advance) advance = sudoku2.moveCursor.left;
            }
            if (newCell.row > max) {
                newCell.row = newCell.row - 9;
                if (advance) advance = sudoku2.moveCursor.right;
            }
            if (newCell.col < min) {
                newCell.col = newCell.col + 9;
                if (advance) advance = sudoku2.moveCursor.up;
            }
            if (newCell.col > max) {
                newCell.col = newCell.col - 9;
                if (advance) advance = sudoku2.moveCursor.down;
            }
            
            $('#row' + newCell.row + 'col' + newCell.col + 'Input').focus();
            
            if (typeof advance === 'function') advance();
        },
        up: function(advance){
            advance = typeof advance !== 'undefined' ?  advance : false;
            sudoku2.moveCursor.move(-1, 0, advance);
        },
        down: function(advance){
            advance = typeof advance !== 'undefined' ?  advance : false;
            sudoku2.moveCursor.move(1, 0, advance);
        },
        left: function(advance){
            advance = typeof advance !== 'undefined' ?  advance : false;
            sudoku2.moveCursor.move(0, -1, advance);
        },
        right: function(advance){
            advance = typeof advance !== 'undefined' ?  advance : false;
            sudoku2.moveCursor.move(0, 1, advance);
        }
    },
    
    getLink: function(){
        var data = [];
        
        sudoku2.walk(null, function(row, col){
            var cellValue = sudoku2.boardData.rows[row].columns[col].inputElement.html();
            
            if (cellValue !== "") {
                data.push(cellValue);
            } else {
                data.push('0');
            }
        });
        
        data = btoa(JSON.stringify(data));
        console.log(data);
        
        return data;
    }
};

$(function(){
    sudoku2.init();
    
    $('.gameBoardInput')
        .focus(function(){
            sudoku2.currentCell = {
                row: $(this).data('row'),
                col: $(this).data('col')
            };
            
            $('.lastFocus').removeClass('lastFocus');
            $(this).addClass('lastFocus');
        })
        .click(function(e){
            e.preventDefault();  
        });

    $(document).keydown(function(e){
        console.log(e.which);

        switch(e.which){
            case 37: // left
                sudoku2.moveCursor.left();
                break;
    
            case 38: // up
                sudoku2.moveCursor.up();
                break;
    
            case 39: // right
                sudoku2.moveCursor.right();
                break;
    
            case 40: // down
                sudoku2.moveCursor.down();
                break;

            case 8: // backspace
                if ($('.lastFocus').html() === '') {
                    sudoku2.moveCursor.left(true);
                    $('.lastFocus').html('');
                } else {
                    $('.lastFocus').html('');
                }
                break;
                
            case 9: // tab
                if ( ! e.shiftKey) {
                    sudoku2.moveCursor.right(true);
                } else {
                    sudoku2.moveCursor.left(true);
                }
                break;
                
            case 46: // delete
                $('.lastFocus').html('');
                break;
    
            default: return; // exit this handler for other keys
        }

        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    
    $(document).keypress(function(e){
        if (e.which >= 49 && e.which <= 57) {
            $('.lastFocus').html(String.fromCharCode(e.which));
            sudoku2.moveCursor.right(true);
        }
        
        e.preventDefault();
    });
    
    $('#row' + sudoku2.currentCell.row + 'col' + sudoku2.currentCell.col + 'Input').focus();
    
    sudoku2.getLink();
});