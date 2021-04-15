
"use strict";

var params = null;
var colsEdi = null;
var newColHtml = '<div class="btn-group">' +
  '<button id="btnEdit" type="button" class="btn btn-sm btn-outline-dark mr-1" onclick="edit(this);">' +
  '<i class="fas fa-pen"></i>' +
  '</button>' +
  '<button id="btnDelete" type="button" class="btn btn-sm btn-outline-danger" onclick="deleteRow(this);">' +
  '<i class="fas fa-trash-alt p-1"></i>' +
  '</button>' +
  '<button id="btnAccept" type="button" class="btn btn-sm btn-light mr-1" style="display:none;" onclick="acceptDelete(this);">' +
  '<i class="fas fa-check-square"></i>' +
  '</button>' +
  '<button id="btnCancel" type="button" class="btn btn-sm btn-light" style="display:none;" onclick="cancel(this);">' +
  '<i class="fas fa-window-close"></i>' +
  '</button>' +
  '</div>';
var colEdicHtml = '<td class="editor-element px-1 text-center" name="buttons">' + newColHtml + '</td>';
$.fn.setEditable = function (options) {
  var defaults = {
    columnsEd: null,
    $addButton: null,
    $doneButton: null,
    newPageEdit: false,
    onEdit: function () { },
    onBeforeDelete: function () { },
    onDelete: function () { },
    onAdd: function () { },
    onSave: function () { },
    editNewPage: function () { },
    addNewPage: function () { },
  };
  params = $.extend(defaults, options);
  var $tableEdit = this;
  $tableEdit.find('thead tr').append('<th class="editor-element" name="buttons"></th>');

  $tableEdit.find('tbody tr').append(colEdicHtml);

  if (params.$addButton != null) {

    params.$addButton.click(function () {
      addNewRow($tableEdit.attr("id"));
    });
  }

  if (params.columnsEd != null) {

    colsEdi = params.columnsEd.split(',');
  }
};
function iterateOverCols($cols, action) {

  var n = 0;
  $cols.each(function () {
    n++;
    if ($(this).attr('name') == 'buttons') return;
    if (!IsEditable(n - 1)) return;
    action($(this));
  });

  function IsEditable(idx) {

    if (colsEdi == null) {
      return true;
    } else {
      for (var i = 0; i < colsEdi.length; i++) {
        if (idx == colsEdi[i]) return true;
      }
      return false;
    }
  }
}
function isEditing($row) {
  if ($row.hasClass('editing')) {
    return true;
  } else {
    return false;
  }
}

function SetButtonsNormal(button) {
  $(button).parent().find('#btnAccept').hide();
  $(button).parent().find('#btnCancel').hide();
  $(button).parent().find('#btnEdit').show();
  $(button).parent().find('#btnDelete').show();
  var $row = $(button).parents('tr');
  $row.removeClass('editing');
  if (!$('.editing').length) {
    params.$doneButton.prop('disabled', false);
  }
}
function SetButtonsEdit(button) {
  $(button).parent().find('#btnAccept').show();
  $(button).parent().find('#btnCancel').show();
  $(button).parent().find('#btnEdit').hide();
  $(button).parent().find('#btnDelete').hide();
  var $row = $(button).parents('tr');
  $row.addClass('editing');
  params.$doneButton.prop('disabled', true);
}

function accept(button) {

  var $row = $(button).parents('tr');
  var $cols = $row.find('td');
  if (!isEditing($row)) return;

  iterateOverCols($cols, function ($td) {
    var cont = $td.find('input').val();
    $td.html(cont);
  });
  SetButtonsNormal(button);
  params.onEdit($row);
}
function save(button) {
  var data = {};
  var $row = $(button).parents('tr');
  var $cols = $row.find('td');
  if (!isEditing($row)) return;

  iterateOverCols($cols, function ($td) {
    var name = $td.find('input').attr('name');
    var value = $td.find('input').val();
    data[name] = value;
  });
  params.onSave(data);
}
function cancel(button) {

  var $row = $(button).parents('tr');
  var $cols = $row.find('td');
  if (!isEditing($row)) return;

  iterateOverCols($cols, function ($td) {
    var cont = $td.find('div').html();
    $td.html(cont);
  });
  SetButtonsNormal(button);
}
function edit(button) {

  var $row = $(button).parents('tr');
  var id = $row.attr('data-id');
  if (params.newPageEdit === true) {
    params.editNewPage(id);
    return
  }
  $row.addClass('editor')
  var $cols = $row.find('td');
  if (isEditing($row)) return;

  var focused = false;
  iterateOverCols($cols, function ($td) {
    var cont = $td.html();

    var div = '<div style="display: none;">' + cont + '</div>';
    var input = '<input class="form-control input-sm"  value="' + cont + '">';
    $td.html(div + input);

    if (!focused) {
      $td.find('input').focus();
      focused = true;
    }
  });
  SetButtonsEdit(button);
}
function deleteRow(button) {
  var $row = $(button).parents('tr');
  SetButtonsEdit(button);
  params.onBeforeDelete($row);
}
function acceptDelete(button) {
  var $row = $(button).parents('tr');
  var id = $row.attr('data-id');
  $row.remove();
  SetButtonsNormal(button);
  params.onDelete(id);
}
function addNewRow(tabId, initValues = []) {
  if (params.newPageEdit === true) {
    params.addNewPage();
    return
  }
  var $table = $("#" + tabId);
  var rowInner = '';
  $table.find('thead th').each((id, th) => {
    if ($(th).is(':last-child')) {
      rowInner += `<td class="text-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-success mr-1" onclick="save(this);">
                        <i class="fas fa-save"></i>
                      </button>
                      <button id="btnClear" type="button" class="btn btn-sm btn-outline-dark" onclick="clearForm();">
                        <i class="fas fa-window-close"></i>
                      </button>
                    </div>
                  </td>`
      return
    }
    var name = $(th).text()
      .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^\w/, (c) => c.toLowerCase());

    rowInner += `<td><input class="form-control input-sm" form="addRowForm" name="${name}"></td>`;
  })
  $('.editor-element').remove('tr');
  $table.before('<form id="addRowForm"></form>');
  $table.find('tbody').prepend(`<tr class="editor-element">${rowInner}</tr>`);

  params.onAdd();
}
function clearForm() {
  $('#addRowForm')[0].reset();
}
$.fn.removeEditable = function () {
  $(this).find('.editor-element').remove();
  return this
}